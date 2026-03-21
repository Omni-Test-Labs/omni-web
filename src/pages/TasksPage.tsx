import { useState, useEffect } from 'react';
import { Button, Table, Form, Input, Select, message, Tag, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { api } from '../services/api';

interface Task {
  id: number;
  task_id: string;
  status: string;
  priority: string;
  created_at: string;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const fetchTasks = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await api.get<{tasks: Task[]}>('/api/tasks');
      setTasks(response.tasks || []);
    } catch {
      message.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreate = () => {
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleSubmit = async (): Promise<void> => {
    try {
      const values = await form.validateFields();
      await api.post('/api/tasks', values);
      message.success('Task created successfully');
      setIsModalOpen(false);
      fetchTasks();
    } catch {
      message.error('Failed to create task');
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Task ID', dataIndex: 'task_id', key: 'task_id' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color: Record<string, string> = {
          success: 'green',
          failed: 'red',
          crashed: 'red',
          timeout: 'orange',
          running: 'blue',
          pending: 'default',
        };
        return <Tag color={color[status]}>{status}</Tag>;
      },
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => {
        const color: Record<string, string> = {
          critical: 'red',
          high: 'orange',
          normal: 'blue',
          low: 'default',
        };
        return <Tag color={color[priority]}>{priority}</Tag>;
      },
    },
    { title: 'Created', dataIndex: 'created_at', key: 'created_at' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2>Task Management</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          Create Task
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={tasks}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} tasks`,
        }}
      />

      <Modal title="Create Task" open={isModalOpen} onCancel={() => setIsModalOpen(false)} onOk={handleSubmit}>
        <Form form={form} layout="vertical">
          <Form.Item name="task_id" label="Task ID" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="priority" label="Priority" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="critical">Critical</Select.Option>
              <Select.Option value="high">High</Select.Option>
              <Select.Option value="normal">Normal</Select.Option>
              <Select.Option value="low">Low</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
