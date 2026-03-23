import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest';
import { api } from '../services/api';
import { apiService } from '../services/dashboardApi';

vi.mock('../services/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockApi = vi.mocked(api);

describe('ApiService Integration Tests', () => {
  beforeAll(() => {
    expect.extend({});
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Tasks Service', () => {
    describe('list()', () => {
      it('should list all tasks without status filter', async () => {
        const mockTasks = [
          { id: 1, task_id: 'task-001', status: 'pending' },
          { id: 2, task_id: 'task-002', status: 'running' },
        ];
        mockApi.get.mockResolvedValue(mockTasks);

        const result = await apiService.tasks.list();
        expect(result).toEqual(mockTasks);
        expect(mockApi.get).toHaveBeenCalledWith('/api/v1/tasks');
      });

      it('should list tasks filtered by status', async () => {
        const mockTasks = [{ id: 1, task_id: 'task-001', status: 'pending' }];
        mockApi.get.mockResolvedValue(mockTasks);

        const result = await apiService.tasks.list('pending');
        expect(result).toEqual(mockTasks);
        expect(mockApi.get).toHaveBeenCalledWith('/api/v1/tasks?status=pending');
      });
    });

    describe('get()', () => {
      it('should get task by ID', async () => {
        const mockTask = { id: 1, task_id: 'task-001', status: 'running' };
        mockApi.get.mockResolvedValue(mockTask);

        const result = await apiService.tasks.get('task-001');
        expect(result).toEqual(mockTask);
        expect(mockApi.get).toHaveBeenCalledWith('/api/v1/tasks/task-001');
      });
    });

    describe('create()', () => {
      it('should create new task', async () => {
        const taskManifest = { task_id: 'task-003', pipeline: [] };
        const mockTask = { id: 3, ...taskManifest };
        mockApi.post.mockResolvedValue(mockTask);

        const result = await apiService.tasks.create(taskManifest);
        expect(result).toEqual(mockTask);
        expect(mockApi.post).toHaveBeenCalledWith('/api/v1/tasks', taskManifest);
      });
    });

    describe('assign()', () => {
      it('should assign task to device', async () => {
        const mockResponse = { success: true };
        mockApi.put.mockResolvedValue(mockResponse);

        const result = await apiService.tasks.assign('task-001', 'device-001');
        expect(result).toEqual({ success: true });
        expect(mockApi.put).toHaveBeenCalledWith('/api/v1/tasks/task-001/assign', { device_id: 'device-001' });
      });
    });

    describe('uploadResult()', () => {
      it('should upload task result', async () => {
        const resultData = { status: 'success', output: 'Test output' };
        const mockResponse = { success: true };
        mockApi.post.mockResolvedValue(mockResponse);

        const result = await apiService.tasks.uploadResult('task-001', resultData);
        expect(result).toEqual({ success: true });
        expect(mockApi.post).toHaveBeenCalledWith('/api/v1/tasks/task-001/result', resultData);
      });
    });

    describe('getRCA()', () => {
      it('should get RCA result for task', async () => {
        const mockRCA = { rca_enabled: true, analysis: 'Test analysis' };
        mockApi.get.mockResolvedValue(mockRCA);

        const result = await apiService.tasks.getRCA('task-001');
        expect(result).toEqual(mockRCA);
        expect(mockApi.get).toHaveBeenCalledWith('/api/v1/tasks/task-001/rca');
      });
    });

    describe('triggerRCA()', () => {
      it('should trigger RCA for task', async () => {
        const mockRCA = { rca_enabled: true, analysis: 'New analysis' };
        mockApi.post.mockResolvedValue(mockRCA);

        const result = await apiService.tasks.triggerRCA('task-001', false);
        expect(result).toEqual(mockRCA);
        expect(mockApi.post).toHaveBeenCalledWith('/api/v1/tasks/task-001/rca', { force_refresh: false });
      });

      it('should trigger RCA with force refresh', async () => {
        const mockRCA = { rca_enabled: true, analysis: 'Refreshed analysis' };
        mockApi.post.mockResolvedValue(mockRCA);

        const result = await apiService.tasks.triggerRCA('task-001', true);
        expect(result).toEqual(mockRCA);
        expect(mockApi.post).toHaveBeenCalledWith('/api/v1/tasks/task-001/rca', { force_refresh: true });
      });
    });

    describe('getRCAStatus()', () => {
      it('should get RCA status for task', async () => {
        const mockStatus = { rca_enabled: true, rca_available: true, analyzed_at: '2024-03-23' };
        mockApi.get.mockResolvedValue(mockStatus);

        const result = await apiService.tasks.getRCAStatus('task-001');
        expect(result).toEqual(mockStatus);
        expect(mockApi.get).toHaveBeenCalledWith('/api/v1/tasks/task-001/rca/status');
      });
    });

    describe('getStats()', () => {
      it('should calculate task statistics', async () => {
        const mockTasks = [
          { id: 1, status: 'running' },
          { id: 2, status: 'pending' },
          { id: 3, status: 'success' },
          { id: 4, status: 'failed' },
        ];
        mockApi.get.mockResolvedValue(mockTasks);

        const result = await apiService.tasks.getStats();
        expect(result).toEqual({
          totalUsers: 0,
          activeDevices: 0,
          runningTasks: 1,
          pendingTasks: 1,
          completedTasks: 1,
          failedTasks: 1,
        });
        expect(mockApi.get).toHaveBeenCalledWith('/api/v1/tasks');
      });
    });
  });

  describe('Devices Service', () => {
    describe('list()', () => {
      it('should list all devices without status filter', async () => {
        const mockDevices = [
          { id: 1, device_id: 'device-001', status: 'idle' },
          { id: 2, device_id: 'device-002', status: 'running' },
        ];
        mockApi.get.mockResolvedValue(mockDevices);

        const result = await apiService.devices.list();
        expect(result).toEqual(mockDevices);
        expect(mockApi.get).toHaveBeenCalledWith('/api/v1/devices');
      });

      it('should list devices filtered by status', async () => {
        const mockDevices = [{ id: 1, device_id: 'device-001', status: 'idle' }];
        mockApi.get.mockResolvedValue(mockDevices);

        const result = await apiService.devices.list('idle');
        expect(result).toEqual(mockDevices);
        expect(mockApi.get).toHaveBeenCalledWith('/api/v1/devices?status=idle');
      });
    });

    describe('get()', () => {
      it('should get device by ID', async () => {
        const mockDevice = { id: 1, device_id: 'device-001', status: 'idle' };
        mockApi.get.mockResolvedValue(mockDevice);

        const result = await apiService.devices.get('device-001');
        expect(result).toEqual(mockDevice);
        expect(mockApi.get).toHaveBeenCalledWith('/api/v1/devices/device-001');
      });
    });

    describe('sendHeartbeat()', () => {
      it('should send heartbeat for device', async () => {
        const heartbeat = {
          device_id: 'device-001',
          status: 'idle',
          current_task_id: null,
          runner_version: '1.0.0',
        };
        const mockResponse = { status: 'ok' };
        mockApi.post.mockResolvedValue(mockResponse);

        const result = await apiService.devices.sendHeartbeat('device-001', heartbeat);
        expect(result).toEqual({ status: 'ok' });
        expect(mockApi.post).toHaveBeenCalledWith('/api/v1/devices/device-001/heartbeat', heartbeat);
      });
    });
  });

  describe('Users Service', () => {
    describe('list()', () => {
      it('should list users with default pagination', async () => {
        const mockUsers = {
          users: [{ id: 1, username: 'user1' }, { id: 2, username: 'user2' }],
          total: 2,
          page: 1,
          page_size: 20,
        };
        mockApi.get.mockResolvedValue(mockUsers);

        const result = await apiService.users.list();
        expect(result).toEqual(mockUsers);
        expect(mockApi.get).toHaveBeenCalledWith('/api/users?page=1&page_size=20');
      });

      it('should list users with custom pagination', async () => {
        const mockUsers = {
          users: [{ id: 1, username: 'user1' }],
          total: 1,
          page: 2,
          page_size: 10,
        };
        mockApi.get.mockResolvedValue(mockUsers);

        const result = await apiService.users.list(2, 10);
        expect(result).toEqual(mockUsers);
        expect(mockApi.get).toHaveBeenCalledWith('/api/users?page=2&page_size=10');
      });
    });

    describe('get()', () => {
      it('should get user by ID', async () => {
        const mockUser = { id: 1, username: 'testuser', email: 'test@example.com' };
        mockApi.get.mockResolvedValue(mockUser);

        const result = await apiService.users.get(1);
        expect(result).toEqual(mockUser);
        expect(mockApi.get).toHaveBeenCalledWith('/api/users/1');
      });
    });

    describe('create()', () => {
      it('should create new user', async () => {
        const userData = { username: 'newuser', email: 'new@example.com', password: 'pass123' };
        const mockUser = { id: 3, username: 'newuser', email: 'new@example.com' };
        mockApi.post.mockResolvedValue(mockUser);

        const result = await apiService.users.create(userData);
        expect(result).toEqual(mockUser);
        expect(mockApi.post).toHaveBeenCalledWith('/api/users', userData);
      });
    });

    describe('update()', () => {
      it('should update user', async () => {
        const userData = { email: 'updated@example.com' };
        const mockUser = { id: 1, username: 'testuser', email: 'updated@example.com' };
        mockApi.patch.mockResolvedValue(mockUser);

        const result = await apiService.users.update(1, userData);
        expect(result).toEqual(mockUser);
        expect(mockApi.patch).toHaveBeenCalledWith('/api/users/1', userData);
      });
    });

    describe('delete()', () => {
      it('should delete user', async () => {
        const mockResponse = { success: true };
        mockApi.delete.mockResolvedValue(mockResponse);

        const result = await apiService.users.delete(1);
        expect(result).toEqual({ success: true });
        expect(mockApi.delete).toHaveBeenCalledWith('/api/users/1');
      });
    });

    describe('getCurrent()', () => {
      it('should get current user', async () => {
        const mockUser = { id: 1, username: 'testuser', email: 'test@example.com' };
        mockApi.get.mockResolvedValue(mockUser);

        const result = await apiService.users.getCurrent();
        expect(result).toEqual(mockUser);
        expect(mockApi.get).toHaveBeenCalledWith('/api/auth/me');
      });
    });
  });

  describe('Dashboard Service', () => {
    describe('getStats()', () => {
      it('should get dashboard statistics', async () => {
        const mockTasks = [
          { id: 1, status: 'running' },
          { id: 2, status: 'pending' },
          { id: 3, status: 'success' },
        ];
        const mockDevices = [
          { id: 1, status: 'idle' },
          { id: 2, status: 'offline' },
        ];
        const mockUsers = { total: 10 };

        mockApi.get
          .mockResolvedValueOnce(mockTasks)
          .mockResolvedValueOnce(mockDevices)
          .mockResolvedValueOnce(mockUsers);

        const result = await apiService.dashboard.getStats();
        expect(result).toEqual({
          totalUsers: 10,
          activeDevices: 1,
          runningTasks: 1,
          pendingTasks: 1,
          completedTasks: 1,
          failedTasks: 0,
        });
      });

      it('should handle missing user stats', async () => {
        const mockTasks = [{ id: 1, status: 'running' }];
        const mockDevices = [{ id: 1, status: 'idle' }];

        mockApi.get
          .mockResolvedValueOnce(mockTasks)
          .mockResolvedValueOnce(mockDevices)
          .mockRejectedValueOnce(new Error('Unauthorized'));

        const result = await apiService.dashboard.getStats();
        expect(result).toEqual({
          totalUsers: 0,
          activeDevices: 1,
          runningTasks: 1,
          pendingTasks: 0,
          completedTasks: 0,
          failedTasks: 0,
        });
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors on tasks.list()', async () => {
      mockApi.get.mockRejectedValue(new Error('Network Error'));

      await expect(apiService.tasks.list()).rejects.toThrow('Network Error');
    });

    it('should handle 404 error on tasks.get()', async () => {
      const error = new Error('Not Found');
      error.name = 'Error';
      mockApi.get.mockRejectedValue(error);

      await expect(apiService.tasks.get('nonexistent')).rejects.toThrow('Not Found');
    });

    it('should handle server errors on devices.list()', async () => {
      const error = new Error('Internal Server Error');
      mockApi.get.mockRejectedValue(error);

      await expect(apiService.devices.list()).rejects.toThrow('Internal Server Error');
    });
  });
});
