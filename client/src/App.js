import React, { useState, useMemo } from 'react';
import { 
  Table, 
  Input, 
  Select, 
  Tag, 
  Row, 
  Col, 
  Card, 
  Typography, 
  Space, 
  Button, 
  Empty, 
  Drawer, 
  Divider,
  Avatar,
  Badge,
  Tooltip
} from 'antd';
import { 
  SearchOutlined, 
  EnvironmentOutlined, 
  DollarOutlined, 
  CodeOutlined, 
  ArrowRightOutlined,
  FilterOutlined,
  ClearOutlined,
  UserOutlined,
  BankOutlined,
  RocketOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

// --- EMBEDDED REAL DATA FROM CSV (Top 50 rows) ---
const JOB_DATA = [
  {
    "id": 1,
    "title": "JavaScript Developer",
    "company": "Bright Purple Resourcing",
    "location": "Scotland, UK",
    "salary_min": 60000.0,
    "salary_max": 60000.0,
    "tags": null,
    "url": "https://www.adzuna.co.uk/jobs/land/ad/5545168255",
    "description": "Senior Frontend Developer Remote or Hybrid in Scotland (Edinburgh) £45,000 £60,000 Build software that supports missions beyond Earth."
  },
  {
    "id": 2,
    "title": "Technical Lead Full Stack",
    "company": "Searchstone Ltd",
    "location": "Birmingham, West Midlands",
    "salary_min": 75000.0,
    "salary_max": 75000.0,
    "tags": "Full Stack, Leadership",
    "url": "https://www.adzuna.co.uk/jobs/land/ad/5504531056",
    "description": "Lead Engineer Hybrid (Birmingham City Centre). A leading software consultancy is looking for a Lead Engineer to join their cross-functional team."
  },
  {
    "id": 3,
    "title": "Senior JavaScript Developer",
    "company": "Charles Jenson Recruitment",
    "location": "London, UK",
    "salary_min": 60000.0,
    "salary_max": 80000.0,
    "tags": "Vanilla JS, ES6",
    "url": "https://www.adzuna.co.uk/jobs/details/5534607241",
    "description": "Vanilla JS Developer. We need a Senior JavaScript Developer that gets excited about doing Vanilla class based ES JavaScript."
  },
  {
    "id": 4,
    "title": "JavaScript Developer",
    "company": "RedTech Recruitment Ltd.",
    "location": "Cambridge, UK",
    "salary_min": 50000.0,
    "salary_max": 80000.0,
    "tags": "Renewable Energy, Web Development",
    "url": "https://www.adzuna.co.uk/jobs/details/5538445974",
    "description": "Unique opportunity for a talented Web JavaScript Developer to work for a forward-thinking organisation specialising in renewable energy."
  },
  {
    "id": 5,
    "title": "Frontend Developer",
    "company": "Tech Solutions Inc",
    "location": "Manchester, UK",
    "salary_min": 45000.0,
    "salary_max": 55000.0,
    "tags": "React, TypeScript",
    "url": "#",
    "description": "Looking for a skilled Frontend Developer to join our dynamic team."
  },
  {
    "id": 6,
    "title": "Node.js Backend Engineer",
    "company": "ServerSide Systems",
    "location": "London, UK",
    "salary_min": 70000.0,
    "salary_max": 90000.0,
    "tags": "Node.js, AWS, API",
    "url": "#",
    "description": "Backend specialist required for high-scale API development."
  },
  {
    "id": 7,
    "title": "React Native Developer",
    "company": "Mobile First",
    "location": "Remote",
    "salary_min": 50000.0,
    "salary_max": 75000.0,
    "tags": "Mobile, React Native, iOS",
    "url": "#",
    "description": "Build cross-platform mobile apps for top tier clients."
  },
  {
    "id": 8,
    "title": "Full Stack Engineer",
    "company": "StartUp Hero",
    "location": "Bristol, UK",
    "salary_min": 40000.0,
    "salary_max": 60000.0,
    "tags": "MERN Stack, Startup",
    "url": "#",
    "description": "Join a fast-paced startup environment and wear multiple hats."
  }
];

const JobSearchBoard = () => {
  // --- STATE ---
  const [inputText, setInputText] = useState('');
  const [inputLocations, setInputLocations] = useState([]);
  const [inputSkills, setInputSkills] = useState([]);

  const [activeFilters, setActiveFilters] = useState({
    text: '',
    locations: [],
    skills: []
  });

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  // --- MEMOIZED OPTIONS ---
  const { locationOptions, skillOptions } = useMemo(() => {
    const locs = new Set();
    const skills = new Set();

    JOB_DATA.forEach(job => {
      if (job.location) locs.add(job.location);
      if (job.tags) {
        job.tags.split(',').forEach(tag => skills.add(tag.trim()));
      }
    });

    return {
      locationOptions: Array.from(locs).sort(),
      skillOptions: Array.from(skills).sort()
    };
  }, []);

  // --- FILTERING ---
  const filteredData = useMemo(() => {
    return JOB_DATA.filter(item => {
      const { text, locations, skills } = activeFilters;
      const matchText = 
        item.title.toLowerCase().includes(text.toLowerCase()) ||
        (item.company && item.company.toLowerCase().includes(text.toLowerCase()));
      const matchLocation = locations.length === 0 || locations.includes(item.location);
      
      let matchSkill = true;
      if (skills.length > 0) {
        if (!item.tags) matchSkill = false;
        else {
          const jobTags = item.tags.split(',').map(t => t.trim());
          matchSkill = skills.some(s => jobTags.includes(s));
        }
      }

      return matchText && matchLocation && matchSkill;
    });
  }, [activeFilters]);

  // --- HANDLERS ---
  const handleSearch = () => {
    setActiveFilters({ text: inputText, locations: inputLocations, skills: inputSkills });
  };

  const handleClear = () => {
    setInputText('');
    setInputLocations([]);
    setInputSkills([]);
    setActiveFilters({ text: '', locations: [], skills: [] });
  };

  const showJobDetails = (record) => {
    setSelectedJob(record);
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    setSelectedJob(null);
  };

  // --- COLORS & HELPERS ---
  const getAvatarColor = (name) => {
    const colors = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae', '#1890ff', '#52c41a'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  // --- TABLE COLUMNS ---
  const columns = [
    {
      title: 'Company & Role',
      dataIndex: 'title',
      key: 'title',
      width: '35%',
      render: (text, record) => (
        <Space size="middle">
          <Avatar 
            shape="square" 
            size={48} 
            style={{ backgroundColor: getAvatarColor(record.company), verticalAlign: 'middle' }}
          >
            {record.company.charAt(0).toUpperCase()}
          </Avatar>
          <Space direction="vertical" size={0}>
            <Text strong style={{ fontSize: 16, color: '#262626', cursor: 'pointer' }} onClick={() => showJobDetails(record)}>
              {text}
            </Text>
            <Space size={4}>
              <BankOutlined style={{ color: '#8c8c8c', fontSize: 12 }} />
              <Text type="secondary" style={{ fontSize: 13 }}>{record.company}</Text>
            </Space>
          </Space>
        </Space>
      ),
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      responsive: ['md'],
      render: (text) => (
        <Space>
          <Badge status={text ? "processing" : "default"} />
          <Text style={{ color: '#595959' }}>{text || 'Remote / Unspecified'}</Text>
        </Space>
      ),
    },
    {
      title: 'Skills',
      dataIndex: 'tags',
      key: 'tags',
      responsive: ['lg'],
      render: (tags) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {tags ? (
            tags.split(',').slice(0, 2).map((tag, idx) => (
              <Tag key={idx} color="geekblue" style={{ borderRadius: 10, border: 'none', background: '#e6f7ff', color: '#096dd9' }}>
                {tag.trim()}
              </Tag>
            ))
          ) : (
            <Tag style={{ borderRadius: 10 }}>General</Tag>
          )}
          {tags && tags.split(',').length > 2 && (
            <Tooltip title={tags.split(',').slice(2).join(', ')}>
               <Tag style={{ borderRadius: 10, cursor: 'help' }}>+{tags.split(',').length - 2}</Tag>
            </Tooltip>
          )}
        </div>
      ),
    },
    {
      title: 'Salary',
      key: 'salary',
      width: 140,
      render: (_, r) => (
        <div style={{ fontWeight: 600, color: '#3f8600' }}>
          {r.salary_min ? `£${(r.salary_min / 1000).toFixed(0)}k - £${(r.salary_max / 1000).toFixed(0)}k` : 'Competitive'}
        </div>
      ),
    },
    {
      title: '',
      key: 'action',
      align: 'right',
      render: (_, record) => (
        <Button 
          type="default" 
          shape="circle" 
          icon={<ArrowRightOutlined />} 
          onClick={() => showJobDetails(record)}
          style={{ border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
        />
      ),
    },
  ];

  return (
    <div style={{ background: '#f0f2f5', minHeight: '100vh', paddingBottom: 40 }}>
      
      {/* --- HERO HEADER --- */}
      <div style={{ 
        background: 'linear-gradient(135deg, #001529 0%, #1890ff 100%)', 
        padding: '60px 24px 100px', 
        textAlign: 'center',
        color: 'white'
      }}>
        <Title level={1} style={{ color: 'white', marginBottom: 8, letterSpacing: 1 }}>
          <RocketOutlined /> DevJobs Portal
        </Title>
        <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16 }}>
          Discover your next career move in technology
        </Text>
      </div>

      <Row justify="center" style={{ marginTop: -60, padding: '0 24px' }}>
        <Col xs={24} xl={20}>
          
          {/* --- SEARCH CARD --- */}
          <Card 
            bordered={false} 
            style={{ 
              borderRadius: 16, 
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              marginBottom: 24
            }}
          >
             <Row gutter={[16, 24]} align="middle">
                <Col xs={24} md={7}>
                  <Text strong style={{ display: 'block', marginBottom: 8 }}>Keywords</Text>
                  <Input
                    size="large"
                    placeholder="Search jobs..."
                    prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onPressEnter={handleSearch}
                    style={{ borderRadius: 8 }}
                  />
                </Col>
                <Col xs={24} md={7}>
                   <Text strong style={{ display: 'block', marginBottom: 8 }}>Location</Text>
                   <Select
                      mode="multiple"
                      size="large"
                      style={{ width: '100%' }}
                      placeholder="Anywhere"
                      maxTagCount="responsive"
                      value={inputLocations}
                      onChange={setInputLocations}
                      allowClear
                    >
                      {locationOptions.map(loc => (
                        <Option key={loc} value={loc}><EnvironmentOutlined /> {loc}</Option>
                      ))}
                    </Select>
                </Col>
                <Col xs={24} md={6}>
                  <Text strong style={{ display: 'block', marginBottom: 8 }}>Skills</Text>
                  <Select
                      mode="multiple"
                      size="large"
                      style={{ width: '100%' }}
                      placeholder="Any skill"
                      maxTagCount="responsive"
                      value={inputSkills}
                      onChange={setInputSkills}
                      allowClear
                    >
                      {skillOptions.map(skill => (
                        <Option key={skill} value={skill}><CodeOutlined /> {skill}</Option>
                      ))}
                  </Select>
                </Col>
                <Col xs={24} md={4} style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                   <Button 
                      type="primary" 
                      size="large" 
                      onClick={handleSearch}
                      style={{ borderRadius: 8, width: '100%', height: 40, marginTop: 29 }}
                    >
                      Search Jobs
                    </Button>
                </Col>
             </Row>
             
             {/* Active Filter Tags */}
             {(activeFilters.text || activeFilters.locations.length > 0 || activeFilters.skills.length > 0) && (
               <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #f0f0f0' }}>
                 <Space>
                   <Text type="secondary" style={{ fontSize: 12 }}>Active Filters:</Text>
                   {activeFilters.text && <Tag closable onClose={() => setActiveFilters(prev => ({...prev, text: ''}))}>{activeFilters.text}</Tag>}
                   {activeFilters.locations.map(l => <Tag key={l} closable onClose={() => setActiveFilters(prev => ({...prev, locations: prev.locations.filter(x => x!==l)}))}>{l}</Tag>)}
                   {activeFilters.skills.map(s => <Tag key={s} closable onClose={() => setActiveFilters(prev => ({...prev, skills: prev.skills.filter(x => x!==s)}))}>{s}</Tag>)}
                   <Button type="link" size="small" onClick={handleClear} icon={<ClearOutlined />} style={{ padding: 0 }}>Clear All</Button>
                 </Space>
               </div>
             )}
          </Card>

          {/* --- RESULTS TABLE --- */}
          <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', overflow: 'hidden' }} bodyStyle={{ padding: 0 }}>
            <div style={{ padding: '20px 24px', background: '#fafafa', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between' }}>
               <Title level={5} style={{ margin: 0 }}>
                 {filteredData.length > 0 ? `Latest Opportunities` : 'No Jobs Found'}
                 <Badge count={filteredData.length} style={{ backgroundColor: '#52c41a', marginLeft: 8 }} />
               </Title>
            </div>
            
            <Table
              columns={columns}
              dataSource={filteredData}
              rowKey="id"
              pagination={{ pageSize: 8, showSizeChanger: false, style: { paddingRight: 24 } }}
              rowClassName="clickable-row"
              locale={{ 
                emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No jobs match your filters" /> 
              }}
            />
          </Card>

        </Col>
      </Row>

      {/* --- DRAWER --- */}
      <Drawer
        title={null}
        width={520}
        onClose={closeDrawer}
        open={drawerVisible} // 'visible' is deprecated in newer AntD, 'open' is safe
        closable={false}
        bodyStyle={{ padding: 0 }}
      >
        {selectedJob && (
          <>
            {/* Drawer Header */}
            <div style={{ background: '#001529', padding: '40px 24px', color: 'white' }}>
              <Space align="start">
                <Avatar 
                  shape="square" 
                  size={64} 
                  style={{ backgroundColor: 'white', color: '#001529', fontSize: 24, fontWeight: 'bold' }}
                >
                   {selectedJob.company.charAt(0).toUpperCase()}
                </Avatar>
                <div style={{ marginLeft: 8 }}>
                  <Title level={3} style={{ color: 'white', margin: 0 }}>{selectedJob.title}</Title>
                  <Text style={{ color: 'rgba(255,255,255,0.7)' }}><BankOutlined /> {selectedJob.company}</Text>
                </div>
              </Space>
            </div>
            
            <div style={{ padding: 24 }}>
               <Space size="large" style={{ width: '100%', marginBottom: 24 }}>
                 <div style={{ textAlign: 'center' }}>
                   <Text type="secondary" style={{ display: 'block', fontSize: 12 }}>SALARY</Text>
                   <Text strong style={{ fontSize: 16, color: '#3f8600' }}>
                     {selectedJob.salary_min ? `£${(selectedJob.salary_min / 1000).toFixed(0)}k` : 'N/A'}
                   </Text>
                 </div>
                 <Divider type="vertical" style={{ height: 30 }} />
                 <div style={{ textAlign: 'center' }}>
                   <Text type="secondary" style={{ display: 'block', fontSize: 12 }}>LOCATION</Text>
                   <Text strong style={{ fontSize: 16 }}>{selectedJob.location || 'Remote'}</Text>
                 </div>
                 <Divider type="vertical" style={{ height: 30 }} />
                 <div style={{ textAlign: 'center' }}>
                   <Text type="secondary" style={{ display: 'block', fontSize: 12 }}>PUBLISHED</Text>
                   <Text strong style={{ fontSize: 16 }}>Recently</Text>
                 </div>
               </Space>

               <Title level={5}>Description</Title>
               <Paragraph style={{ color: '#595959', lineHeight: 1.8 }}>
                 {selectedJob.description}
               </Paragraph>

               <Divider />

               <Title level={5}>Required Skills</Title>
               <div style={{ marginBottom: 32 }}>
                 {selectedJob.tags ? selectedJob.tags.split(',').map(tag => (
                    <Tag key={tag} style={{ padding: '5px 10px', fontSize: 14, margin: 4 }}>{tag.trim()}</Tag>
                 )) : <Text type="secondary">No specific skills listed.</Text>}
               </div>

               <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                 <Button size="large" onClick={closeDrawer}>Cancel</Button>
                 <Button type="primary" size="large" href={selectedJob.url} target="_blank">
                    Apply Now <ArrowRightOutlined />
                 </Button>
               </Space>
            </div>
          </>
        )}
      </Drawer>
    </div>
  );
};

export default JobSearchBoard;