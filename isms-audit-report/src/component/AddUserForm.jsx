import React, { useState } from 'react';
import { Form, Input, Button, Select, message } from 'antd';
import api from '../services/api';
import axios from 'axios';

const { Option } = Select;

const AddUserForm = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await api.post('/admin/users', values);
      message.success('User added successfully');
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to add user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form layout="vertical" onFinish={onFinish}>
      <Form.Item name="UserID" label="User ID" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="Username" label="Username" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="PasswordHash" label="Password" rules={[{ required: true }]}>
        <Input.Password />
      </Form.Item>
      <Form.Item name="Email" label="Email" rules={[{ required: true, type: 'email' }]}>
        <Input />
      </Form.Item>
      <Form.Item name="Role" label="Role" rules={[{ required: true }]}>
        <Select>
          <Option value="User">User</Option>
          <Option value="Admin">Admin</Option>
          <Option value="SuperAdmin">SuperAdmin</Option>
        </Select>
      </Form.Item>
      <Button type="primary" htmlType="submit" loading={loading}>
        Add User
      </Button>
    </Form>
  );
};

export default AddUserForm;

axios.create({ baseURL: 'http://localhost:5000/api' });