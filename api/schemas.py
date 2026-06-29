from pydantic import BaseModel
from datetime import datetime

class CategoryStatus(BaseModel):
    category: str
    stable_count: int
    total_count: int
    drift_detected: bool

class DriftDetail(BaseModel):
    prompt_id: str
    category: str
    z_score: float
    cohens_d: float | None
    p_value: float | None
    drift_detected: bool
    direction: str
    magnitude: str
    current_mean: float
    baseline_mean: float
    semantic_similarity: float | None = None

class ModelSummary(BaseModel):
    model: str
    bsi: float
    status: str  # "stable" if bsi >= 90, "watch" if bsi >= 75, "drift" if below
    last_run_timestamp: datetime
    regression_rate: float
    drifted_count: int
    total_prompts: int
    categories: list[CategoryStatus]

class RunReport(BaseModel):
    model: str
    run_timestamp: datetime
    bsi: float
    regression_rate: float
    drifted_count: int
    total_prompts: int
    drift_details: list[DriftDetail]

class BsiHistoryPoint(BaseModel):
    run_id: str
    timestamp: datetime
    bsi: float
