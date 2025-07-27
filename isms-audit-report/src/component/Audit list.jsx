import React, { useState, useEffect } from 'react';
import { Table, Button, Tag, Space } from 'antd';
import { getAudits } from '../services/api';

const AuditList = ({ onEdit, onView }) => {
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAudits = async () => {
      try {
        const response = await getAudits();
        setAudits(response.data);
      } catch (error) {
        console.error('Error fetching audits:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAudits();
  }, []);

  const columns = [
    {
      title: 'Audit Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Scope',
      dataIndex: 'scope',
      key: 'scope',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = '';
        switch (status) {
          case 'Planned': color = 'blue'; break;
          case 'In Progress': color = 'orange'; break;
          case 'Completed': color = 'green'; break;
          default: color = 'gray';
        }
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => onView(record.id)}>View</Button>
          <Button onClick={() => onEdit(record.id)}>Edit</Button>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={audits}
      rowKey="id"
      loading={loading}
      pagination={{ pageSize: 10 }}
    />
  );
};

export default AuditList;