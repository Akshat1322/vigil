"""Runner for executing prompt suites against LLMs and logging results."""

import json
import time
import uuid
import os
import httpx
from datetime import datetime, timezone
from pathlib import Path

import litellm

from harness.config import PROMPTS_DIR, CURRENT_PROMPT_VERSION
from harness.db import init_db, save_run_result
from harness.scorers.deterministic import (
    ScoreResult,
    exact_count,
    exact_match,
    json_valid,
    token_count,
)


def load_prompts(version: str = CURRENT_PROMPT_VERSION) -> dict:
    """Load the prompts JSON file for the given version.

    Args:
        version: The prompt set version string (e.g. "v1").

    Returns:
        The parsed JSON as a dict with keys "version", "created_date", "prompts".
    """
    path = Path(PROMPTS_DIR) / f"prompts_{version}.json"
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def run_single_prompt(prompt_config: dict, model: str, run_id: str) -> ScoreResult:
    """Run a single prompt against the model and score the output.

    Uses litellm.completion() with temperature=0 for reproducibility.
    Routes to the correct scorer function based on prompt_config["scorer"].

    Args:
        prompt_config: A single prompt dict from the prompts JSON.
        model: The model identifier string (e.g. "ollama/llama3").
        run_id: A UUID string tying this execution to a full suite run.

    Returns:
        A populated ScoreResult with score, raw output, and metadata.
    """
    prompt_text = prompt_config["prompt"]
    scorer_name = prompt_config["scorer"]

    start_time = time.time()
    response = litellm.completion(
        model=model,
        messages=[{"role": "user", "content": prompt_text}],
        temperature=0,
    )
    latency = time.time() - start_time

    raw_output = response.choices[0].message.content or ""

    # Route to the correct scorer
    if scorer_name == "exact_match":
        score = exact_match(raw_output, prompt_config["expected"])
    elif scorer_name == "json_valid":
        score = json_valid(raw_output, prompt_config["required_keys"])
    elif scorer_name == "exact_count":
        score = exact_count(raw_output, prompt_config["expected_count"])
    elif scorer_name == "token_count":
        # For token_count, the "score" is the word count itself
        score = float(token_count(raw_output))
    else:
        raise ValueError(f"Unknown scorer: {scorer_name}")

    output_tokens = token_count(raw_output)

    return ScoreResult(
        prompt_id=prompt_config["id"],
        category=prompt_config["category"],
        score=score,
        raw_output=raw_output,
        scorer_used=scorer_name,
        model=model,
        timestamp=datetime.now(timezone.utc),
        run_id=run_id,
        metadata={
            "latency_seconds": round(latency, 3),
            "token_count_output": output_tokens,
        },
    )


def run_full_suite(model: str, prompt_version: str = CURRENT_PROMPT_VERSION) -> list[ScoreResult]:
    """Run all prompts in a suite, save each result, and print progress.

    Args:
        model: The model identifier string (e.g. "ollama/llama3").
        prompt_version: The prompt set version to load.

    Returns:
        List of all ScoreResult objects from the run.
    """
    data = load_prompts(prompt_version)
    prompts = data["prompts"]
    total = len(prompts)
    results: list[ScoreResult] = []
    run_id = str(uuid.uuid4())

    for i, prompt_config in enumerate(prompts, start=1):
        result = run_single_prompt(prompt_config, model, run_id)
        save_run_result(result)
        results.append(result)

        # Format score display: for token_count, show as int
        if result.scorer_used == "token_count":
            score_display = f"{int(result.score)} tokens"
        else:
            score_display = f"{result.score:.1f}"

        print(f"[{i}/{total}] {result.prompt_id} -> score: {score_display}")

    return results


def run_with_drift_check(model: str, prompt_version: str = CURRENT_PROMPT_VERSION) -> dict:
    """Run the full suite, detect drift, and compute BSI.

    Runs all prompts via run_full_suite(), then performs drift detection
    against established baselines and computes the Behavioral Stability
    Index (BSI). Prints a formatted drift report to console.

    Args:
        model: The model identifier string (e.g. "ollama/llama3").
        prompt_version: The prompt set version to load.

    Returns:
        Dict with keys "results", "drift_results", and "bsi".
    """
    from harness.drift.bsi import compute_bsi
    from harness.drift.detector import detect_drift_for_run

    # Run the full suite
    results = run_full_suite(model, prompt_version)

    # Detect drift
    print("\nChecking for drift...")
    drift_summary = detect_drift_for_run(model, results)

    # Compute BSI
    bsi_score = compute_bsi(drift_summary.drift_results)

    # Print drift report
    print("\n=== DRIFT REPORT ===")
    print(f"Model: {model}")
    print(f"BSI: {bsi_score}/100")
    print(f"Regression Rate: {drift_summary.drifted_count}/{drift_summary.total_count} ({drift_summary.regression_rate * 100:.1f}%)\n")

    # Group drift results by category for summary
    by_category: dict[str, list] = {}
    for dr in drift_summary.drift_results:
        by_category.setdefault(dr.category, []).append(dr)

    # Track which categories had no baselines (not in drift_results at all)
    all_categories = ["hallucination", "format_adherence", "instruction_following", "verbosity"]
    # Also figure out which prompts were skipped (no baseline)
    prompts_with_drift = {dr.prompt_id for dr in drift_summary.drift_results}
    prompts_without_baseline = [r.prompt_id for r in results if r.prompt_id not in prompts_with_drift]
    skipped_by_cat: dict[str, list[str]] = {}
    for pid in prompts_without_baseline:
        cat = next((r.category for r in results if r.prompt_id == pid), "unknown")
        skipped_by_cat.setdefault(cat, []).append(pid)

    for category in all_categories:
        cat_results = by_category.get(category, [])
        skipped = skipped_by_cat.get(category, [])

        if not cat_results and skipped:
            # Count how many runs exist for these prompts
            from harness.db import get_results_by_prompt_id
            sample = get_results_by_prompt_id(skipped[0])
            print(f"{category + ':':27s}no baseline yet (need 3 runs, have {len(sample)})")
            continue

        if not cat_results:
            print(f"{category + ':':27s}no data")
            continue

        drifted = [dr for dr in cat_results if dr.drift_detected]
        stable_count = len(cat_results) - len(drifted)
        total_count = len(cat_results)

        if not drifted:
            print(f"{category + ':':27s}no drift ({stable_count}/{total_count} stable)")
        else:
            for dr in drifted:
                print(
                    f"{category + ':':27s}DRIFT in {dr.prompt_id} "
                    f"({dr.direction}, {dr.magnitude} magnitude)"
                )
            if stable_count > 0:
                print(f"{'':27s}({stable_count}/{total_count} stable)")

    notify_frontend_revalidate()

    return {"results": results, "drift_summary": drift_summary, "bsi": bsi_score}

def notify_frontend_revalidate():
    """
    Tell Next.js to clear its cache after a harness run.
    Only runs if NEXTJS_URL and REVALIDATE_SECRET are set.
    Fails silently if not configured (local dev without
    Next.js running is fine).
    """
    nextjs_url = os.getenv('NEXTJS_URL', 'http://localhost:3000')
    api_url = os.getenv('API_URL', 'http://localhost:8000')
    secret = os.getenv('REVALIDATE_SECRET', '')
    
    # Clear API cache first
    try:
        httpx.post(f"{api_url}/api/cache/clear", timeout=5.0)
        print("API cache cleared successfully")
    except Exception as e:
        print(f"Could not reach API to clear cache: {e}")
        pass
    
    # Then clear Next.js cache
    if not secret:
        return  # not configured, skip silently
    
    try:
        response = httpx.post(
            f"{nextjs_url}/api/revalidate",
            headers={"x-revalidate-secret": secret},
            timeout=5.0
        )
        if response.status_code == 200:
            print("Frontend cache cleared successfully")
        else:
            print(f"Frontend Cache clear failed: {response.status_code}")
    except Exception as e:
        print(f"Could not reach frontend to clear cache: {e}")
        # Fail silently — harness run still succeeded



if __name__ == "__main__":
    import argparse
    import sys
    from harness.baseline.manager import BaselineManager
    from harness.config import DEFAULT_MODEL

    parser = argparse.ArgumentParser(description="Run LLM drift monitor harness.")
    parser.add_argument(
        "--model",
        type=str,
        default=DEFAULT_MODEL,
        help="The model identifier string to test (e.g. ollama/llama3)."
    )
    parser.add_argument(
        "--reset-baselines",
        action="store_true",
        help="Explicitly establish/reset all baselines before running."
    )
    args = parser.parse_args()

    try:
        init_db()
        if args.reset_baselines:
            BaselineManager().establish_all_baselines()
        run_with_drift_check(model=args.model)
    except Exception as e:
        import traceback
        print(f"\n[ERROR] Model '{args.model}' execution failed:")
        traceback.print_exc()
        print("\nExiting with code 1 to fail the GitHub Action.")
        sys.exit(1)
