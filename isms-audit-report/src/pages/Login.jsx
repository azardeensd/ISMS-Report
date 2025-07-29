import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { getUserRole } from '../services/auth';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onLogin = async (values) => {
    setLoading(true);
    try {
      const response = await api.post('/login', values);
      
      // Store token
      localStorage.setItem('token', response.data.token);

      // Get user role and redirect
      const role = getUserRole();
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

  return (
    <div style={{ 
      display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  backgroundColor: '#0e2983ff', // Fallback color
  backgroundImage: 'url(/images/ISMSPoster.png)',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center center',
  backgroundAttachment: 'fixed',
  backgroundSize: 'cover'
    }}>
      <Card
        title={<span style={{ fontWeight: 'bold', fontSize: '24px' }}>ISMS Audit Report</span>}
        style={{ width: 500, padding: 10, borderRadius: 48, boxShadow: '0 90px 8px rgba(16, 15, 15, 0.1)' }}
      >
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
      </Card>
    </div>
  );
};

export default Login;