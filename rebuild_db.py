"""Drop database and rebuild for schema change."""

import os
from harness.config import DB_PATH
from harness.db import init_db

print("Dropping old database...")
try:
    os.remove(DB_PATH)
    print("Deleted old DB file.")
except FileNotFoundError:
    pass

print("Re-initializing DB...")
init_db()
print("DB initialized with run_id schema.")

from harness.runner import run_full_suite
from harness.baseline.manager import BaselineManager

for i in range(1, 4):
    print(f"\n--- Fresh Run {i}/3 ---")
    run_full_suite(model="ollama/llama3")

print("\n--- Establishing baselines ---")
BaselineManager().establish_all_baselines()
print("Data generation complete!")
