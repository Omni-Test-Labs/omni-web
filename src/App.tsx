import { useState, useEffect } from 'react';
import { ConfigProvider, Layout, Menu } from 'antd';
import {
  DesktopOutlined,
  UnorderedListOutlined,
  AppstoreAddOutlined,
  SettingOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import type { MenuProps } from 'antd';
import LoginPage from './pages/LoginPage';

const { Header, Content, Sider } = Layout;

const DashboardPage = () => <div>Dashboard Page</div>;
const DevicesPage = () => <div>Devices Page</div>;
const TasksPage = () => <div>Tasks Page</div>;
const ApplicationsPage = () => <div>Applications Page</div>;
const SettingsPage = () => <div>Settings Page</div>;
const NotificationsPage = () => <div>Notifications Page</div>;

type MenuItem = Required<MenuProps>['items'][number];

const menuItems: MenuItem[] = [
  {
    key: '/',
    icon: <DesktopOutlined />,
    label: <Link to="/">Dashboard</Link>,
  },
  {
    key: '/devices',
    icon: <DesktopOutlined />,
    label: <Link to="/devices">Devices</Link>,
  },
  {
    key: '/tasks',
    icon: <UnorderedListOutlined />,
    label: <Link to="/tasks">Tasks</Link>,
  },
  {
    key: '/applications',
    icon: <AppstoreAddOutlined />,
    label: <Link to="/applications">Applications</Link>,
  },
  {
    key: '/settings',
    icon: <SettingOutlined />,
    label: <Link to="/settings">Settings</Link>,
  },
];

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const [current, setCurrent] = useState([location.pathname]);

  useEffect(() => {
    setCurrent([location.pathname]);
  }, [location.pathname]);

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
            path="/*"
            element={
              <Layout style={{ minHeight: '100vh' }}>
                <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
                  <div style={{ height: 32, margin: 16, textAlign: 'center' }}>
                    <h2 style={{ color: '#fff' }}>Omni Web</h2>
                  </div>
                  <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={current}
                    items={menuItems}
                  />
                </Sider>
                <Layout>
                  <Header
                    style={{
                      padding: '0 24px',
                      background: '#fff',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <h1 style={{ margin: 0 }}>Omni Test Platform</h1>
                    <div>
                      <Link to="/notifications" style={{ marginRight: 16 }}>
                        <BellOutlined style={{ fontSize: 20 }} />
                      </Link>
                      <Link to="/settings" style={{ marginRight: 16 }}>
                        <UserOutlined style={{ fontSize: 20 }} />
                      </Link>
                      <LogoutOutlined style={{ fontSize: 20, cursor: 'pointer' }} />
                    </div>
                  </Header>
                  <Content style={{ margin: '24px 16px', background: '#fff', minHeight: 280 }}>
                    <Routes>
                      <Route path="/" element={<DashboardPage />} />
                      <Route path="/devices" element={<DevicesPage />} />
                      <Route path="/tasks" element={<TasksPage />} />
                      <Route path="/applications" element={<ApplicationsPage />} />
                      <Route path="/notifications" element={<NotificationsPage />} />
                      <Route path="/settings" element={<SettingsPage />} />
                    </Routes>
                  </Content>
                </Layout>
              </Layout>
            }
          />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;
