// Common types

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface Device {
  device_id: string;
  status: string;
  runner_version: string;
  current_task_id: string | null;
  last_seen: string;
}

export interface DeviceStats {
  total: number;
  online: number;
  offline: number;
  idle: number;
}

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

export interface User {
  id: number;
  username: string;
  email: string;
  avatar_url: string | null;
  role: string;
  role_id: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  page_size: number;
}

export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  admins: number;
  users: number;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  read: boolean;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  details?: Record<string, any>;
  created_at: string;
}

export interface SystemSetting {
  id: string;
  key: string;
  value: string;
  category?: string;
  description?: string;
}

export interface ServiceHealth {
  service_name: string;
  status: 'healthy' | 'unhealthy';
  last_check: string;
  uptime: number;
}

export interface DashboardStats {
  totalUsers: number;
  activeDevices: number;
  runningTasks: number;
  pendingTasks: number;
  completedTasks: number;
  failedTasks: number;
}
