import React from 'react';
import { Button } from 'antd';

export default function Audits() {
  return (
    <div style={{
      padding: 50,
      border: '2px dashed red',
      textAlign: 'center'
    }}>
      <Button 
        type="primary" 
        size="large"
        style={{ 
          backgroundColor: 'green',
          fontWeight: 'bold',
          fontSize: '20px'
        }}
        onClick={() => alert('IT WORKS!')}
      >
        🎉 BIG GREEN TEST BUTTON 🎉
      </Button>
      <p style={{ marginTop: 20 }}>If you don't see this, your React app is broken</p>
    </div>
  );
}