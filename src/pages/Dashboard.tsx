import { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Typography, Spin, Alert, List, Tag } from 'antd';
import { UserOutlined, ApartmentOutlined, FileTextOutlined, CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { apiService } from '../services/dashboardApi';
import type { Task, Device } from '../types';

const { Title } = Typography;

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeDevices: 0,
    runningTasks: 0,
    pendingTasks: 0,
    completedTasks: 0,
    failedTasks: 0,
  });
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [dashboardStats, tasks, devices] = await Promise.all([
        apiService.dashboard.getStats(),
        apiService.tasks.list(),
        apiService.devices.list(),
      ]);

      setStats(dashboardStats);
      const recentTasks = tasks.slice(0, 5).map(task => {
        const device = devices.find(d => d.device_id === task.assigned_device_id);
        return {
          ...task,
          deviceName: device ? device.device_id : 'Unassigned',
        } as Task & { deviceName: string };
      });
      setRecentTasks(recentTasks);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getTaskStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      success: 'green',
      failed: 'red',
      crashed: 'red',
      timeout: 'orange',
      running: 'blue',
      pending: 'default',
    };
    return colors[status] || 'default';
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <Title level={2}>Dashboard</Title>

      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          closable
          style={{ marginBottom: 16 }}
        />
      )}

      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Users"
              value={stats.totalUsers}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Active Devices"
              value={stats.activeDevices}
              prefix={<ApartmentOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Running Tasks"
              value={stats.runningTasks}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Pending Tasks"
              value={stats.pendingTasks}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={12}>
          <Card title="Task Status Overview" bordered={false}>
            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title=" Completed"
                  value={stats.completedTasks}
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Failed"
                  value={stats.failedTasks}
                  prefix={<CloseCircleOutlined />}
                  valueStyle={{ color: '#ff4d4f' }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="System Health" bordered={false}>
            <div>
              <p><strong>Total Tasks:</strong> {stats.runningTasks + stats.pendingTasks + stats.completedTasks + stats.failedTasks}</p>
              <p><strong>Active Devices:</strong> {stats.activeDevices}</p>
              <p><strong>Registered Users:</strong> {stats.totalUsers}</p>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="Recent Tasks" bordered={false}>
            <List
              dataSource={recentTasks}
              renderItem={(task) => (
                <List.Item>
                  <List.Item.Meta
                    title={<span>{task.task_id}</span>}
                    description={
                      <div>
                        <Tag color={getTaskStatusColor(task.status)}>{task.status}</Tag>
                        <Tag>{task.priority}</Tag>
                        <span>Device: {(task as any).deviceName}</span>
                      </div>
                    }
                  />
                  <div>{new Date(task.created_at).toLocaleString()}</div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
