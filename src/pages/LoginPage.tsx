import { useState } from 'react';
import { Form, Input, Button, Card, Typography, Divider, message } from 'antd';
import { UserOutlined, LockOutlined, GithubOutlined, GitlabOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { apiConfig } from '../config/api';

const { Title, Text } = Typography;

interface LoginFormData {
  identifier: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values: LoginFormData) => {
    setLoading(true);
    try {
      const response = await api.post(apiConfig.auth.login, values) as {access_token: string; refresh_token: string};

      if (response.access_token) {
        message.success('Login successful!');

        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('refresh_token', response.refresh_token);

        navigate('/');
      } else {
        message.error('Login failed');
      }
    } catch (error) {
      message.error('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleGitHubLogin = () => {
    window.location.href = apiConfig.auth.github;
  };

  const handleGitLabLogin = () => {
    window.location.href = apiConfig.auth.gitlab;
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5' }}>
      <Card style={{ width: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2}>Welcome Back</Title>
          <Text type="secondary">Sign in to Omni Test Platform</Text>
        </div>

        <Form
          name="login"
          onFinish={handleLogin}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            name="identifier"
            rules={[{ required: true, message: 'Please input your username or email!' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Username or Email"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large" loading={loading}>
              Sign In
            </Button>
          </Form.Item>
        </Form>

        <Divider>Or continue with</Divider>

        <Button
          icon={<GithubOutlined />}
          block
          size="large"
          onClick={handleGitHubLogin}
          style={{ marginBottom: 12 }}
        >
          Continue with GitHub
        </Button>

        <Button
          icon={<GitlabOutlined />}
          block
          size="large"
          onClick={handleGitLabLogin}
        >
          Continue with GitLab
        </Button>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Text type="secondary">Don't have an account? </Text>
          <a href="/register">Sign up</a>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
