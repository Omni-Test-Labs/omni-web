import { api } from './api';
import type { Task, Device, User, UserListResponse, DashboardStats, RCAResult } from '../types';

export const apiService = {
  tasks: {
    async list(status?: string): Promise<Task[]> {
      const url = status ? `/api/v1/tasks?status=${status}` : '/api/v1/tasks';
      const response = await api.get<Task[]>(url);
      return response;
    },

    async get(taskId: string): Promise<Task> {
      return api.get<Task>(`/api/v1/tasks/${taskId}`);
    },

    async create(taskData: unknown): Promise<Task> {
      return api.post<Task>('/api/v1/tasks', taskData);
    },

    async assign(taskId: string, device_id: string): Promise<unknown> {
      return api.put(`/api/v1/tasks/${taskId}/assign`, { device_id });
    },

    async uploadResult(taskId: string, result: unknown): Promise<unknown> {
      return api.post(`/api/v1/tasks/${taskId}/result`, result);
    },

    async getRCA(taskId: string): Promise<RCAResult> {
      return api.get<RCAResult>(`/api/v1/tasks/${taskId}/rca`);
    },

    async triggerRCA(taskId: string, forceRefresh = false): Promise<RCAResult> {
      return api.post<RCAResult>(`/api/v1/tasks/${taskId}/rca`, { force_refresh: forceRefresh });
    },

    async getRCAStatus(taskId: string): Promise<{ rca_enabled: boolean; rca_available: boolean; analyzed_at?: string }> {
      return api.get(`/api/v1/tasks/${taskId}/rca/status`);
    },

    async getStats(): Promise<DashboardStats> {
      const tasks = await this.list();
      return {
        totalUsers: 0,
        activeDevices: 0,
        runningTasks: tasks.filter(t => t.status === 'running').length,
        pendingTasks: tasks.filter(t => t.status === 'pending').length,
        completedTasks: tasks.filter(t => t.status === 'success').length,
        failedTasks: tasks.filter(t => ['failed', 'timeout', 'crashed'].includes(t.status)).length,
      };
    },
  },

  devices: {
    async list(status?: string): Promise<Device[]> {
      const url = status ? `/api/v1/devices?status=${status}` : '/api/v1/devices';
      const response = await api.get<Device[]>(url);
      return response;
    },

    async get(deviceId: string): Promise<Device> {
      return api.get<Device>(`/api/v1/devices/${deviceId}`);
    },

    async sendHeartbeat(deviceId: string, heartbeat: unknown): Promise<unknown> {
      return api.post(`/api/v1/devices/${deviceId}/heartbeat`, heartbeat);
    },
  },

  users: {
    async list(page = 1, page_size = 20): Promise<UserListResponse> {
      return api.get<UserListResponse>(`/api/users?page=${page}&page_size=${page_size}`);
    },

    async get(userId: number): Promise<User> {
      return api.get<User>(`/api/users/${userId}`);
    },

    async create(userData: unknown): Promise<User> {
      return api.post<User>('/api/users', userData);
    },

    async update(userId: number, userData: unknown): Promise<User> {
      return api.patch<User>(`/api/users/${userId}`, userData);
    },

    async delete(userId: number): Promise<unknown> {
      return api.delete(`/api/users/${userId}`);
    },

    async getCurrent(): Promise<User | null> {
      try {
        return api.get<User>('/api/auth/me');
      } catch {
        return null;
      }
    },
  },

  dashboard: {
    async getStats(): Promise<DashboardStats> {
      const [tasks, devices] = await Promise.all([
        apiService.tasks.list(),
        apiService.devices.list(),
      ]);

      const usersData = await api.get<{ total: number }>('/api/users/stats').catch(() => ({ total: 0 }));

      return {
        totalUsers: usersData.total || 0,
        activeDevices: devices.filter(d => d.status !== 'offline').length,
        runningTasks: tasks.filter(t => t.status === 'running').length,
        pendingTasks: tasks.filter(t => t.status === 'pending').length,
        completedTasks: tasks.filter(t => t.status === 'success').length,
        failedTasks: tasks.filter(t => ['failed', 'timeout', 'crashed'].includes(t.status)).length,
      };
    },
  },
};
