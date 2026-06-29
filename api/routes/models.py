from fastapi import APIRouter, HTTPException, Path
from api.schemas import ModelSummary, RunReport, CategoryStatus, DriftDetail, BsiHistoryPoint
from api.db_queries import get_distinct_models, get_latest_run_results, get_all_runs_for_model
from harness.drift.detector import detect_drift_for_run
from harness.drift.bsi import compute_bsi
from datetime import datetime, timedelta
from typing import Any

# Simple in-memory cache
_cache: dict[str, tuple[Any, datetime]] = {}
CACHE_TTL_SECONDS = 60

def get_cached(key: str) -> Any | None:
    if key in _cache:
        data, expiry = _cache[key]
        if datetime.now() < expiry:
            return data
        else:
            del _cache[key]
    return None

def set_cached(key: str, data: Any) -> None:
    _cache[key] = (
        data, 
        datetime.now() + timedelta(seconds=CACHE_TTL_SECONDS)
    )

def invalidate_cache() -> None:
    _cache.clear()

router = APIRouter()
cache_router = APIRouter()

@cache_router.post("/clear")
def clear_cache():
    invalidate_cache()
    return {"cleared": True, "timestamp": datetime.now().isoformat()}

def _build_summary_from_results(model: str, results: list) -> ModelSummary | None:
    if not results:
        return None
        
    drift_summary = detect_drift_for_run(model, results)
    bsi = compute_bsi(drift_summary.drift_results)
    
    if bsi >= 90:
        status = "stable"
    elif bsi >= 75:
        status = "watch"
    else:
        status = "drift"
        
    by_category = {}
    for dr in drift_summary.drift_results:
        by_category.setdefault(dr.category, []).append(dr)
        
    categories = []
    all_cats_in_run = {r.category for r in results}
    
    for cat in all_cats_in_run:
        cat_drifts = by_category.get(cat, [])
        total_count = len([r for r in results if r.category == cat])
        if not cat_drifts:
            categories.append(CategoryStatus(
                category=cat, 
                stable_count=total_count, 
                total_count=total_count, 
                drift_detected=False
            ))
        else:
            drifted = [dr for dr in cat_drifts if dr.drift_detected]
            stable_count = len(cat_drifts) - len(drifted)
            drift_detected = len(drifted) > 0
            categories.append(CategoryStatus(
                category=cat, 
                stable_count=stable_count, 
                total_count=len(cat_drifts), 
                drift_detected=drift_detected
            ))
            
    timestamp = results[0].timestamp
    
    return ModelSummary(
        model=model,
        bsi=bsi,
        status=status,
        last_run_timestamp=timestamp,
        regression_rate=drift_summary.regression_rate,
        drifted_count=drift_summary.drifted_count,
        total_prompts=drift_summary.total_count,
        categories=categories
    )

def _build_model_summary(model: str) -> ModelSummary | None:
    results = get_latest_run_results(model)
    return _build_summary_from_results(model, results)

@router.get("/{model_name:path}/history", response_model=list[BsiHistoryPoint])
def get_model_history(model_name: str = Path(...)):
    cache_key = f"history_{model_name}"
    cached = get_cached(cache_key)
    if cached is not None:
        return cached

    runs = get_all_runs_for_model(model_name)
    if not runs:
        raise HTTPException(status_code=404, detail="Model not found")
        
    history_points = []
    for results in runs:
        if len(results) != 100:
            continue
            
        drift_summary = detect_drift_for_run(model_name, results)
        bsi = compute_bsi(drift_summary.drift_results)
        
        # Earliest timestamp in this run
        timestamp = min(r.timestamp for r in results)
        
        history_points.append(BsiHistoryPoint(
            run_id=results[0].run_id,
            timestamp=timestamp,
            bsi=bsi
        ))
            
    # Order oldest first
    history_points.sort(key=lambda x: x.timestamp)
    set_cached(cache_key, history_points)
    return history_points

@router.get("", response_model=list[ModelSummary])
def get_models():
    cache_key = "all_models"
    cached = get_cached(cache_key)
    if cached is not None:
        return cached

    models = get_distinct_models()
    summaries = []
    for m in models:
        summary = _build_model_summary(m)
        if summary:
            summaries.append(summary)
            
    set_cached(cache_key, summaries)
    return summaries

@router.get("/{model_name:path}/report", response_model=RunReport)
def get_model_report(model_name: str = Path(...)):
    cache_key = f"report_{model_name}"
    cached = get_cached(cache_key)
    if cached is not None:
        return cached

    results = get_latest_run_results(model_name)
    if not results:
        raise HTTPException(status_code=404, detail="Model not found")
        
    drift_summary = detect_drift_for_run(model_name, results)
    bsi = compute_bsi(drift_summary.drift_results)
    timestamp = results[0].timestamp
    
    details = []
    for dr in drift_summary.drift_results:
        details.append(DriftDetail(
            prompt_id=dr.prompt_id,
            category=dr.category,
            z_score=dr.z_score,
            cohens_d=dr.cohens_d,
            p_value=dr.p_value,
            drift_detected=dr.drift_detected,
            direction=dr.direction,
            magnitude=dr.magnitude,
            current_mean=dr.current_mean,
            baseline_mean=dr.baseline_mean,
            semantic_similarity=dr.semantic_similarity
        ))
        
    report = RunReport(
        model=model_name,
        run_timestamp=timestamp,
        bsi=bsi,
        regression_rate=drift_summary.regression_rate,
        drifted_count=drift_summary.drifted_count,
        total_prompts=drift_summary.total_count,
        drift_details=details
    )
    set_cached(cache_key, report)
    return report

@router.get("/{model_name:path}", response_model=ModelSummary)
def get_model(model_name: str = Path(...)):
    cache_key = f"model_{model_name}"
    cached = get_cached(cache_key)
    if cached is not None:
        return cached

    summary = _build_model_summary(model_name)
    if not summary:
        raise HTTPException(status_code=404, detail="Model not found")
        
    set_cached(cache_key, summary)
    return summary
