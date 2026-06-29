"""Configuration constants for the LLM Drift Monitor harness."""

from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

# Project root is the parent of the harness/ package
PROJECT_ROOT = Path(__file__).resolve().parent.parent

DB_PATH = str(PROJECT_ROOT / "data" / "drift_monitor.db")
DEFAULT_MODEL = "gemini/gemini-1.5-flash"
PROMPTS_DIR = str(PROJECT_ROOT / "harness" / "prompts")
CURRENT_PROMPT_VERSION = "v2"
