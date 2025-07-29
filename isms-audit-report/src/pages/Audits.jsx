// // import React, { useState } from 'react';
// // import { Button, message, Upload } from 'antd';
// // import { UploadOutlined } from '@ant-design/icons';
// // import * as XLSX from 'xlsx';
// // import axios from 'axios';

// // export default function Audits() {
// //   const [loading, setLoading] = useState(false);

// //   const handleFileUpload = (info) => {
// //     const { file } = info;
// //     const reader = new FileReader();

// //     reader.onload = (e) => {
// //       const data = e.target.result;
// //       const workbook = XLSX.read(data, { type: 'array' });
// //       const firstSheetName = workbook.SheetNames[0];
// //       const worksheet = workbook.Sheets[firstSheetName];
// //       const jsonData = XLSX.utils.sheet_to_json(worksheet);

// //       if (jsonData.length > 0) {
// //         sendDataToBackend(jsonData);
// //       } else {
// //         message.error('No data found in the Excel file');
// //       }
// //     };

// //     reader.readAsArrayBuffer(file);
// //   };

// //   const sendDataToBackend = async (data) => {
// //     setLoading(true);
// //     try {
// //       const response = await axios.post('/api/admin/users/import', data);
// //       message.success(`Successfully imported ${response.data.insertedCount} records`);
// //     } catch (error) {
// //       console.error('Error uploading data:', error);
// //       message.error('Failed to import data');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div style={{
// //       padding: 50,
// //       border: '2px dashed red',
// //       textAlign: 'center'
// //     }}>
// //       <Upload
// //         accept=".xlsx,.xls"
// //         beforeUpload={() => false} // Prevent automatic upload
// //         onChange={handleFileUpload}
// //         showUploadList={false}
// //       >
// //         <Button
// //           type="primary"
// //           icon={<UploadOutlined />}
// //           size="large"
// //           loading={loading}
// //           style={{ 
// //             backgroundColor: 'green',
// //             fontWeight: 'bold',
// //             fontSize: '20px'
// //           }}
// //         >
// //           Import Excel Data
// //         </Button>
// //       </Upload>
// //       <p style={{ marginTop: 20, color: 'red' }}>
// //         Only Excel files (.xlsx, .xls) are accepted
// //       </p>
// //     </div>
// //   );
// // }

// import React, { useState } from 'react';
// import { Button, message, Upload, Table, Space } from 'antd';
// import { UploadOutlined, ReloadOutlined } from '@ant-design/icons';
// import * as XLSX from 'xlsx';
// import axios from 'axios';

// export default function Audits() {
//   const [loading, setLoading] = useState(false);
//   const [fileData, setFileData] = useState([]);
//   const [columns, setColumns] = useState([]);

//   const handleFileUpload = (info) => {
//     const { file } = info;
//     const reader = new FileReader();

//     reader.onload = (e) => {
//       const data = e.target.result;
//       const workbook = XLSX.read(data, { type: 'array' });
//       const firstSheetName = workbook.SheetNames[0];
//       const worksheet = workbook.Sheets[firstSheetName];
//       const jsonData = XLSX.utils.sheet_to_json(worksheet);

//       if (jsonData.length > 0) {
//         // Generate table columns from Excel headers
//         const firstRow = jsonData[0];
//         const generatedColumns = Object.keys(firstRow).map(key => ({
//           title: key,
//           dataIndex: key,
//           key: key,
//         }));

//         setColumns(generatedColumns);
//         setFileData(jsonData);
//         sendDataToBackend(jsonData);
//       } else {
//         message.error('No data found in the Excel file');
//       }
//     };

//     reader.readAsArrayBuffer(file);
//   };

//   const sendDataToBackend = async (data) => {
//     setLoading(true);
//     try {
//       const response = await axios.post('/api/admin/users/import', data);
//       message.success(`Successfully imported ${response.data.insertedCount} records`);
//       // You might want to refresh your data here if needed
//     } catch (error) {
//       console.error('Error uploading data:', error);
//       message.error('Failed to import data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const refreshData = () => {
//     // Add your data refresh logic here
//     message.info('Data refreshed');
//   };

//   return (
//     <div style={{ padding: 24 }}>
//       <Space style={{ marginBottom: 16 }}>
//         <Upload
//           accept=".xlsx,.xls"
//           beforeUpload={() => false}
//           onChange={handleFileUpload}
//           showUploadList={false}
//         >
//           <Button
//             type="primary"
//             icon={<UploadOutlined />}
//             size="large"
//             loading={loading}
//             style={{ 
//               backgroundColor: '#1890ff',
//               fontWeight: 'bold',
//             }}
//           >
//             Import Excel
//           </Button>
//         </Upload>
        
//         <Button
//           type="default"
//           icon={<ReloadOutlined />}
//           size="large"
//           onClick={refreshData}
//         >
//           Refresh
//         </Button>
//       </Space>

//       <p style={{ color: '#ff4d4f', marginBottom: 24 }}>
//         Note: Only Excel files (.xlsx, .xls) are accepted
//       </p>

//       {fileData.length > 0 && (
//         <Table 
//           columns={columns} 
//           dataSource={fileData} 
//           rowKey={(record) => record.id || JSON.stringify(record)}
//           bordered
//           size="middle"
//           style={{ marginTop: 20 }}
//           scroll={{ x: true }}
//         />
//       )}
//     </div>
//   );
// }

import React, { useState } from 'react';
import { Button, message, Upload, Table, Space, Card } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';

const Audits = () => {
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [columns, setColumns] = useState([]);

  const handleFileUpload = (info) => {
    const { file } = info;
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        if (jsonData.length > 0) {
          // Generate table columns from Excel headers
          const firstRow = jsonData[0];
          const generatedColumns = Object.keys(firstRow).map(key => ({
            title: key,
            dataIndex: key,
            key: key,
          }));

          setColumns(generatedColumns);
          setTableData(jsonData);
          message.success(`${jsonData.length} records imported successfully`);
        } else {
          message.error('No data found in the Excel file');
        }
      } catch (error) {
        message.error('Error processing Excel file');
        console.error('Error:', error);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <Card 
      title="ISMS Audit Report" 
      style={{ 
        margin: '20px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
      }}
    >
      <div style={{ padding: '20px' }}>
        <Upload
          accept=".xlsx,.xls"
          beforeUpload={() => false}
          onChange={handleFileUpload}
          showUploadList={false}
        >
          <Button
            type="primary"
            icon={<UploadOutlined />}
            loading={loading}
            size="large"
            style={{ marginBottom: '20px' }}
          >
            Import Audit Data (Excel)
          </Button>
        </Upload>

        {tableData.length > 0 ? (
          <Table
            columns={columns}
            dataSource={tableData}
            rowKey={(record) => record.id || JSON.stringify(record)}
            bordered
            size="middle"
            scroll={{ x: true }}
            style={{ marginTop: '20px' }}
          />
        ) : (
          <div style={{ 
            border: '2px dashed #d9d9d9',
            borderRadius: '4px',
            padding: '40px',
            textAlign: 'center',
            backgroundColor: '#fafafa'
          }}>
            <p style={{ fontSize: '16px', color: '#888' }}>
              No audit data available. Please import an Excel file.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default Audits;