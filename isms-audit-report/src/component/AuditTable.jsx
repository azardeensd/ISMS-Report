import React, { useState } from 'react';
import { Table, Button, Space, Tag, Input, DatePicker, Select } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;
const { Option } = Select;

const AuditTable = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Sample data - replace with your actual data source
  const dataSource = [
    {
      key: '1',
      auditName: 'ISO 27001 Compliance',
      date: '2023-10-15',
      auditor: 'John Doe',
      status: 'completed',
      findings: 5,
    },
    {
      key: '2',
      auditName: 'GDPR Compliance',
      date: '2023-11-20',
      auditor: 'Jane Smith',
      status: 'in-progress',
      findings: 2,
    },
    {
      key: '3',
      auditName: 'SOC 2 Type II',
      date: '2023-12-05',
      auditor: 'Mike Johnson',
      status: 'pending',
      findings: 0,
    },
  ];

  const columns = [
    {
      title: 'Audit Name',
      dataIndex: 'auditName',
      key: 'auditName',
      sorter: (a, b) => a.auditName.localeCompare(b.auditName),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: 'Auditor',
      dataIndex: 'auditor',
      key: 'auditor',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = '';
        switch (status) {
          case 'completed':
            color = 'green';
            break;
          case 'in-progress':
            color = 'blue';
            break;
          case 'pending':
            color = 'orange';
            break;
          default:
            color = 'gray';
        }
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
      filters: [
        { text: 'Completed', value: 'completed' },
        { text: 'In Progress', value: 'in-progress' },
        { text: 'Pending', value: 'pending' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Findings',
      dataIndex: 'findings',
      key: 'findings',
      sorter: (a, b) => a.findings - b.findings,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleView(record.key)}>
            View
          </Button>
          <Button type="link" onClick={() => handleEdit(record.key)}>
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  const handleView = (key) => {
    console.log('View audit:', key);
    // Add your view logic here
  };

  const handleEdit = (key) => {
    console.log('Edit audit:', key);
    // Add your edit logic here
  };

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const filteredData = dataSource.filter((item) => {
    const matchesSearch = item.auditName.toLowerCase().includes(searchText.toLowerCase()) ||
                         item.auditor.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ padding: 24, background: '#fff', borderRadius: 8 }}>
      <div style={{ marginBottom: 16 }}>
        <Space size="middle">
          <Input
            placeholder="Search audits..."
            prefix={<SearchOutlined />}
            style={{ width: 200 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Select
            defaultValue="all"
            style={{ width: 120 }}
            onChange={(value) => setStatusFilter(value)}
          >
            <Option value="all">All Status</Option>
            <Option value="completed">Completed</Option>
            <Option value="in-progress">In Progress</Option>
            <Option value="pending">Pending</Option>
          </Select>
          <RangePicker />
          <Button icon={<FilterOutlined />}>More Filters</Button>
        </Space>
      </div>

      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: 5 }}
        bordered
      />
    </div>
  );
};

export default AuditTable;