"""Behavioral Stability Index (BSI) computation from drift results."""

from harness.drift.detector import DriftResult

CATEGORY_WEIGHTS = {
    "hallucination": 0.30,
    "format_adherence": 0.25,
    "instruction_following": 0.25,
    "verbosity": 0.20,
}


def compute_bsi(drift_results: list[DriftResult]) -> float:
    """Compute the Behavioral Stability Index from drift results.

    Groups drift results by category, computes the fraction of prompts
    NOT showing drift in each category, weights by CATEGORY_WEIGHTS,
    and sums to produce a 0-100 score.

    Dynamically renormalizes weights so that if a category has no data
    (e.g. baseline not yet established), the remaining categories scale up
    to represent 100% of the score.

    Example: if hallucination has 5 prompts and 1 drifted,
    category_stability = 4/5 = 0.8. If it's the only active category,
    its normalized weight is 1.0, so it contributes 0.8 * 1.0 * 100 = 80 points.

    Args:
        drift_results: List of DriftResult objects from drift detection.

    Returns:
        BSI score rounded to 1 decimal place (0.0 to 100.0).
    """
    # Group by category
    by_category: dict[str, list[DriftResult]] = {}
    for dr in drift_results:
        by_category.setdefault(dr.category, []).append(dr)

    # Compute sum of weights for categories that actually have data
    active_weight = sum(
        weight for cat, weight in CATEGORY_WEIGHTS.items()
        if cat in by_category and by_category[cat]
    )

    if active_weight == 0:
        return 100.0  # Default to perfect stability if absolutely no drift data exists

    bsi = 0.0
    for category, weight in CATEGORY_WEIGHTS.items():
        results_in_cat = by_category.get(category, [])
        if not results_in_cat:
            # No results for this category (e.g. no baselines yet)
            continue

        stable_count = sum(1 for r in results_in_cat if not r.drift_detected)
        total_count = len(results_in_cat)
        category_stability = stable_count / total_count

        # Renormalize the weight so active categories sum to 1.0
        normalized_weight = weight / active_weight

        bsi += category_stability * normalized_weight * 100

    return round(bsi, 1)
