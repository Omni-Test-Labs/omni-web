import { describe, it, expect } from 'vitest';
import { apiConfig, ws } from '../config/api';

describe('API Configuration', () => {
  it('should have correct API prefix', () => {
    expect(apiConfig.prefix).toBe('http://localhost:8000');
  });

  it('should have all auth endpoints', () => {
    expect(apiConfig.auth.login).toBe('http://localhost:8000/api/auth/login');
    expect(apiConfig.auth.register).toBe('http://localhost:8000/api/auth/register');
    expect(apiConfig.auth.logout).toBe('http://localhost:8000/api/auth/logout');
    expect(apiConfig.auth.refresh).toBe('http://localhost:8000/api/auth/refresh');
    expect(apiConfig.auth.me).toBe('http://localhost:8000/api/auth/me');
  });

  it('should have OAuth endpoints', () => {
    expect(apiConfig.auth.github).toContain('/api/auth/oauth/github');
    expect(apiConfig.auth.githubCallback).toContain('/api/auth/oauth/github/callback');
    expect(apiConfig.auth.gitlab).toContain('/api/auth/oauth/gitlab');
    expect(apiConfig.auth.gitlabCallback).toContain('/api/auth/oauth/gitlab/callback');
  });

  it('should have devices endpoints', () => {
    expect(apiConfig.devices.list).toBe('http://localhost:8000/api/devices');
    expect(apiConfig.devices.create).toBe('http://localhost:8000/api/devices');
    expect(apiConfig.devices.get('123')).toBe('http://localhost:8000/api/devices/123');
    expect(apiConfig.devices.update('456')).toBe('http://localhost:8000/api/devices/456');
    expect(apiConfig.devices.delete('789')).toBe('http://localhost:8000/api/devices/789');
  });

  it('should have tasks endpoints', () => {
    expect(apiConfig.tasks.list).toBe('http://localhost:8000/api/tasks');
    expect(apiConfig.tasks.create).toBe('http://localhost:8000/api/tasks');
    expect(apiConfig.tasks.get('101')).toBe('http://localhost:8000/api/tasks/101');
    expect(apiConfig.tasks.update('202')).toBe('http://localhost:8000/api/tasks/202');
    expect(apiConfig.tasks.delete('303')).toBe('http://localhost:8000/api/tasks/303');
    expect(apiConfig.tasks.execute('404')).toBe('http://localhost:8000/api/tasks/404/execute');
  });

  it('should have applications endpoints', () => {
    expect(apiConfig.applications.list).toBe('http://localhost:8000/api/applications');
    expect(apiConfig.applications.create).toBe('http://localhost:8000/api/applications');
    expect(apiConfig.applications.get('app1')).toBe('http://localhost:8000/api/applications/app1');
  });

  it('should have notifications endpoints', () => {
    expect(apiConfig.notifications.list).toBe('http://localhost:8000/api/notifications');
    expect(apiConfig.notifications.markRead('notif1')).toContain('/api/notifications/notif1/read');
  });

  it('should have WebSocket configuration', () => {
    expect(ws.url).toBe('ws://localhost:8000');
  });

  it('should have services status endpoint', () => {
    expect(apiConfig.services.status).toBe('http://localhost:8000/api/services/status');
  });

  it('should have audit logs endpoint', () => {
    expect(apiConfig.audit.logs).toBe('http://localhost:8000/api/audit/logs');
  });

  it('should have user settings endpoint', () => {
    expect(apiConfig.user.settings).toBe('http://localhost:8000/api/user/settings');
  });
});
