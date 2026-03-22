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
