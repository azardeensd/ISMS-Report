import React, { useState } from 'react';
import { Form, Input, Select, DatePicker, Button, message } from 'antd';
import { createAudit, updateAudit } from '../services/api';

const { Option } = Select;
const { TextArea } = Input;

const AuditForm = ({ initialValues, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      if (initialValues && initialValues.id) {
        await updateAudit(initialValues.id, values);
        message.success('Audit updated successfully');
      } else {
        await createAudit(values);
        message.success('Audit created successfully');
      }
      onSuccess();
    } catch (error) {
      message.error('Error saving audit');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={onFinish}
    >
      <Form.Item
        name="name"
        label="Audit Name"
        rules={[{ required: true, message: 'Please input audit name' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="scope"
        label="Scope"
        rules={[{ required: true, message: 'Please input audit scope' }]}
      >
        <TextArea rows={3} />
      </Form.Item>

      <Form.Item
        name="status"
        label="Status"
        rules={[{ required: true, message: 'Please select status' }]}
      >
        <Select>
          <Option value="Planned">Planned</Option>
          <Option value="In Progress">In Progress</Option>
          <Option value="Completed">Completed</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="startDate"
        label="Start Date"
        rules={[{ required: true, message: 'Please select start date' }]}
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="endDate"
        label="End Date"
        rules={[{ required: true, message: 'Please select end date' }]}
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="auditor"
        label="Lead Auditor"
        rules={[{ required: true, message: 'Please input lead auditor' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Save
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AuditForm;