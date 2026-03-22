// API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const apiConfig = {
  prefix: API_BASE_URL,

  // Authentication
  auth: {
    login: `${API_BASE_URL}/api/auth/login`,
    register: `${API_BASE_URL}/api/auth/register`,
    logout: `${API_BASE_URL}/api/auth/logout`,
    refresh: `${API_BASE_URL}/api/auth/refresh`,
    me: `${API_BASE_URL}/api/auth/me`,
    // OAuth
    github: `${API_BASE_URL}/api/auth/oauth/github`,
    githubCallback: `${API_BASE_URL}/api/auth/oauth/github/callback`,
    gitlab: `${API_BASE_URL}/api/auth/oauth/gitlab`,
    gitlabCallback: `${API_BASE_URL}/api/auth/oauth/gitlab/callback`,
  },

  // Devices
  devices: {
    list: `${API_BASE_URL}/api/v1/devices`,
    create: `${API_BASE_URL}/api/v1/devices`,
    get: (id: string) => `${API_BASE_URL}/api/v1/devices/${id}`,
    update: (id: string) => `${API_BASE_URL}/api/v1/devices/${id}`,
    delete: (id: string) => `${API_BASE_URL}/api/v1/devices/${id}`,
    heartbeat: (id: string) => `${API_BASE_URL}/api/v1/devices/${id}/heartbeat`,
    status: (id: string) => `${API_BASE_URL}/api/v1/devices/${id}/status`,
  },

  // Tasks
  tasks: {
    list: `${API_BASE_URL}/api/v1/tasks`,
    create: `${API_BASE_URL}/api/v1/tasks`,
    get: (id: string) => `${API_BASE_URL}/api/v1/tasks/${id}`,
    update: (id: string) => `${API_BASE_URL}/api/v1/tasks/${id}`,
    delete: (id: string) => `${API_BASE_URL}/api/v1/tasks/${id}`,
    execute: (id: string) => `${API_BASE_URL}/api/v1/tasks/${id}/execute`,
    schedule: (id: string) => `${API_BASE_URL}/api/v1/tasks/${id}/schedule`,
    assign: (id: string) => `${API_BASE_URL}/api/v1/tasks/${id}/assign`,
    result: (id: string) => `${API_BASE_URL}/api/v1/tasks/${id}/result`,
    executions: (id: string) => `${API_BASE_URL}/api/v1/tasks/${id}/executions`,
  },

  // Applications (Test Objects)
  applications: {
    list: `${API_BASE_URL}/api/applications`,
    create: `${API_BASE_URL}/api/applications`,
    get: (id: string) => `${API_BASE_URL}/api/applications/${id}`,
    update: (id: string) => `${API_BASE_URL}/api/applications/${id}`,
    delete: (id: string) => `${API_BASE_URL}/api/applications/${id}`,
    environments: (id: string) => `${API_BASE_URL}/api/applications/${id}/environments`,
  },

  // User Settings
  user: {
    settings: `${API_BASE_URL}/api/user/settings`,
  },

  // Notifications
  notifications: {
    list: `${API_BASE_URL}/api/notifications`,
    markRead: (id: string) => `${API_BASE_URL}/api/notifications/${id}/read`,
  },

  // Audit Logs
  audit: {
    logs: `${API_BASE_URL}/api/audit/logs`,
  },

  // Global Settings (Admin)
  settings: {
    global: `${API_BASE_URL}/api/settings/global`,
  },

  // Services
  services: {
    status: `${API_BASE_URL}/api/services/status`,
  },
};

// WebSocket configuration
export const ws = {
  url: import.meta.env.VITE_WS_URL || API_BASE_URL.replace('http', 'ws'),
};
