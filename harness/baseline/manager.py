"""Baseline manager for establishing and querying per-prompt baselines."""

import statistics

from harness.db import (
    get_results_by_prompt_id,
    init_db,
    save_baseline,
    save_semantic_baseline,
    get_semantic_baseline,
)
from harness.runner import load_prompts
from harness.config import CURRENT_PROMPT_VERSION


class BaselineManager:
    """Manages baseline establishment for all prompt categories."""

    def establish_baseline(self, prompt_config: dict) -> bool:
        """Establish a baseline for a single prompt.

        For static_ground_truth and deterministic types, the baseline is
        always 1.0 (perfect score is the target). For rolling_median,
        the baseline is the median token_count_output from the first 3
        chronological runs.

        Args:
            prompt_config: A single prompt dict from the prompts JSON.

        Returns:
            True if baseline was established, False if skipped.
        """
        prompt_id = prompt_config["id"]
        category = prompt_config["category"]
        baseline_type = prompt_config["baseline_type"]

        if baseline_type in ("static_ground_truth", "deterministic"):
            save_baseline(
                prompt_id=prompt_id,
                category=category,
                baseline_type=baseline_type,
                baseline_value=1.0,
                sample_count=1,
            )
            return True

        elif baseline_type == "rolling_median":
            results = get_results_by_prompt_id(prompt_id)
            if len(results) < 2:
                print(
                    f"  {prompt_id}: Need 2 runs, have {len(results)} -- skipping"
                )
                return False

            # Use the first 2 chronological runs to establish baseline
            first_two = results[:2]
            token_counts = [r.token_count_output for r in first_two]
            median_value = statistics.median(token_counts)

            save_baseline(
                prompt_id=prompt_id,
                category=category,
                baseline_type=baseline_type,
                baseline_value=median_value,
                sample_count=3,
            )
            
            if category == "verbosity":
                seen_models = set()
                for r in results:
                    if r.model not in seen_models:
                        seen_models.add(r.model)
                        save_semantic_baseline(prompt_id=prompt_id, model=r.model, text=r.raw_output)
                
            return True

        else:
            print(f"  {prompt_id}: Unknown baseline_type '{baseline_type}' -- skipping")
            return False

    def establish_all_baselines(self, prompt_version: str = CURRENT_PROMPT_VERSION) -> None:
        """Establish baselines for all prompts in the suite.

        Loads all prompts, calls establish_baseline() for each, and
        prints a summary of how many were established vs skipped.

        Args:
            prompt_version: The prompt set version to load.
        """
        init_db()
        data = load_prompts(prompt_version)
        prompts = data["prompts"]

        established = 0
        skipped = 0

        print("Establishing baselines...")
        for prompt_config in prompts:
            if self.establish_baseline(prompt_config):
                established += 1
            else:
                skipped += 1

        print(f"\nBaseline summary: {established} established, {skipped} skipped (need more data)")

    def get_baseline_std(self, prompt_id: str, category: str) -> float:
        """Get the standard deviation for a prompt's baseline.

        For static/deterministic categories, returns a fixed small std
        of 0.1 since we expect near-zero variance — any deviation from
        1.0 is meaningful.

        For rolling_median (verbosity) categories, computes actual std
        from all historical RunResult values for that prompt_id. If
        insufficient data (fewer than 3 points), returns a default of
        30.0 as a reasonable token count std assumption.

        Args:
            prompt_id: The prompt identifier.
            category: The prompt category.

        Returns:
            The standard deviation value.
        """
        if category in ("hallucination", "format_adherence", "instruction_following"):
            return 0.1

        # verbosity / rolling_median — compute actual std from history
        results = get_results_by_prompt_id(prompt_id)
        if len(results) < 3:
            return 30.0

        token_counts = [float(r.token_count_output) for r in results]
        return statistics.stdev(token_counts)

    def get_semantic_baseline_text(self, prompt_id: str, model: str) -> str | None:
        result = get_semantic_baseline(prompt_id, model)
        return result.baseline_text if result else None
