from datetime import datetime
from sqlmodel import Session, select
from harness.db import _get_engine, RunResult

def get_distinct_models() -> list[str]:
    """Return a list of all unique models that have run data."""
    engine = _get_engine()
    with Session(engine) as session:
        statement = select(RunResult.model).distinct()
        return list(session.exec(statement).all())

def get_latest_run_results(model: str) -> list[RunResult]:
    """Get the full set of RunResults for the most recent complete run (100 prompts) of a model."""
    engine = _get_engine()
    with Session(engine) as session:
        # Get all run_ids for this model ordered by timestamp descending
        statement = select(RunResult.run_id).where(RunResult.model == model).group_by(RunResult.run_id).order_by(RunResult.timestamp.desc())
        run_ids = list(session.exec(statement).all())
        
        for run_id in run_ids:
            # Fetch all results sharing that run_id
            statement = select(RunResult).where(RunResult.model == model, RunResult.run_id == run_id)
            results = list(session.exec(statement).all())
            if len(results) == 100:
                return results
                
        return []

def get_all_runs_for_model(model: str) -> list[list[RunResult]]:
    """Get RunResults for all runs of a model, grouped by run_id and ordered by most recent first."""
    engine = _get_engine()
    with Session(engine) as session:
        statement = select(RunResult.run_id).where(RunResult.model == model).group_by(RunResult.run_id).order_by(RunResult.timestamp.desc())
        run_ids = list(session.exec(statement).all())
        
        runs = []
        for rid in run_ids:
            statement = select(RunResult).where(RunResult.model == model, RunResult.run_id == rid)
            runs.append(list(session.exec(statement).all()))
            
        return runs

def get_run_timestamp_groups(model: str) -> list[datetime]:
    """Get a list of timestamps representing distinct runs for a model."""
    engine = _get_engine()
    with Session(engine) as session:
        statement = select(RunResult.timestamp).where(RunResult.model == model).group_by(RunResult.run_id).order_by(RunResult.timestamp.desc())
        return list(session.exec(statement).all())
