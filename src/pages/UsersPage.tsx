import { useState, useEffect } from 'react';
import { Button, Table, message, Tag, Card, Row, Col, Statistic, Avatar, Space } from 'antd';
import { PlusOutlined, ReloadOutlined, UserOutlined, SafetyOutlined } from '@ant-design/icons';
import { apiService } from '../services/dashboardApi';
import type { User } from '../types';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const fetchUsers = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await apiService.users.list(currentPage, pageSize);
      setUsers(response.users);
      setTotal(response.total);
    } catch {
      message.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, pageSize]);

  const activeUsers = users.filter(u => u.is_active).length;
  const adminUsers = users.filter(u => u.role === 'admin').length;

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      admin: 'red',
      user: 'blue',
      superuser: 'purple',
    };
    return colors[role] || 'default';
  };

  const columns = [
    {
      title: 'User',
      key: 'user',
      render: (_: unknown, record: User) => (
        <Space>
          <Avatar
            size="small"
            src={record.avatar_url}
            icon={!record.avatar_url && <UserOutlined />}
          />
          <span style={{ fontWeight: 'bold' }}>{record.username}</span>
        </Space>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag icon={<SafetyOutlined />} color={getRoleColor(role)}>
          {role}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'is_active',
      filters: [
        { text: 'Active', value: true },
        { text: 'Inactive', value: false },
      ],
      render: (active: boolean) => (
        <Tag color={active ? 'green' : 'red'}>{active ? 'Active' : 'Inactive'}</Tag>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleString(),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2>User Management</h2>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={fetchUsers}>
            Refresh
          </Button>
          <Button type="primary" icon={<PlusOutlined />}>
            Create User
          </Button>
        </Space>
      </div>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Users"
              value={total}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Active Users"
              value={activeUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Admin Users"
              value={adminUsers}
              prefix={<SafetyOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Inactive Users"
              value={users.length - activeUsers}
              valueStyle={{ color: '#999' }}
            />
          </Card>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} users`,
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size || 10);
          },
        }}
      />
    </div>
  );
}
