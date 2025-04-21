import React, { useState } from 'react';
import { Card, Table, Tag, Button, Calendar, Modal, Form, Input, Select, Space, Badge, Upload } from 'antd';
import { CheckOutlined, CloseOutlined, FileOutlined, CalendarOutlined } from '@ant-design/icons';
import type { CalendarMode } from 'antd/lib/calendar/generateCalendar';
import VideoCall from './VideoCall';

const { Option } = Select;
const { TextArea } = Input;

// Mock data
const mockMentorSessions = [
  {
    id: '1',
    student: 'John Doe',
    topic: 'Career Guidance',
    date: '2025-04-20',
    time: '15:00-16:00',
    status: 'setup_meeting',
    notes: 'Initial discussion about career path in software development',
    ready_for_call: true,
  },
  {
    id: '2',
    student: 'Jane Smith',
    topic: 'Code Review',
    date: '2025-04-22',
    time: '10:00-11:00',
    status: 'setup_meeting',
    notes: 'Review of React projects and best practices',
    ready_for_call: true,
  },
  {
    id: '3',
    student: 'Mike Johnson',
    topic: 'Project Planning',
    date: '2025-04-20',
    time: '14:00-15:00',
    status: 'completed',
    notes: 'Discussed project architecture and timeline.',
    feedback: 'Very helpful session, clear explanations.',
  },
  {
    id: '4',
    student: 'Sarah Williams',
    topic: 'Database Design',
    date: '2025-04-10',
    time: '11:00-12:00',
    status: 'declined',
    notes: 'Schedule conflict',
  },
  {
    id: '5',
    student: 'Alex Thompson',
    topic: 'Interview Preparation',
    date: '2025-04-25',
    time: '13:00-14:00',
    status: 'pending',
    notes: '',
  },
];

const MentorshipDashboard: React.FC = () => {
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [filter, setFilter] = useState('all');
  const [isInCall, setIsInCall] = useState(false);
  
  const handleSessionAction = (record: any, action: string) => {
    if (action === 'startCall') {
      setIsInCall(true);
      setSelectedSession(record);
    } else {
      setSelectedSession(record);
      setIsDetailsModalOpen(true);
    }
  };
  
  const columns = [
    {
      title: 'Student',
      dataIndex: 'student',
      key: 'student',
    },
    {
      title: 'Topic',
      dataIndex: 'topic',
      key: 'topic',
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
        let displayStatus = status.toUpperCase();
        
        if (status === 'approved') color = 'green';
        if (status === 'pending') color = 'gold';
        if (status === 'completed') color = 'blue';
        if (status === 'declined') color = 'red';
        if (status === 'setup_meeting') {
          color = 'green';
          displayStatus = 'READY FOR MEETING';
        }
        
        return <Tag color={color}>{displayStatus}</Tag>;
      },
      filters: [
        { text: 'Pending', value: 'pending' },
        { text: 'Ready for Meeting', value: 'setup_meeting' },
        { text: 'Completed', value: 'completed' },
        { text: 'Declined', value: 'declined' },
      ],
      onFilter: (value: string, record: any) => record.status === value,
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
                onClick={() => handleSessionAction(record, 'approve')}
              >
                Approve
              </Button>
              <Button 
                danger 
                icon={<CloseOutlined />} 
                onClick={() => handleSessionAction(record, 'decline')}
              >
                Decline
              </Button>
            </Space>
          );
        }
        
        if (record.status === 'setup_meeting' && record.ready_for_call) {
          return (
            <Space>
              <Button 
                type="primary"
                onClick={() => handleSessionAction(record, 'startCall')}
              >
                Start Call
              </Button>
              <Button 
                icon={<FileOutlined />} 
                onClick={() => handleSessionAction(record, 'view')}
              >
                Session Details
              </Button>
            </Space>
          );
        }
        
        if (record.status === 'completed') {
          return (
            <Space>
              <Button 
                type="primary" 
                onClick={() => handleSessionAction(record, 'view')}
              >
                View Summary
              </Button>
              {!record.feedback && (
                <Button>Add Documents</Button>
              )}
            </Space>
          );
        }
        
        return (
          <Button 
            onClick={() => handleSessionAction(record, 'view')}
          >
            View Details
          </Button>
        );
      },
    },
  ];
  
  const getListData = (value: any) => {
    const date = value.format('YYYY-MM-DD');
    const matchingSessions = mockMentorSessions.filter(session => session.date === date);
    return matchingSessions.map(session => ({
      type: session.status === 'setup_meeting' ? 'success' : 
            session.status === 'pending' ? 'warning' : 
            session.status === 'completed' ? 'processing' : 'error',
      content: `${session.time}: ${session.student}`,
    }));
  };
  
  const dateCellRender = (value: any) => {
    const listData = getListData(value);
    return (
      <ul className="events">
        {listData.map((item, index) => (
          <li key={index}>
            <Badge status={item.type as any} text={item.content} />
          </li>
        ))}
      </ul>
    );
  };
  
  const handleCalendarSelect = (value: any) => {
    console.log('Selected date:', value.format('YYYY-MM-DD'));
  };
  
  const onPanelChange = (value: any, mode: CalendarMode) => {
    console.log(value.format('YYYY-MM-DD'), mode);
  };

  if (isInCall && selectedSession) {
    return (
      <div className="p-4">
        <VideoCall 
          sessionId={selectedSession.id}
          studentName={selectedSession.student}
          topic={selectedSession.topic}
          onEndCall={() => setIsInCall(false)} 
        />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">One-on-One Mentorship</h2>
        <Button 
          type="primary" 
          icon={<CalendarOutlined />} 
          onClick={() => setIsAvailabilityModalOpen(true)}
        >
          Set Availability
        </Button>
      </div>
      
      <Card title="Calendar View" className="mb-6">
        <Calendar 
          fullscreen={false} 
          onSelect={handleCalendarSelect}
          onPanelChange={onPanelChange}
          dateCellRender={dateCellRender}
        />
      </Card>
      
      <Card title="Mentorship Sessions">
        <div className="mb-4">
          <Select 
            defaultValue="all" 
            style={{ width: 200 }} 
            onChange={value => setFilter(value)}
          >
            <Option value="all">All Sessions</Option>
            <Option value="pending">Pending Requests</Option>
            <Option value="setup_meeting">Ready for Meeting</Option>
            <Option value="completed">Past Sessions</Option>
            <Option value="declined">Declined Sessions</Option>
          </Select>
        </div>
        
        <Table 
          dataSource={filter === 'all' ? mockMentorSessions : mockMentorSessions.filter(s => s.status === filter)}
          columns={columns} 
          rowKey="id"
        />
      </Card>
      
      <Modal
        title="Set Your Availability"
        open={isAvailabilityModalOpen}
        onCancel={() => setIsAvailabilityModalOpen(false)}
        footer={null}
        width={700}
      >
        <Form layout="vertical">
          <Form.Item name="days" label="Available Days">
            <Select mode="multiple" placeholder="Select days">
              <Option value="monday">Monday</Option>
              <Option value="tuesday">Tuesday</Option>
              <Option value="wednesday">Wednesday</Option>
              <Option value="thursday">Thursday</Option>
              <Option value="friday">Friday</Option>
              <Option value="saturday">Saturday</Option>
              <Option value="sunday">Sunday</Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="timeSlots" label="Time Slots">
            <Select mode="multiple" placeholder="Select time slots">
              <Option value="9-10">9:00 AM - 10:00 AM</Option>
              <Option value="10-11">10:00 AM - 11:00 AM</Option>
              <Option value="11-12">11:00 AM - 12:00 PM</Option>
              <Option value="13-14">1:00 PM - 2:00 PM</Option>
              <Option value="14-15">2:00 PM - 3:00 PM</Option>
              <Option value="15-16">3:00 PM - 4:00 PM</Option>
              <Option value="16-17">4:00 PM - 5:00 PM</Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="recurring" label="Recurring Schedule">
            <Select defaultValue="weekly">
              <Option value="weekly">Weekly</Option>
              <Option value="biweekly">Bi-weekly</Option>
              <Option value="monthly">Monthly</Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="notes" label="Notes">
            <TextArea rows={4} placeholder="Add any notes about your availability" />
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Save Availability
              </Button>
              <Button onClick={() => setIsAvailabilityModalOpen(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      
      <Modal
        title="Session Details"
        open={isDetailsModalOpen}
        onCancel={() => setIsDetailsModalOpen(false)}
        footer={null}
      >
        {selectedSession && (
          <div>
            <p><strong>Student:</strong> {selectedSession.student}</p>
            <p><strong>Topic:</strong> {selectedSession.topic}</p>
            <p><strong>Date:</strong> {selectedSession.date}</p>
            <p><strong>Time:</strong> {selectedSession.time}</p>
            <p><strong>Status:</strong> {selectedSession.status}</p>
            
            {selectedSession.status === 'pending' && (
              <Form layout="vertical">
                <Form.Item name="action" label="Action">
                  <Select defaultValue="approve">
                    <Option value="approve">Approve</Option>
                    <Option value="decline">Decline</Option>
                  </Select>
                </Form.Item>
                
                <Form.Item name="notes" label="Notes">
                  <TextArea rows={4} placeholder="Add any notes" />
                </Form.Item>
                
                <Form.Item>
                  <Space>
                    <Button type="primary" htmlType="submit">
                      Submit
                    </Button>
                    <Button onClick={() => setIsDetailsModalOpen(false)}>
                      Cancel
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            )}
            
            {selectedSession.status === 'completed' && (
              <div>
                <p><strong>Session Summary:</strong></p>
                <p>{selectedSession.notes || 'No summary available'}</p>
                
                {selectedSession.feedback && (
                  <div>
                    <p><strong>Student Feedback:</strong></p>
                    <p>{selectedSession.feedback}</p>
                  </div>
                )}
                
                <Form layout="vertical">
                  <Form.Item name="additionalNotes" label="Add Additional Notes">
                    <TextArea rows={4} placeholder="Add any additional notes or follow-up" />
                  </Form.Item>
                  
                  <Form.Item name="documents" label="Attach Documents">
                    <Upload>
                      <Button icon={<FileOutlined />}>Upload Document</Button>
                    </Upload>
                  </Form.Item>
                  
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Update Session
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MentorshipDashboard;
