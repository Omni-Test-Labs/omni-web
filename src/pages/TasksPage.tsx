import { useState, useEffect } from 'react';
import { Button, Table, Form, Input, Select, message, Tag, Modal, Drawer, Descriptions, Space, Card, Row, Col, Statistic, Progress } from 'antd';
import { PlusOutlined, EyeOutlined, ReloadOutlined, CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { apiService } from '../services/dashboardApi';
import type { Task, TaskResult } from '../types';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [form] = Form.useForm();

  const fetchTasks = async (): Promise<void> => {
    setLoading(true);
    try {
      const data = await apiService.tasks.list(statusFilter);
      setTasks(data);
    } catch {
      message.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [statusFilter]);

  const handleCreate = () => {
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleSubmit = async (): Promise<void> => {
    try {
      const values = await form.validateFields();
      await apiService.tasks.create(values);
      message.success('Task created successfully');
      setIsModalOpen(false);
      fetchTasks();
    } catch {
      message.error('Failed to create task');
    }
  };

  const handleViewTask = async (taskId: string) => {
    try {
      const task = await apiService.tasks.get(taskId);
      setSelectedTask(task);
      setIsDrawerOpen(true);
    } catch {
      message.error('Failed to fetch task details');
    }
  };

  const getTaskStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      success: 'green',
      failed: 'red',
      crashed: 'red',
      timeout: 'orange',
      running: 'blue',
      pending: 'default',
      assigned: 'purple',
    };
    return colors[status] || 'default';
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      critical: 'red',
      high: 'orange',
      normal: 'blue',
      low: 'default',
    };
    return colors[priority] || 'default';
  };

  const columns = [
    {
      title: 'Task ID',
      dataIndex: 'task_id',
      key: 'task_id',
      render: (taskId: string) => <span style={{ fontWeight: 'bold' }}>{taskId}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Pending', value: 'pending' },
        { text: 'Assigned', value: 'assigned' },
        { text: 'Running', value: 'running' },
        { text: 'Success', value: 'success' },
        { text: 'Failed', value: 'failed' },
        { text: 'Timeout', value: 'timeout' },
        { text: 'Crashed', value: 'crashed' },
      ],
      render: (status: string) => <Tag color={getTaskStatusColor(status)}>{status}</Tag>,
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      filters: [
        { text: 'Critical', value: 'critical' },
        { text: 'High', value: 'high' },
        { text: 'Normal', value: 'normal' },
        { text: 'Low', value: 'low' },
      ],
      render: (priority: string) => <Tag color={getPriorityColor(priority)}>{priority}</Tag>,
    },
    {
      title: 'Assigned Device',
      dataIndex: 'assigned_device_id',
      key: 'assigned_device_id',
      render: (deviceId: string | null) => deviceId || <span style={{ color: '#999' }}>Unassigned</span>,
    },
    {
      title: 'Created',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: Task) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewTask(record.task_id)}
          >
            View Details
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2>Task Management</h2>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={fetchTasks}>
            Refresh
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            Create Task
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={tasks}
        rowKey="task_id"
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

      <Drawer
        title="Task Details"
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        width={720}
      >
        {selectedTask && (
          <div>
            <Card title="Task Information" style={{ marginBottom: 16 }}>
              <Descriptions column={2} bordered>
                <Descriptions.Item label="Task ID">{selectedTask.task_id}</Descriptions.Item>
                <Descriptions.Item label="Status">
                  <Tag color={getTaskStatusColor(selectedTask.status)}>{selectedTask.status}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Priority">
                  <Tag color={getPriorityColor(selectedTask.priority)}>{selectedTask.priority}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Assigned Device">
                  {selectedTask.assigned_device_id || 'Unassigned'}
                </Descriptions.Item>
                <Descriptions.Item label="Device Type">
                  {selectedTask.device_binding.device_type}
                </Descriptions.Item>
                <Descriptions.Item label="Device ID">
                  {selectedTask.device_binding.device_id}
                </Descriptions.Item>
                <Descriptions.Item label="Created At">
                  {new Date(selectedTask.created_at).toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label="Updated At">
                  {new Date(selectedTask.updated_at).toLocaleString()}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {selectedTask.result && (
              <Card title="Execution Result" style={{ marginBottom: 16 }}>
                <Row gutter={16}>
                  <Col span={8}>
                    <Statistic
                      title="Status"
                      value={selectedTask.result.status}
                      prefix={
                        selectedTask.result.status === 'success' ? (
                          <CheckCircleOutlined />
                        ) : (
                          <CloseCircleOutlined />
                        )
                      }
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="Duration"
                      value={selectedTask.result.duration_seconds}
                      suffix="sec"
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="Steps"
                      value={selectedTask.result.summary?.total_steps || 0}
                    />
                  </Col>
                </Row>

                <Divider />

                <Row gutter={16}>
                  <Col span={6}>
                    <Statistic
                      title="Successful steps"
                      value={selectedTask.result.summary?.successful_steps || 0}
                      valueStyle={{ color: '#52c41a' }}
                      prefix={<CheckCircleOutlined />}
                    />
                  </Col>
                  <Col span={6}>
                    <Statistic
                      title="Failed steps"
                      value={selectedTask.result.summary?.failed_steps || 0}
                      valueStyle={{ color: '#ff4d4f' }}
                      prefix={<CloseCircleOutlined />}
                    />
                  </Col>
                  <Col span={6}>
                    <Statistic
                      title="Skipped steps"
                      value={selectedTask.result.summary?.skipped_steps || 0}
                      valueStyle={{ color: '#faad14' }}
                      prefix={<ClockCircleOutlined />}
                    />
                  </Col>
                  <Col span={6}>
                    <Statistic
                      title="Crashed steps"
                      value={selectedTask.result.summary?.crashed_steps || 0}
                      valueStyle={{ color: '#ff4d4f' }}
                    />
                  </Col>
                </Row>

                <Divider />

                <Descriptions column={1}>
                  <Descriptions.Item label="Device Info">
                    {selectedTask.result.device_info.hostname} ({selectedTask.result.device_info.runner_version})
                  </Descriptions.Item>
                  <Descriptions.Item label="Started At">
                    {new Date(selectedTask.result.started_at).toLocaleString()}
                  </Descriptions.Item>
                  {selectedTask.result.completed_at && (
                    <Descriptions.Item label="Completed At">
                      {new Date(selectedTask.result.completed_at).toLocaleString()}
                    </Descriptions.Item>
                  )}
                </Descriptions>

                {selectedTask.result.summary && (
                  <>
                    <Divider />
                    <div style={{ marginBottom: 8 }}>Step Success Rate</div>
                    <Progress
                      percent={
                        selectedTask.result.summary.total_steps > 0
                          ? Math.round(
                              (selectedTask.result.summary.successful_steps /
                                selectedTask.result.summary.total_steps) *
                                100
                            )
                          : 0
                      }
                      status={
                        selectedTask.result.summary.failed_steps > 0 ? (selectedTask.result.summary.successful_steps === selectedTask.result.summary.total_steps ? 'success' : 'exception') : 'active'
                      }
                    />
                  </>
                )}
              </Card>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
}
