import { Card, Row, Col, Statistic, Typography } from 'antd';
import { UserOutlined, ApartmentOutlined, FileTextOutlined, BellOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function Dashboard() {
  return (
    <div>
      <Title level={2}>Dashboard</Title>
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Users"
              value={0}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Active Devices"
              value={0}
              prefix={<ApartmentOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Running Tasks"
              value={0}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Notifications"
              value={0}
              prefix={<BellOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="Recent Activity" bordered={false}>
            <div>No recent activity</div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
