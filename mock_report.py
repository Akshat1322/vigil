import harness.runner
from harness.db import get_latest_run_results
from harness.drift.detector import detect_drift_for_run
from harness.drift.bsi import compute_bsi

model = 'ollama/llama3'
results = get_latest_run_results(model)
drift_summary = detect_drift_for_run(model, results)
bsi_score = compute_bsi(drift_summary.drift_results)

print("\n=== DRIFT REPORT ===")
print(f"Model: {model}")
print(f"BSI: {bsi_score}/100")
print(f"Regression Rate: {drift_summary.drifted_count}/{drift_summary.total_count} ({drift_summary.regression_rate * 100:.1f}%)\n")

by_category = {}
for dr in drift_summary.drift_results:
    by_category.setdefault(dr.category, []).append(dr)

for cat in ["hallucination", "format_adherence", "instruction_following", "verbosity"]:
    drifts = [dr for dr in by_category.get(cat, []) if dr.drift_detected]
    stable = len(by_category.get(cat, [])) - len(drifts)
    if not drifts:
        print(f"{cat + ':':27s}no drift ({stable}/{len(by_category.get(cat, []))} stable)")
    else:
        for dr in drifts:
            print(f"{cat + ':':27s}DRIFT in {dr.prompt_id} ({dr.direction}, {dr.magnitude} magnitude)")
        print(f"{'':27s}({stable}/{len(by_category.get(cat, []))} stable)")
