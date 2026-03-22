import { useState, useEffect } from 'react';
import { Card, List, Tag, Alert, Spin, Button, Statistic, Row, Col, Descriptions } from 'antd';
import { ThunderboltOutlined, ExclamationCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { apiService } from '../services/dashboardApi';
import type { RCAResult } from '../types';

interface RCAViewerProps {
  taskId: string;
  taskStatus?: string;
}

export default function RCAViewer({ taskId, taskStatus }: RCAViewerProps): JSX.Element {
  const [rcaData, setRcaData] = useState<RCAResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRCA = async (forceRefresh = false): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      if (forceRefresh) {
        setRcaData(await apiService.tasks.triggerRCA(taskId, true));
      } else {
        setRcaData(await apiService.tasks.getRCA(taskId));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load RCA analysis');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (taskStatus === 'failed' || taskStatus === 'crashed' || taskStatus === 'timeout') {
      fetchRCA();
    } else {
      setLoading(false);
    }
  }, [taskId, taskStatus]);

  if (loading) {
    return (
      <Card title="AI Root Cause Analysis" extra={<ThunderboltOutlined />}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spin tip="Analyzing task failure..." />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card title="AI Root Cause Analysis" extra={<ThunderboltOutlined />}>
        <Alert
          message={error}
          type="error"
          description="RCA analysis is unavailable. Ensure RCA is enabled in server settings."
          showIcon
          icon={<ExclamationCircleOutlined />}
        />
      </Card>
    );
  }

  if (!rcaData) {
    if (taskStatus !== 'failed' && taskStatus !== 'crashed' && taskStatus !== 'timeout') {
      return null;
    }
    return (
      <Card title="AI Root Cause Analysis" extra={<ThunderboltOutlined />}>
        <Alert
          message="No RCA analysis available"
          description="Trigger an analysis to get AI-powered root cause analysis for this task failure."
          type="info"
          action={
            <Button type="primary" size="small" onClick={() => fetchRCA(true)}>
              Trigger Analysis
            </Button>
          }
        />
      </Card>
    );
  }

  const { rca } = rcaData;
  const severityColors: Record<string, string> = {
    critical: 'red',
    high: 'orange',
    medium: 'blue',
    low: 'default',
  };

  return (
    <Card
      title="AI Root Cause Analysis"
      extra={<Button icon={<ReloadOutlined />} onClick={() => fetchRCA(true)}>Refresh</Button>}
    >
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Statistic
            title="Confidence"
            value={rca.confidence}
            suffix="%"
            valueStyle={{ color: rca.confidence > 0.7 ? '#52c41a' : rca.confidence > 0.4 ? '#faad14' : '#ff4d4f' }}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="Severity"
            value={rca.severity}
            prefix={<Tag color={severityColors[rca.severity] || 'default'}>{rca.severity}</Tag>}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="Source"
            value={rca.llm_provider}
            suffix={rca.llm_model}
            valueStyle={{ fontSize: '14px' }}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="Tokens"
            value={rca.total_tokens}
            suffix={`/ ${rca.input_tokens} input`}
            valueStyle={{ fontSize: '14px' }}
          />
        </Col>
      </Row>

      <Card size="small" title="Root Cause" style={{ marginBottom: 16, backgroundColor: '#f5f5f5' }}>
        <p style={{ fontSize: '16px', fontWeight: 500, margin: 0 }}>{rca.root_cause}</p>
      </Card>

      <Descriptions column={2} size="small" style={{ marginBottom: 16 }}>
        <Descriptions.Item label="Duration">{rca.duration_ms.toFixed(0)}ms</Descriptions.Item>
        <Descriptions.Item label="Cached">
          <Tag color={rca.cache_hit ? 'green' : 'default'}>{rca.cache_hit ? 'Yes' : 'No'}</Tag>
        </Descriptions.Item>
      </Descriptions>

      <Card size="small" title="Findings" style={{ marginBottom: 16 }}>
        <List
          size="small"
          dataSource={rca.findings}
          renderItem={(item, index) => (
            <List.Item key={index}>
              <List.Item.Meta avatar={<ExclamationCircleOutlined />} description={item} />
            </List.Item>
          )}
        />
      </Card>

      <Card size="small" title="Recommendations">
        <List
          size="small"
          dataSource={rca.recommendations}
          renderItem={(item, index) => (
            <List.Item key={index}>
              <List.Item.Meta
                avatar={<span style={{ fontWeight: 'bold', color: '#1890ff' }}>{index + 1}</span>}
                description={item}
              />
            </List.Item>
          )}
        />
      </Card>
    </Card>
  );
}
