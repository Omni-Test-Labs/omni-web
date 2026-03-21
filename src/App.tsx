import { ConfigProvider } from 'antd';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import MainLayout from './components/MainLayout';
import Dashboard from './pages/Dashboard';
import UsersPage from './pages/UsersPage';
import DevicesPage from './pages/DevicesPage';
import TasksPage from './pages/TasksPage';

const SettingsPage = () => <div><h2>Settings</h2><p>Settings page coming soon...</p></div>;
const NotificationsPage = () => <div><h2>Notifications</h2><p>Notifications page coming soon...</p></div>;

const App: React.FC = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
        },
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={<MainLayout />}
          >
            <Route index element={<Dashboard />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="devices" element={<DevicesPage />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;
