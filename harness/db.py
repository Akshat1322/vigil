"""SQLite database layer using SQLModel for the LLM Drift Monitor."""

from datetime import date, datetime, timezone
from typing import Optional

from sqlmodel import Field, Session, SQLModel, create_engine, select

from harness.config import DB_PATH
from harness.scorers.deterministic import ScoreResult


class RunResult(SQLModel, table=True):
    """Database table for storing individual prompt run results."""

    __tablename__ = "run_result"

    id: Optional[int] = Field(default=None, primary_key=True)
    prompt_id: str
    category: str
    score: float
    raw_output: str
    scorer_used: str
    model: str
    timestamp: datetime
    run_id: str
    latency_seconds: float
    token_count_output: int


class Baseline(SQLModel, table=True):
    """Database table for storing per-prompt baselines."""

    __tablename__ = "baseline"

    prompt_id: str = Field(primary_key=True)
    category: str
    baseline_type: str  # "static_ground_truth", "deterministic", or "rolling_median"
    baseline_value: float  # expected score (usually 1.0) or median token count
    established_date: datetime
    sample_count: int  # how many runs went into this baseline


class SemanticBaseline(SQLModel, table=True):
    prompt_id: str = Field(primary_key=True)
    model: str = Field(primary_key=True)
    baseline_text: str
    established_date: datetime


_engine = None


def _get_engine():
    """Get or create the SQLite engine (singleton)."""
    global _engine
    if _engine is None:
        _engine = create_engine(f"sqlite:///{DB_PATH}", echo=False)
    return _engine


def init_db() -> None:
    """Create the SQLite database and tables if they don't exist.

    Database is created at the path specified by config.DB_PATH.
    """
    engine = _get_engine()
    SQLModel.metadata.create_all(engine)


def save_run_result(result: ScoreResult) -> None:
    """Insert a ScoreResult into the database as a RunResult row.

    Flattens the metadata dict, extracting latency_seconds and
    token_count_output into dedicated columns.

    Args:
        result: The ScoreResult to persist.
    """
    engine = _get_engine()
    row = RunResult(
        prompt_id=result.prompt_id,
        category=result.category,
        score=result.score,
        raw_output=result.raw_output,
        scorer_used=result.scorer_used,
        model=result.model,
        timestamp=result.timestamp,
        run_id=result.run_id,
        latency_seconds=result.metadata.get("latency_seconds", 0.0),
        token_count_output=result.metadata.get("token_count_output", 0),
    )
    with Session(engine) as session:
        session.add(row)
        session.commit()


def get_results_by_model(model: str) -> list[RunResult]:
    """Fetch all run results for a given model.

    Args:
        model: The model identifier string (e.g. "ollama/llama3").

    Returns:
        List of RunResult rows matching the model.
    """
    engine = _get_engine()
    with Session(engine) as session:
        statement = select(RunResult).where(RunResult.model == model)
        results = session.exec(statement).all()
        return list(results)


def get_results_by_run_date(run_date: date) -> list[RunResult]:
    """Fetch all run results for a given date.

    Matches any result whose timestamp falls on the specified date.

    Args:
        run_date: The date to filter by.

    Returns:
        List of RunResult rows from that date.
    """
    engine = _get_engine()
    start = datetime.combine(run_date, datetime.min.time())
    end = datetime.combine(run_date, datetime.max.time())
    with Session(engine) as session:
        statement = select(RunResult).where(
            RunResult.timestamp >= start,
            RunResult.timestamp <= end,
        )
        results = session.exec(statement).all()
        return list(results)


def get_results_by_prompt_id(prompt_id: str) -> list[RunResult]:
    """Fetch all run results for a given prompt_id, ordered by timestamp.

    Args:
        prompt_id: The prompt identifier string.

    Returns:
        List of RunResult rows matching the prompt_id, chronologically ordered.
    """
    engine = _get_engine()
    with Session(engine) as session:
        statement = (
            select(RunResult)
            .where(RunResult.prompt_id == prompt_id)
            .order_by(RunResult.timestamp)
        )
        results = session.exec(statement).all()
        return list(results)


def save_baseline(
    prompt_id: str,
    category: str,
    baseline_type: str,
    baseline_value: float,
    sample_count: int,
) -> None:
    """Upsert a baseline row for the given prompt_id.

    If a baseline already exists for this prompt_id, it is updated.
    Otherwise a new row is inserted.

    Args:
        prompt_id: The prompt identifier.
        category: The prompt category.
        baseline_type: One of "static_ground_truth", "deterministic", "rolling_median".
        baseline_value: The baseline score or token count.
        sample_count: Number of runs that went into this baseline.
    """
    engine = _get_engine()
    with Session(engine) as session:
        existing = session.get(Baseline, prompt_id)
        if existing:
            existing.category = category
            existing.baseline_type = baseline_type
            existing.baseline_value = baseline_value
            existing.established_date = datetime.now(timezone.utc)
            existing.sample_count = sample_count
            session.add(existing)
        else:
            row = Baseline(
                prompt_id=prompt_id,
                category=category,
                baseline_type=baseline_type,
                baseline_value=baseline_value,
                established_date=datetime.now(timezone.utc),
                sample_count=sample_count,
            )
            session.add(row)
        session.commit()


def get_baseline(prompt_id: str) -> Optional[Baseline]:
    """Fetch the baseline for a given prompt_id.

    Args:
        prompt_id: The prompt identifier.

    Returns:
        The Baseline row, or None if no baseline exists.
    """
    engine = _get_engine()
    with Session(engine) as session:
        return session.get(Baseline, prompt_id)


def get_all_baselines() -> list[Baseline]:
    """Fetch all baselines.

    Returns:
        List of all Baseline rows.
    """
    engine = _get_engine()
    with Session(engine) as session:
        statement = select(Baseline)
        results = session.exec(statement).all()
        return list(results)


def save_semantic_baseline(prompt_id: str, model: str, text: str) -> None:
    engine = _get_engine()
    with Session(engine) as session:
        existing = session.get(SemanticBaseline, (prompt_id, model))
        if existing:
            existing.baseline_text = text
            existing.established_date = datetime.now(timezone.utc)
            session.add(existing)
        else:
            row = SemanticBaseline(
                prompt_id=prompt_id,
                model=model,
                baseline_text=text,
                established_date=datetime.now(timezone.utc),
            )
            session.add(row)
        session.commit()


def get_semantic_baseline(prompt_id: str, model: str) -> Optional[SemanticBaseline]:
    engine = _get_engine()
    with Session(engine) as session:
        return session.get(SemanticBaseline, (prompt_id, model))
