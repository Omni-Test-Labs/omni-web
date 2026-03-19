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

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface Device {
  id: string;
  name: string;
  type: 'ssh' | 'serial' | 'mobile' | 'http' | 'iot';
  host: string;
  port?: number;
  status: 'online' | 'offline' | 'error';
  config?: Record<string, any>;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  name: string;
  type: 'command' | 'test_case' | 'pipeline' | 'custom';
  description?: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  created_by: string;
  created_at: string;
  updated_at: string;
  config?: Record<string, any>;
}

export interface TaskExecution {
  id: string;
  task_id: string;
  status: 'running' | 'completed' | 'failed';
  start_time: string;
  end_time?: string;
  result?: Record<string, any>;
  logs?: string[];
}

export interface TestApplication {
  id: string;
  name: string;
  type: 'web' | 'mobile' | 'hardware' | 'api' | 'iot';
  version?: string;
  description?: string;
  config?: Record<string, any>;
  created_at: string;
  updated_at: string;
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
