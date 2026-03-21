import { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Input, Select, message, Tag, Space, Popconfirm } from 'antd';
import { PlusOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import { api } from '../services/api';

interface Device {
  id: number;
  device_id: string;
  status: string;
  last_seen: string;
}

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const fetchDevices = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await api.get<{devices: Device[]}>('/api/devices');
      setDevices(response.devices || []);
    } catch (error) {
      message.error('Failed to fetch devices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const handleCreate = () => {
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number): Promise<void> => {
    try {
      await api.delete(`/api/devices/${id}`);
      message.success('Device deleted successfully');
      fetchDevices();
    } catch (error) {
      message.error('Failed to delete device');
    }
  };

  const handleSubmit = async (): Promise<void> => {
    try {
      const values = await form.validateFields();
      await api.post('/api/devices', values);
      message.success('Device created successfully');
      setIsModalOpen(false);
      fetchDevices();
    } catch (error) {
      message.error('Failed to create device');
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Device ID', dataIndex: 'device_id', key: 'device_id' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = status === 'online' ? 'green' : status === 'offline' ? 'red' : 'default';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    { title: 'Last Seen', dataIndex: 'last_seen', key: 'last_seen' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: Device) => (
        <Space>
          <Button type="link" icon={<ReloadOutlined />} size="small" onClick={fetchDevices} />
          <Popconfirm title="Delete this device?" onConfirm={() => handleDelete(record.id)}>
            <Button icon={<DeleteOutlined />} size="small" danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2>Device Management</h2>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={fetchDevices}>
            Refresh
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            Add Device
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={devices}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} devices`,
        }}
      />

      <Modal title="Add Device" open={isModalOpen} onCancel={() => setIsModalOpen(false)} onOk={handleSubmit}>
        <Form form={form} layout="vertical">
          <Form.Item name="device_id" label="Device ID" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="online">Online</Select.Option>
              <Select.Option value="offline">Offline</Select.Option>
              <Select.Option value="idle">Idle</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
