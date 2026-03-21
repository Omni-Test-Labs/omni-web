import { Layout, Menu, theme } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  HomeOutlined,
  UserOutlined,
  ApartmentOutlined,
  FileTextOutlined,
  SettingOutlined,
  BellOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '../stores/authStore';
import { useEffect, useState } from 'react';

const { Sider, Content, Header } = Layout;

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = theme.useToken();
  const { user, logout, isAuthenticated } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const menuItems = [
    { key: '/', icon: <HomeOutlined />, label: 'Dashboard' },
    { key: '/users', icon: <UserOutlined />, label: 'User Management' },
    { key: '/devices', icon: <ApartmentOutlined />, label: 'Device Management' },
    { key: '/tasks', icon: <FileTextOutlined />, label: 'Task Management' },
    { key: '/settings', icon: <SettingOutlined />, label: 'Settings' },
    { key: '/notifications', icon: <BellOutlined />, label: 'Notifications' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        theme="dark"
      >
        <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
          <h2>{collapsed ? 'Omni' : 'Omni Test Labs'}</h2>
        </div>
        <Menu
          theme="dark"
          selectedKeys={[location.pathname]}
          mode="inline"
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: token.colorBgContainer }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px' }}>
            <div>Welcome, {user?.username || 'User'}</div>
            <div>
              <span style={{ cursor: 'pointer', marginRight: '16px' }} onClick={() => navigate('/notifications')}>
                Notifications
              </span>
              <span style={{ cursor: 'pointer' }} onClick={handleLogout}>
                Logout
              </span>
            </div>
          </div>
        </Header>
        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: token.colorBgContainer,
              borderRadius: token.borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
