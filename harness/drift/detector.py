"""Drift detection using statistical comparison against baselines."""

from dataclasses import dataclass
from typing import Optional

from harness.baseline.manager import BaselineManager
from harness.db import get_baseline
from harness.scorers.deterministic import ScoreResult
from harness.scorers.statistical import cosine_similarity


@dataclass
class DriftResult:
    """Result of drift detection for a single prompt."""

    prompt_id: str
    category: str
    z_score: float
    cohens_d: float
    p_value: Optional[float]
    drift_detected: bool
    direction: str  # "increased" or "decreased"
    magnitude: str  # "small", "medium", "large", "none"
    current_mean: float
    baseline_mean: float
    semantic_similarity: Optional[float] = None


@dataclass
class RunDriftSummary:
    drift_results: list[DriftResult]
    regression_rate: float
    drifted_count: int
    total_count: int


def detect_drift_single_prompt(
    prompt_id: str,
    category: str,
    current_scores: list[float],
    baseline_value: float,
    baseline_std: float,
    current_text: Optional[str] = None,
    baseline_text: Optional[str] = None,
) -> DriftResult:
    """Detect drift for a single prompt by comparing current scores to baseline.

    Currently uses a simplified single-point comparison approach:
    - z_score = (current_score - baseline_value) / baseline_std
    - cohens_d = abs(current_score - baseline_value) / baseline_std
    - drift_detected if abs(z_score) > 2.5 AND cohens_d > 0.2

    NOTE: Full Mann-Whitney U testing (scipy.stats.mannwhitneyu) will be
    used once we have multiple historical runs to compare distributions.
    For now, with only 1 current score vs a single baseline value, we
    cannot run distribution-based tests and instead use z-score and
    Cohen's d as simplified effect-size measures.

    Args:
        prompt_id: The prompt identifier.
        category: The prompt category.
        current_scores: List of current run scores (typically length 1).
        baseline_value: The established baseline value.
        baseline_std: The baseline standard deviation.

    Returns:
        A DriftResult with all detection metrics populated.
    """
    current_mean = sum(current_scores) / len(current_scores)

    # Guard against zero std (would cause division by zero)
    if baseline_std == 0:
        baseline_std = 0.01

    z_score = (current_mean - baseline_value) / baseline_std
    cohens_d = abs(current_mean - baseline_value) / baseline_std

    # p_value is None for single-point comparisons — we can't run a
    # proper statistical test without sample distributions
    p_value = None

    # Drift detection thresholds for single-point comparison
    drift_detected = abs(z_score) > 2.5 and cohens_d > 0.2

    # Direction
    if current_mean == baseline_value:
        direction = "unchanged"
    elif current_mean > baseline_value:
        direction = "increased"
    else:
        direction = "decreased"

    # Magnitude based on Cohen's d thresholds
    if not drift_detected:
        magnitude = "none"
    else:
        magnitude = (
            "large" if cohens_d > 0.8 else
            "medium" if cohens_d > 0.5 else
            "small"
        )

    semantic_sim = None
    if current_text is not None and baseline_text is not None and category == "verbosity":
        semantic_sim = cosine_similarity(current_text, baseline_text)
        if semantic_sim is not None and semantic_sim < 0.75:
            if drift_detected:
                magnitude = "large"
            else:
                drift_detected = True
                direction = "semantic_shift"
                magnitude = "medium"

    return DriftResult(
        prompt_id=prompt_id,
        category=category,
        z_score=round(z_score, 3),
        cohens_d=round(cohens_d, 3),
        p_value=p_value,
        drift_detected=drift_detected,
        direction=direction,
        magnitude=magnitude,
        current_mean=round(current_mean, 2),
        baseline_mean=round(baseline_value, 2),
        semantic_similarity=round(semantic_sim, 3) if semantic_sim is not None else None,
    )


def detect_drift_for_run(
    model: str, run_results: list[ScoreResult]
) -> RunDriftSummary:
    """Detect drift for all prompts in a run against their baselines.

    For each unique prompt_id in run_results, fetches the baseline and
    calls detect_drift_single_prompt(). Prompts without baselines are
    skipped with a warning.

    Args:
        model: The model identifier string.
        run_results: List of ScoreResult objects from the current run.

    Returns:
        RunDriftSummary containing drift results and regression metrics.
    """
    manager = BaselineManager()
    drift_results: list[DriftResult] = []

    for result in run_results:
        baseline = get_baseline(result.prompt_id)
        if baseline is None:
            print(f"  [!] {result.prompt_id}: no baseline yet -- skipping drift check")
            continue

        # For verbosity/token_count scorer, the "score" is the token count
        # which should be compared against the baseline token count
        current_score = result.score

        baseline_std = manager.get_baseline_std(result.prompt_id, result.category)
        baseline_text = None
        if result.category == "verbosity":
            baseline_text = manager.get_semantic_baseline_text(result.prompt_id, result.model)

        drift_result = detect_drift_single_prompt(
            prompt_id=result.prompt_id,
            category=result.category,
            current_scores=[current_score],
            baseline_value=baseline.baseline_value,
            baseline_std=baseline_std,
            current_text=result.raw_output,
            baseline_text=baseline_text,
        )
        drift_results.append(drift_result)

    drifted_count = sum(1 for dr in drift_results if dr.drift_detected)
    total_count = len(drift_results)
    regression_rate = drifted_count / total_count if total_count > 0 else 0.0

    return RunDriftSummary(
        drift_results=drift_results,
        regression_rate=regression_rate,
        drifted_count=drifted_count,
        total_count=total_count,
    )
