
import React, { useState } from 'react';
import { Layout, Menu, Typography, Avatar, Tabs, theme, Dropdown, Button } from 'antd';
import { 
  BookOutlined, 
  TeamOutlined, 
  AuditOutlined, 
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import TutorDashboard from '../components/TutorDashboard/TutorDashboard';
import MentorshipDashboard from '../components/MentorshipDashboard/MentorshipDashboard';
import MockInterviewDashboard from '../components/MockInterviewDashboard/MockInterviewDashboard';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

const Dashboard: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('1');
  const navigate = useNavigate();
  
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleLogout = () => {
    // Handle logout logic here
    navigate('/');
  };

  const userMenuItems = [
    {
      key: 'profile',
      label: 'Profile',
      icon: <UserOutlined />
    },
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogoutOutlined />,
      onClick: handleLogout
    }
  ];

  const tabItems = [
    {
      key: '1',
      label: 'Courses',
      icon: <BookOutlined />,
      children: <TutorDashboard />,
    },
    {
      key: '2',
      label: 'One-on-One Mentorship',
      icon: <TeamOutlined />,
      children: <MentorshipDashboard />,
    },
    {
      key: '3',
      label: 'Mock Interviews',
      icon: <AuditOutlined />,
      children: <MockInterviewDashboard />,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px', 
        background: colorBgContainer 
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button 
            type="text" 
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', marginRight: '16px' }}
          />
          <Title level={4} style={{ margin: 0 }}>LMS Dashboard</Title>
        </div>
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '8px' }}>Tutor Name</span>
            <Avatar icon={<UserOutlined />} />
          </div>
        </Dropdown>
      </Header>
      <Layout>
        <Sider
          width={200}
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          style={{ background: colorBgContainer }}
          className="hidden md:block"
        >
          <Menu
            mode="inline"
            selectedKeys={[activeTab]}
            style={{ height: '100%', borderRight: 0 }}
            onSelect={({ key }) => setActiveTab(key)}
            items={tabItems.map((tab) => ({
              key: tab.key,
              icon: tab.icon,
              label: tab.label,
            }))}
          />
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              overflow: 'auto',
            }}
          >
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              tabPosition="top"
              className="md:hidden"
              items={tabItems.map((tab) => ({
                key: tab.key,
                label: (
                  <span>
                    {tab.icon}
                    {tab.label}
                  </span>
                ),
              }))}
            />
            {tabItems.find(item => item.key === activeTab)?.children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
