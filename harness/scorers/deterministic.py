"""Deterministic scoring functions for LLM output evaluation."""

import json
import re
from dataclasses import dataclass, field
from datetime import datetime


@dataclass
class ScoreResult:
    """Result of scoring a single prompt execution."""

    prompt_id: str
    category: str
    score: float
    raw_output: str
    scorer_used: str
    model: str
    timestamp: datetime
    run_id: str
    metadata: dict = field(default_factory=dict)


def exact_match(output: str, expected: str) -> float:
    """Check if the output exactly matches the expected answer after normalization.

    Normalization: strip whitespace and convert to lowercase on both sides.

    Args:
        output: The model's raw output string.
        expected: The expected correct answer.

    Returns:
        1.0 if normalized output matches normalized expected, else 0.0.
    """
    import string
    out_clean = output.strip().lower().rstrip(string.punctuation)
    exp_clean = expected.strip().lower().rstrip(string.punctuation)
    return 1.0 if out_clean == exp_clean else 0.0


def json_valid(output: str, required_keys: list[str]) -> float:
    """Validate that the output is valid JSON and contains all required keys.

    Handles cases where the model wraps JSON in markdown code fences
    (e.g. ```json ... ``` or ``` ... ```).

    Args:
        output: The model's raw output string.
        required_keys: List of key names that must be present in the parsed JSON.

    Returns:
        1.0 if valid JSON and all required_keys are present.
        0.5 if valid JSON but some required_keys are missing.
        0.0 if the output is not valid JSON at all.
    """
    # Strip markdown code fences if present
    text = output.strip()
    fence_pattern = re.compile(r"```(?:json)?\s*\n?(.*?)\n?\s*```", re.DOTALL)
    match = fence_pattern.search(text)
    if match:
        text = match.group(1).strip()

    try:
        parsed = json.loads(text)
    except (json.JSONDecodeError, ValueError):
        return 0.0

    if not isinstance(parsed, dict):
        return 0.0

    present_keys = set(parsed.keys())
    required_set = set(required_keys)

    if required_set.issubset(present_keys):
        return 1.0
    else:
        return 0.5


def exact_count(output: str, expected_count: int) -> float:
    """Count the number of list items in the output and compare to expected.

    Handles both numbered lists (1. 2. 3.) and bullet lists (- or *).
    Counts non-empty lines, stripping list prefixes.

    Args:
        output: The model's raw output string.
        expected_count: The expected number of items.

    Returns:
        1.0 if the count of non-empty lines matches expected_count, else 0.0.
    """
    lines = [l.strip() for l in output.strip().split('\n') if l.strip()]
    # filter preamble lines
    filtered = [
        l for l in lines
        if not l.endswith(':')
        and not l.lower().startswith('here')
        and not l.lower().startswith('the following')
    ]
    return 1.0 if len(filtered) == expected_count else 0.0


def token_count(output: str) -> int:
    """Count tokens in the output using simple whitespace splitting.

    This is a rough approximation; can be upgraded to tiktoken later.

    Args:
        output: The model's raw output string.

    Returns:
        Number of whitespace-separated words in the output.
    """
    return len(output.split())
