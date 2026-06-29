import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

axios.interceptors.request.use(config => {
  if (config.method === 'get') {
    config.params = { ...config.params, _t: Date.now() };
  }
  return config;
});

export interface CategoryStatus {
  category: string;
  stable_count: number;
  total_count: number;
  drift_detected: boolean;
}

export interface DriftDetail {
  prompt_id: string;
  category: string;
  z_score: number;
  cohens_d: number | null;
  p_value: number | null;
  drift_detected: boolean;
  direction: string;
  magnitude: string;
  current_mean: number;
  baseline_mean: number;
  semantic_similarity: number | null;
}

export interface ModelSummary {
  model: string;
  bsi: number;
  status: string;
  last_run_timestamp: string;
  regression_rate: number;
  drifted_count: number;
  total_prompts: number;
  categories: CategoryStatus[];
}

export interface RunReport {
  model: string;
  run_timestamp: string;
  bsi: number;
  regression_rate: number;
  drifted_count: number;
  total_prompts: number;
  drift_details: DriftDetail[];
}

export async function getModels(): Promise<ModelSummary[]> {
  try {
    const response = await axios.get<ModelSummary[]>(`${API_BASE_URL}/api/models`);
    return response.data;
  } catch (error: any) {
    // Silently handle backend offline state so the dev overlay doesn't pop up
    return [];
  }
}

export async function getModel(modelName: string): Promise<ModelSummary> {
  try {
    const response = await axios.get<ModelSummary>(`${API_BASE_URL}/api/models/${encodeURIComponent(modelName)}`);
    return response.data;
  } catch (error) {
    return {
      model: modelName,
      bsi: 0,
      status: 'stable',
      last_run_timestamp: new Date().toISOString(),
      regression_rate: 0,
      drifted_count: 0,
      total_prompts: 0,
      categories: []
    };
  }
}

export async function getModelReport(modelName: string): Promise<RunReport> {
  try {
    const response = await axios.get<RunReport>(`${API_BASE_URL}/api/models/${encodeURIComponent(modelName)}/report`);
    return response.data;
  } catch (error) {
    return {
      model: modelName,
      run_timestamp: new Date().toISOString(),
      bsi: 0,
      regression_rate: 0,
      drifted_count: 0,
      total_prompts: 0,
      drift_details: []
    };
  }
}

export interface BsiHistoryPoint {
  run_id: string;
  timestamp: string;
  bsi: number;
}

export async function getModelHistory(modelName: string): Promise<BsiHistoryPoint[]> {
  try {
    const response = await axios.get<BsiHistoryPoint[]>(`${API_BASE_URL}/api/models/${encodeURIComponent(modelName)}/history`);
    return response.data;
  } catch (error) {
    return [];
  }
}
