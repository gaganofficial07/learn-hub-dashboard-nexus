
import React, { useState } from 'react';
import { Card, Tabs, Button, Table, Typography, Tag, Rate, List, Avatar, Input, Space, Modal, Form, Upload, Select, Tooltip } from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  TeamOutlined, 
  CommentOutlined, 
  StarOutlined,
  LikeOutlined,
  DislikeOutlined,
  UploadOutlined,
  FileAddOutlined,
  DragOutlined
} from '@ant-design/icons';
import type { DragEndEvent } from '@dnd-kit/core';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

// Define a custom Comment component since Ant Design's Comment needs to be imported separately
const CommentItem = ({ 
  author, 
  avatar, 
  content, 
  datetime, 
  actions 
}: { 
  author: string; 
  avatar: React.ReactNode; 
  content: React.ReactNode; 
  datetime: string;
  actions?: React.ReactNode[];
}) => (
  <div className="flex py-4 border-b">
    <div className="mr-4">
      {avatar}
    </div>
    <div className="flex-1">
      <div className="mb-1">
        <Text strong>{author}</Text>
        <Text type="secondary" className="ml-2">{datetime}</Text>
      </div>
      <div className="mb-2">{content}</div>
      {actions && (
        <div className="flex gap-4">
          {actions.map((action, index) => (
            <div key={index}>{action}</div>
          ))}
        </div>
      )}
    </div>
  </div>
);

// Mock data
const mockCourses = [
  {
    id: '1',
    title: 'React Fundamentals',
    description: 'Learn the basics of React',
    students: 45,
    rating: 4.5,
    sections: [
      {
        id: 's1',
        title: 'Introduction',
        chapters: [
          { id: 'c1', title: 'Welcome to React', type: 'video' },
          { id: 'c2', title: 'Setting up your environment', type: 'document' }
        ]
      },
      {
        id: 's2',
        title: 'React Components',
        chapters: [
          { id: 'c3', title: 'Functional Components', type: 'video' },
          { id: 'c4', title: 'Class Components', type: 'video' }
        ]
      }
    ]
  },
  {
    id: '2',
    title: 'Advanced TypeScript',
    description: 'Master TypeScript concepts',
    students: 30,
    rating: 4.8,
    sections: [
      {
        id: 's3',
        title: 'Types and Interfaces',
        chapters: [
          { id: 'c5', title: 'Basic Types', type: 'video' },
          { id: 'c6', title: 'Interface vs Type', type: 'document' }
        ]
      }
    ]
  }
];

const mockStudents = [
  { id: '1', name: 'John Doe', email: 'john@example.com', progress: 60, lastActivity: '2023-04-15' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', progress: 85, lastActivity: '2023-04-18' },
  { id: '3', name: 'Mike Johnson', email: 'mike@example.com', progress: 40, lastActivity: '2023-04-12' },
];

const mockComments = [
  {
    id: '1',
    author: 'Jane Smith',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
    content: 'Great explanation of React hooks in chapter 3!',
    datetime: '2023-04-15 14:30',
    likes: 5,
    replies: [
      {
        id: 'r1',
        author: 'Tutor',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tutor',
        content: 'Thank you, Jane! Glad you found it helpful.',
        datetime: '2023-04-15 15:45',
      }
    ]
  },
  {
    id: '2',
    author: 'Mike Johnson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    content: 'Could you provide more examples for TypeScript generics?',
    datetime: '2023-04-16 10:15',
    likes: 2,
    replies: []
  }
];

const TutorDashboard: React.FC = () => {
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [editingContent, setEditingContent] = useState<boolean>(false);
  const [isNewCourseModalOpen, setIsNewCourseModalOpen] = useState<boolean>(false);
  const [newSectionModalOpen, setNewSectionModalOpen] = useState<boolean>(false);
  const [selectedSection, setSelectedSection] = useState<any>(null);
  
  const studentColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Progress',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress: number) => (
        <div>
          <Progress percent={progress} size="small" />
        </div>
      ),
    },
    {
      title: 'Last Activity',
      dataIndex: 'lastActivity',
      key: 'lastActivity',
    },
  ];

  const courseColumns = [
    {
      title: 'Course Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Students',
      dataIndex: 'students',
      key: 'students',
      render: (students: number) => (
        <Tag icon={<TeamOutlined />} color="blue">
          {students} enrolled
        </Tag>
      ),
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number) => (
        <span>
          <Rate disabled defaultValue={rating} /> ({rating})
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={() => setSelectedCourse(record)}
          >
            Edit
          </Button>
          <Button 
            icon={<TeamOutlined />} 
            onClick={() => setSelectedCourse(record)}
          >
            Students
          </Button>
          <Button 
            icon={<CommentOutlined />} 
            onClick={() => setSelectedCourse(record)}
          >
            Comments
          </Button>
          <Button 
            icon={<StarOutlined />} 
            onClick={() => setSelectedCourse(record)}
          >
            Ratings
          </Button>
        </Space>
      ),
    },
  ];

  // Function to handle chapter drag end
  const onDragEnd = (event: DragEndEvent) => {
    // Here you would implement the reordering logic
    console.log("Drag ended:", event);
  };

  // Mock component for progress
  // In practice, this would be imported from 'antd'
  const Progress = ({ percent, size }: { percent: number, size: string }) => (
    <div style={{ 
      width: '100%', 
      height: size === 'small' ? '8px' : '12px', 
      backgroundColor: '#f0f0f0',
      borderRadius: '4px',
      overflow: 'hidden'
    }}>
      <div style={{ 
        width: `${percent}%`, 
        height: '100%', 
        backgroundColor: '#1890ff'
      }} />
      <span>{percent}%</span>
    </div>
  );

  return (
    <div>
      {!selectedCourse ? (
        <div>
          <div className="flex justify-between mb-4">
            <Title level={3}>Your Courses</Title>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => setIsNewCourseModalOpen(true)}
            >
              Create New Course
            </Button>
          </div>
          <Table 
            dataSource={mockCourses} 
            columns={courseColumns} 
            rowKey="id"
          />
        </div>
      ) : (
        <div>
          <div className="flex justify-between mb-4">
            <div>
              <Button onClick={() => setSelectedCourse(null)}>Back to Courses</Button>
              <Title level={3} className="mt-4">{selectedCourse.title}</Title>
              <Text>{selectedCourse.description}</Text>
            </div>
            <Button 
              type="primary" 
              icon={<EditOutlined />} 
              onClick={() => setEditingContent(!editingContent)}
            >
              {editingContent ? 'Save Changes' : 'Edit Content'}
            </Button>
          </div>

          <Tabs defaultActiveKey="content">
            <TabPane tab="Course Content" key="content">
              <div className="mb-4">
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={() => setNewSectionModalOpen(true)}
                  disabled={!editingContent}
                >
                  Add New Section
                </Button>
              </div>
              
              {selectedCourse.sections.map((section: any) => (
                <Card 
                  key={section.id} 
                  title={section.title}
                  className="mb-4"
                  extra={
                    editingContent && (
                      <Button 
                        icon={<EditOutlined />}
                        onClick={() => setSelectedSection(section)}
                      >
                        Edit Section
                      </Button>
                    )
                  }
                >
                  <List
                    itemLayout="horizontal"
                    dataSource={section.chapters}
                    renderItem={(chapter: any) => (
                      <List.Item
                        actions={[
                          editingContent && <Tooltip title="Drag to reorder">
                            <DragOutlined style={{ cursor: 'grab' }} />
                          </Tooltip>,
                          editingContent && <Button icon={<EditOutlined />} size="small" />
                        ]}
                      >
                        <List.Item.Meta
                          title={chapter.title}
                          description={chapter.type === 'video' ? 'Video Lecture' : 'Document Resource'}
                        />
                      </List.Item>
                    )}
                  />
                  
                  {editingContent && (
                    <div className="mt-4">
                      <Button 
                        icon={<PlusOutlined />} 
                        type="dashed" 
                        block
                        onClick={() => setSelectedSection(section)}
                      >
                        Add Chapter
                      </Button>
                    </div>
                  )}
                </Card>
              ))}
            </TabPane>
            
            <TabPane tab="Students" key="students">
              <Table 
                dataSource={mockStudents}
                columns={studentColumns}
                rowKey="id"
              />
            </TabPane>
            
            <TabPane tab="Comments & Feedback" key="comments">
              <List
                className="comment-list"
                header={`${mockComments.length} comments`}
                itemLayout="horizontal"
                dataSource={mockComments}
                renderItem={item => (
                  <li>
                    <CommentItem
                      author={item.author}
                      avatar={<Avatar src={item.avatar} />}
                      content={item.content}
                      datetime={item.datetime}
                      actions={[
                        <span key="like">
                          <Tooltip title="Like">
                            <LikeOutlined />
                          </Tooltip>
                          <span className="comment-action">{item.likes}</span>
                        </span>,
                        <span key="reply-to">Reply to</span>,
                      ]}
                    />
                    
                    {item.replies.length > 0 && (
                      <List
                        dataSource={item.replies}
                        className="ml-12"
                        renderItem={reply => (
                          <CommentItem
                            author={reply.author}
                            avatar={<Avatar src={reply.avatar} />}
                            content={reply.content}
                            datetime={reply.datetime}
                          />
                        )}
                      />
                    )}
                    
                    <div className="ml-12 mb-4">
                      <TextArea rows={2} placeholder="Reply to this comment..." />
                      <Button className="mt-2" type="primary">Reply</Button>
                    </div>
                  </li>
                )}
              />
            </TabPane>
            
            <TabPane tab="Ratings" key="ratings">
              <Card>
                <div className="text-center mb-4">
                  <Title level={1}>{selectedCourse.rating}</Title>
                  <Rate disabled defaultValue={selectedCourse.rating} />
                  <Text>{selectedCourse.students} ratings</Text>
                </div>
                
                <List
                  itemLayout="horizontal"
                  dataSource={[
                    { name: '5 stars', count: 18, percentage: 60 },
                    { name: '4 stars', count: 7, percentage: 23 },
                    { name: '3 stars', count: 3, percentage: 10 },
                    { name: '2 stars', count: 1, percentage: 3 },
                    { name: '1 star', count: 1, percentage: 3 },
                  ]}
                  renderItem={item => (
                    <List.Item>
                      <div className="w-full flex items-center">
                        <div className="w-20">{item.name}</div>
                        <Progress percent={item.percentage} size="small" />
                        <div className="ml-4">{item.count}</div>
                      </div>
                    </List.Item>
                  )}
                />
              </Card>
            </TabPane>
          </Tabs>
        </div>
      )}

      {/* New Course Modal */}
      <Modal
        title="Create New Course"
        open={isNewCourseModalOpen}
        onCancel={() => setIsNewCourseModalOpen(false)}
        footer={null}
        width={700}
      >
        <Form layout="vertical">
          <Form.Item name="title" label="Course Title" rules={[{ required: true }]}>
            <Input placeholder="Enter course title" />
          </Form.Item>
          
          <Form.Item name="description" label="Course Description" rules={[{ required: true }]}>
            <TextArea rows={4} placeholder="Enter course description" />
          </Form.Item>
          
          <Form.Item name="category" label="Category" rules={[{ required: true }]}>
            <Select placeholder="Select a category">
              <Option value="programming">Programming</Option>
              <Option value="design">Design</Option>
              <Option value="business">Business</Option>
              <Option value="marketing">Marketing</Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="thumbnail" label="Course Thumbnail">
            <Upload maxCount={1} listType="picture-card">
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Create Course
              </Button>
              <Button onClick={() => setIsNewCourseModalOpen(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* New Section Modal */}
      <Modal
        title="Add New Section"
        open={newSectionModalOpen}
        onCancel={() => setNewSectionModalOpen(false)}
        footer={null}
      >
        <Form layout="vertical">
          <Form.Item name="title" label="Section Title" rules={[{ required: true }]}>
            <Input placeholder="Enter section title" />
          </Form.Item>
          
          <Form.Item name="description" label="Section Description">
            <TextArea rows={2} placeholder="Enter section description" />
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Add Section
              </Button>
              <Button onClick={() => setNewSectionModalOpen(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* New Chapter Modal */}
      <Modal
        title="Add New Chapter"
        open={!!selectedSection}
        onCancel={() => setSelectedSection(null)}
        footer={null}
      >
        <Form layout="vertical">
          <Form.Item name="title" label="Chapter Title" rules={[{ required: true }]}>
            <Input placeholder="Enter chapter title" />
          </Form.Item>
          
          <Form.Item name="type" label="Content Type" rules={[{ required: true }]}>
            <Select placeholder="Select content type">
              <Option value="video">Video</Option>
              <Option value="document">Document</Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="file" label="Upload Content">
            <Upload maxCount={1}>
              <Button icon={<UploadOutlined />}>Upload File</Button>
            </Upload>
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Add Chapter
              </Button>
              <Button onClick={() => setSelectedSection(null)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TutorDashboard;
