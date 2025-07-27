import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Tabs } from 'antd';
import { LockOutlined, UserOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { getUserRole } from '../services/auth';

const { TabPane } = Tabs;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const navigate = useNavigate();

  const onLogin = async (values) => {
    setLoading(true);
    try {
      const response = await api.post('/login', values);

      // 1. DEBUG: Log the entire response
      console.log('Login Response:', response.data);

      // 2. Store token
      localStorage.setItem('token', response.data.token);

      // 3. DEBUG: Verify role extraction
      const role = getUserRole();
      console.log('Decoded Role:', role);

      // 4. Redirect based on EXACT role match
      switch (role) {
        case 'SuperAdmin':
          navigate('/super-admin/system-settings');
          break;
        case 'Admin':
          navigate('/admin/dashboard');
          break;
        default:
          navigate('/dashboard');
      }

      message.success(`Welcome ${role}`);
    } catch (error) {
      console.error('Login failed:', error.response?.data);
      message.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const onRegister = async (values) => {
    setLoading(true);
    try {
      await api.post('/register', values);
      message.success('Registration successful! Please login');
      setActiveTab('login');
    } catch (error) {
      message.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: '#2958f3ff'
    }}>
      <Card //Font style tab//
        title={<span style={{ fontWeight: 'bold', fontSize: '24px' }}>ISMS Audit Report</span>}
        style={{ width: 500 }}
      >
      {/* <Card title="ISMS Audit Report" style={{ width: 500 }}> */}
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Login" key="login">
            <Form onFinish={onLogin}>
              <Form.Item
                name="username"
                rules={[{ required: true, message: 'Please input your username!' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Username" size="large" />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
              </Form.Item>
              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  block 
                  size="large"
                  loading={loading}
                >
                  Log in
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
          <TabPane tab="Register" key="register">
            <Form onFinish={onRegister}>
              <Form.Item
                name="username"
                rules={[
                  { 
                    required: true, 
                    message: 'Please input your username!' 
                  },
                  { 
                    min: 4, 
                    message: 'Username must be at least 4 characters!' 
                  }
                ]}
              >
                <Input prefix={<UserOutlined />} placeholder="Username" size="large" />
              </Form.Item>
              <Form.Item
                name="email"
                rules={[
                  { 
                    type: 'email',
                    message: 'Please input a valid email!' 
                  },
                  { 
                    required: true, 
                    message: 'Please input your email!' 
                  }
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  { 
                    required: true, 
                    message: 'Please input your password!' 
                  },
                  { 
                    min: 8, 
                    message: 'Password must be at least 8 characters!' 
                  }
                ]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
              </Form.Item>
              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  block 
                  size="large"
                  loading={loading}
                >
                  Register
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default Login;