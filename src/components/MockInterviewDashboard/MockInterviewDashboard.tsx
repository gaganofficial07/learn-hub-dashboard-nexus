
import React from 'react';
import { Card, Table, Tag, Button, Space } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

// Mock data
const mockInterviews = [
  {
    id: '1',
    student: 'John Doe',
    position: 'Frontend Developer',
    date: '2023-04-15',
    time: '15:00-16:00',
    status: 'pending'
  },
  {
    id: '2',
    student: 'Jane Smith',
    position: 'Backend Developer',
    date: '2023-04-18',
    time: '10:00-11:00',
    status: 'approved'
  },
  {
    id: '3',
    student: 'Mike Johnson',
    position: 'Full Stack Developer',
    date: '2023-04-12',
    time: '14:00-15:00',
    status: 'completed',
    feedback: 'Good technical skills, needs to improve communication'
  }
];

const MockInterviewDashboard: React.FC = () => {
  const columns = [
    {
      title: 'Student',
      dataIndex: 'student',
      key: 'student',
    },
    {
      title: 'Position',
      dataIndex: 'position',
      key: 'position',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'default';
        if (status === 'approved') color = 'green';
        if (status === 'pending') color = 'gold';
        if (status === 'completed') color = 'blue';
        if (status === 'declined') color = 'red';
        
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => {
        if (record.status === 'pending') {
          return (
            <Space>
              <Button 
                type="primary" 
                icon={<CheckOutlined />}
              >
                Approve
              </Button>
              <Button 
                danger 
                icon={<CloseOutlined />}
              >
                Decline
              </Button>
            </Space>
          );
        }
        
        if (record.status === 'approved') {
          return (
            <Button 
              type="primary"
            >
              Start Interview
            </Button>
          );
        }
        
        if (record.status === 'completed') {
          return (
            <Button>
              View Feedback
            </Button>
          );
        }
        
        return null;
      },
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Mock Interview Sessions</h2>
      <Card>
        <Table 
          dataSource={mockInterviews} 
          columns={columns} 
          rowKey="id"
        />
      </Card>
    </div>
  );
};

export default MockInterviewDashboard;
