import React, { useState } from 'react';
import { Button, Upload, message, Card, Typography } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { isAdmin } from '../services/auth';

const { Text } = Typography;

const AuditImport = () => {
  const [loading, setLoading] = useState(false);

  if (!isAdmin()) return null;

  const handleImport = (info) => {
    setLoading(true);
    const file = info.file;

    // Simulate processing delay
    setTimeout(() => {
      setLoading(false);
      message.success(`${file.name} imported successfully`);
    }, 1500);

    // TODO: Add actual upload logic here if needed
    // Example:
    // const formData = new FormData();
    // formData.append('excelFile', file);
    // await api.post('/audit/import', formData);
  };

  return (
    <Card style={{ marginBottom: 24, width: '100%' }}>
      <Upload
        accept=".xlsx"
        showUploadList={false}
        customRequest={handleImport}
      >
        <Button
          type="primary"
          icon={<UploadOutlined />}
          loading={loading}
          style={{ backgroundColor: '#1890ff' }}
        >
          Import Audit Data
        </Button>
      </Upload>
      <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
        Upload .xlsx file to import audit data
      </Text>
    </Card>
  );
};

export default AuditImport;