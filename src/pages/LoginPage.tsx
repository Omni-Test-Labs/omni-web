import { useState } from 'react';
import { Form, Input, Button, Card, Typography, Divider, message } from 'antd';
import { UserOutlined, LockOutlined, GithubOutlined, GitlabOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { api } from '../config/api';

const { Title, Text } = Typography;

interface LoginFormData {
  username: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values: LoginFormData) => {
    setLoading(true);
    try {
      const response = await apiService.post(api.auth.login, values);

      if (response.success && response.data) {
        message.success('Login successful!');

        // TODO: Set user and tokens in auth store
        // const { user, access_token, refresh_token } = response.data;
        // useAuthStore.getState().setUser(user);
        // useAuthStore.getState().setTokens(access_token, refresh_token);

        // Redirect to dashboard
        navigate('/dashboard');
      } else {
        message.error(response.message || 'Login failed');
      }
    } catch (error) {
      message.error('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleGitHubLogin = () => {
    // Redirect to GitHub OAuth
    window.location.href = api.auth.github;
  };

  const handleGitLabLogin = () => {
    // Redirect to GitLab OAuth
    window.location.href = api.auth.gitlab;
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
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Username"
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
