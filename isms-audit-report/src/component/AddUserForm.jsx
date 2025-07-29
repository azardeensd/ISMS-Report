import React, { useState } from 'react';
import { Form, Input, Button, Select, message, Card } from 'antd';
import api from '../services/api';

const { Option } = Select;

const AddUserForm = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await api.post('/admin/users', values);
      console.log('User added:', response);
      message.success('User added successfully');
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to add user');
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
      background: `
        linear-gradient(rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.15)),
        url(/images/auth-bg.jpg) no-repeat center center/cover fixed
      `,
      padding: '20px'
    }}>
      <Card
  title={<h2 style={{
    textAlign: 'center',
    margin: 0,
    color: '#1a2cf5de',
    fontFamily: "'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
    fontSize: '50px',
    fontWeight: 600,
    letterSpacing: '0.5px'
  }}>Add New User</h2>}
  style={{
    width: '100%',
    maxWidth: '450px',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    backgroundColor: 'rgba(242, 240, 240, 0.97)',
    fontFamily: "'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif"
  }}
  headStyle={{ 
    borderBottom: 0, 
    padding: '24px 24px 0',
    fontFamily: "'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif"
  }}
  bodyStyle={{ 
    padding: '24px',
    fontFamily: "'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif"
  }}

      >
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="UserID"
            label={<span style={{ fontWeight: 500, color: '#555' }}>User ID</span>}
            rules={[{ required: true, message: 'Please input user ID!' }]}
          >
            <Input 
              style={{
                padding: '10px 15px',
                borderRadius: '6px',
                border: '1px solid #d3ceceff'
              }}
              placeholder="Enter user ID"
            />
          </Form.Item>

          <Form.Item
            name="Username"
            label={<span style={{ fontWeight: 500, color: '#555' }}>Username</span>}
            rules={[{ required: true, message: 'Please input username!' }]}
          >
            <Input 
              style={{
                padding: '10px 15px',
                borderRadius: '6px',
                border: '1px solid #d3ceceff'
              }}
              placeholder="Choose username"
            />
          </Form.Item>

          <Form.Item
            name="PasswordHash"
            label={<span style={{ fontWeight: 500, color: '#555' }}>Password</span>}
            rules={[{ required: true, message: 'Please input password!' }]}
          >
            <Input.Password 
              style={{
                padding: '10px 15px',
                borderRadius: '6px',
                border: '1px solid #d3ceceff'
              }}
              placeholder="Create password"
            />
          </Form.Item>

          <Form.Item
            name="Email"
            label={<span style={{ fontWeight: 500, color: '#555' }}>Email</span>}
            rules={[{ 
              required: true, 
              type: 'email', 
              message: 'Please input valid email!' 
            }]}
          >
            <Input 
              style={{
                padding: '10px 15px',
                borderRadius: '6px',
                border: '1px solid #d3ceceff'
              }}
              placeholder="user@example.com"
            />
          </Form.Item>

          <Form.Item
            name="Role"
            label={<span style={{ fontWeight: 500, color: '#555' }}>Role</span>}
            rules={[{ required: true, message: 'Please select role!' }]}
          >
            <Select
              style={{
                width: '100%',
                height: '40px',
                borderRadius: '6px'
              }}
              placeholder="Select role"
            >
              <Option value="User">User</Option>
              <Option value="Admin">Admin</Option>
              <Option value="SuperAdmin">Super Admin</Option>
            </Select>
          </Form.Item>

          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            block
            style={{
              height: '40px',
              fontSize: '16px',
              fontWeight: '500',
              borderRadius: '6px',
              background: 'linear-gradient(90deg, #1890ff, #0e2983)',
              border: 'none',
              marginTop: '8px'
            }}
          >
            Add User
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default AddUserForm; 