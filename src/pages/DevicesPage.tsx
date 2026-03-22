import { useState, useEffect } from 'react';
import { Button, Table, message, Tag, Space, Card, Row, Col, Statistic } from 'antd';
import { ReloadOutlined, CheckCircleOutlined, CloseCircleOutlined, ApartmentOutlined } from '@ant-design/icons';
import { apiService } from '../services/dashboardApi';
import type { Device } from '../types';

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string | undefined>();

  const fetchDevices = async (): Promise<void> => {
    setLoading(true);
    try {
      const data = await apiService.devices.list(statusFilter);
      setDevices(data);
    } catch {
      message.error('Failed to fetch devices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, [statusFilter]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      idle: 'green',
      running: 'blue',
      offline: 'red',
    };
    return colors[status] || 'default';
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, JSX.Element> = {
      idle: <CheckCircleOutlined />,
      running: <ApartmentOutlined spin />,
      offline: <CloseCircleOutlined />,
    };
    return icons[status] || null;
  };

  const activeDevices = devices.filter(d => d.status !== 'offline').length;
  const runningDevices = devices.filter(d => d.status === 'running').length;

  const columns = [
    {
      title: 'Device ID',
      dataIndex: 'device_id',
      key: 'device_id',
      render: (deviceId: string) => <span style={{ fontWeight: 'bold' }}>{deviceId}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Idle', value: 'idle' },
        { text: 'Running', value: 'running' },
        { text: 'Offline', value: 'offline' },
      ],
      render: (status: string) => (
        <Tag icon={getStatusIcon(status)} color={getStatusColor(status)}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Current Task',
      dataIndex: 'current_task_id',
      key: 'current_task_id',
      render: (taskId: string | null) => taskId || <span style={{ color: '#999' }}>No task assigned</span>,
    },
    {
      title: 'Runner Version',
      dataIndex: 'runner_version',
      key: 'runner_version',
    },
    {
      title: 'Last Seen',
      dataIndex: 'last_seen',
      key: 'last_seen',
      render: (date: string) => new Date(date).toLocaleString(),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2>Device Management</h2>
        <Button icon={<ReloadOutlined />} onClick={fetchDevices}>
          Refresh
        </Button>
      </div>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Devices"
              value={devices.length}
              prefix={<ApartmentOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Active Devices"
              value={activeDevices}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Running Devices"
              value={runningDevices}
              prefix={<ApartmentOutlined spin />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Offline Devices"
              value={devices.length - activeDevices}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={devices}
        rowKey="device_id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} devices`,
        }}
      />
    </div>
  );
}
