export interface Task {
  task_id: string;
  status: string;
  priority: string;
  device_binding: {
    device_id: string;
    device_type: string;
  };
  assigned_device_id: string | null;
  created_at: string;
  updated_at: string;
  result?: TaskResult | null;
}

export interface TaskResult {
  schema_version: string;
  task_id: string;
  status: string;
  started_at: string;
  completed_at: string | null;
  duration_seconds: number;
  device_info: {
    device_id: string;
    hostname: string;
    runner_version: string;
  };
  steps: unknown[];
  summary: {
    total_steps: number;
    successful_steps: number;
    failed_steps: number;
    skipped_steps: number;
    crashed_steps: number;
    total_duration_seconds: number;
    total_artifacts: number;
    total_log_lines: number;
  };
  ai_rca?: Record<string, unknown> | null;
}

export interface TaskStats {
  total: number;
  pending: number;
  assigned: number;
  running: number;
  success: number;
  failed: number;
  timeout: number;
  crashed: number;
}
