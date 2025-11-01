import { useState } from 'react';
import { DataTable, Text, Block, Card, Chip, Icon, Indicator, Flex, Button, Avatar } from '@platform-blocks/ui';
import type { DataTableColumn, DataTableSort, DataTablePagination } from '@platform-blocks/ui';

// Sample data with expandable details
interface Project {
  id: number;
  name: string;
  status: 'active' | 'completed' | 'on-hold' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  budget: number;
  spent: number;
  progress: number; // 0-100
  teamSize: number;
  startDate: Date;
  endDate: Date;
  description: string;
  technologies: string[];
  teamMembers: Array<{
    name: string;
    role: string;
    avatar?: string;
  }>;
  milestones: Array<{
    title: string;
    date: Date;
    completed: boolean;
  }>;
  risks: Array<{
    title: string;
    severity: 'low' | 'medium' | 'high';
    description: string;
  }>;
}

const sampleData: Project[] = [
  {
    id: 1,
    name: 'E-commerce Platform Redesign',
    status: 'active',
    priority: 'high',
    budget: 250000,
    spent: 120000,
    progress: 65,
    teamSize: 8,
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-08-30'),
    description: 'Complete redesign of the e-commerce platform with modern UI/UX, improved performance, and mobile-first approach.',
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Redis', 'AWS'],
    teamMembers: [
      { name: 'Alice Johnson', role: 'Project Manager' },
      { name: 'Bob Smith', role: 'Lead Developer' },
      { name: 'Carol Wilson', role: 'UI/UX Designer' },
      { name: 'David Brown', role: 'Backend Developer' },
      { name: 'Eve Davis', role: 'Frontend Developer' },
      { name: 'Frank Miller', role: 'DevOps Engineer' },
      { name: 'Grace Lee', role: 'QA Engineer' },
      { name: 'Henry Chen', role: 'Data Analyst' },
    ],
    milestones: [
      { title: 'Requirements Analysis', date: new Date('2024-02-01'), completed: true },
      { title: 'Design System', date: new Date('2024-03-15'), completed: true },
      { title: 'Frontend Development', date: new Date('2024-06-01'), completed: false },
      { title: 'Backend API', date: new Date('2024-07-15'), completed: false },
      { title: 'Testing & QA', date: new Date('2024-08-01'), completed: false },
      { title: 'Production Deployment', date: new Date('2024-08-30'), completed: false },
    ],
    risks: [
      { title: 'Third-party API Changes', severity: 'medium', description: 'Payment gateway might change API structure' },
      { title: 'Performance Requirements', severity: 'high', description: 'Page load times must be under 2 seconds' },
    ]
  },
  {
    id: 2,
    name: 'Mobile App Development',
    status: 'active',
    priority: 'critical',
    budget: 180000,
    spent: 45000,
    progress: 25,
    teamSize: 5,
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-10-15'),
    description: 'Native mobile applications for iOS and Android with offline capabilities and real-time synchronization.',
    technologies: ['React Native', 'Firebase', 'GraphQL', 'Jest'],
    teamMembers: [
      { name: 'Sarah Johnson', role: 'Mobile Lead' },
      { name: 'Mike Chen', role: 'iOS Developer' },
      { name: 'Lisa Rodriguez', role: 'Android Developer' },
      { name: 'Tom Wilson', role: 'Backend Developer' },
      { name: 'Amy Zhang', role: 'UI/UX Designer' },
    ],
    milestones: [
      { title: 'Architecture Planning', date: new Date('2024-03-15'), completed: true },
      { title: 'Core Features', date: new Date('2024-06-01'), completed: false },
      { title: 'Platform Integration', date: new Date('2024-08-01'), completed: false },
      { title: 'Beta Testing', date: new Date('2024-09-15'), completed: false },
      { title: 'App Store Release', date: new Date('2024-10-15'), completed: false },
    ],
    risks: [
      { title: 'App Store Approval', severity: 'medium', description: 'Potential delays in app store review process' },
      { title: 'Device Compatibility', severity: 'low', description: 'Ensuring compatibility across different device sizes' },
    ]
  },
  {
    id: 3,
    name: 'Data Analytics Dashboard',
    status: 'completed',
    priority: 'medium',
    budget: 95000,
    spent: 89000,
    progress: 100,
    teamSize: 4,
    startDate: new Date('2023-09-01'),
    endDate: new Date('2024-01-30'),
    description: 'Real-time analytics dashboard with custom reports, data visualization, and automated insights.',
    technologies: ['D3.js', 'Python', 'FastAPI', 'MongoDB', 'Docker'],
    teamMembers: [
      { name: 'John Davis', role: 'Data Engineer' },
      { name: 'Maria Garcia', role: 'Frontend Developer' },
      { name: 'Chris Lee', role: 'Backend Developer' },
      { name: 'Nina Patel', role: 'Data Scientist' },
    ],
    milestones: [
      { title: 'Data Pipeline Setup', date: new Date('2023-10-01'), completed: true },
      { title: 'Dashboard UI', date: new Date('2023-11-15'), completed: true },
      { title: 'Analytics Engine', date: new Date('2023-12-20'), completed: true },
      { title: 'Testing & Optimization', date: new Date('2024-01-15'), completed: true },
      { title: 'Production Deployment', date: new Date('2024-01-30'), completed: true },
    ],
    risks: []
  },
  {
    id: 4,
    name: 'API Gateway Migration',
    status: 'on-hold',
    priority: 'low',
    budget: 120000,
    spent: 15000,
    progress: 10,
    teamSize: 3,
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-09-30'),
    description: 'Migration from legacy API gateway to modern cloud-native solution with improved scalability.',
    technologies: ['Kong', 'Kubernetes', 'Terraform', 'Prometheus'],
    teamMembers: [
      { name: 'Alex Thompson', role: 'DevOps Lead' },
      { name: 'Rachel Kim', role: 'Cloud Architect' },
      { name: 'Peter Jones', role: 'Backend Developer' },
    ],
    milestones: [
      { title: 'Current State Analysis', date: new Date('2024-02-15'), completed: true },
      { title: 'Migration Strategy', date: new Date('2024-04-01'), completed: false },
      { title: 'Pilot Implementation', date: new Date('2024-06-01'), completed: false },
      { title: 'Full Migration', date: new Date('2024-08-15'), completed: false },
      { title: 'Performance Validation', date: new Date('2024-09-30'), completed: false },
    ],
    risks: [
      { title: 'Downtime Requirements', severity: 'high', description: 'Zero-downtime migration is critical' },
      { title: 'Legacy System Dependencies', severity: 'medium', description: 'Some legacy systems might need updates' },
    ]
  },
];

export default function Demo() {
  const [sortBy, setSortBy] = useState<DataTableSort[]>([]);
  const [pagination, setPagination] = useState<DataTablePagination>({
    page: 1,
    pageSize: 3,
    total: 4
  });
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [expandedRows, setExpandedRows] = useState<(string | number)[]>([1]);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'completed': return 'primary';
      case 'on-hold': return 'warning';
      case 'cancelled': return 'danger';
      default: return 'gray';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'danger';
      case 'high': return 'warning';
      case 'medium': return 'primary';
      case 'low': return 'gray';
      default: return 'gray';
    }
  };

  const columns: DataTableColumn<Project>[] = [
    {
      key: 'name',
      header: 'Project Name',
      accessor: 'name',
      sortable: true,
      width: 4,
      cell: (value: any, row: Project) => (
        <Flex direction="column" gap={4}>
          <Text weight="semibold" style={{ fontSize: 14 }}>{value}</Text>
          <Text variant="caption" colorVariant="muted" style={{ fontSize: 12 }}>
            {row.teamSize} team members
          </Text>
        </Flex>
      )
    },
   
    {
      key: 'progress',
      header: 'Progress',
      accessor: 'progress',
      sortable: true,
      cell: (value: any) => (
        <Flex align="center" gap={8}>
          <Block style={{
            width: 60,
            height: 8,
            backgroundColor: '#E5E5EA',
            borderRadius: 4,
            overflow: 'hidden'
          }}>
            <Block style={{
              width: `${value}%`,
              height: '100%',
              backgroundColor: value >= 80 ? '#34C759' : value >= 50 ? '#FFB800' : '#FF3B30',
              borderRadius: 4
            }} />
          </Block>
          <Text variant="caption" style={{ fontSize: 12, fontWeight: '600' }}>
            {value}%
          </Text>
        </Flex>
      )
    },
    {
      key: 'budget',
      header: 'Budget',
      accessor: 'budget',
      sortable: true,
      align: 'right',
      cell: (value: any, row: Project) => (
        <Flex direction="column" align="flex-end" gap={2}>
          <Text weight="semibold" style={{ fontSize: 14 }}>
            {formatCurrency(value)}
          </Text>
          <Text variant="caption" colorVariant="muted" style={{ fontSize: 11 }}>
            Spent: {formatCurrency(row.spent)}
          </Text>
        </Flex>
      )
    },
    {
      key: 'endDate',
      header: 'Due Date',
      accessor: 'endDate',
      sortable: true,
      cell: (value: any) => (
        <Text style={{ fontSize: 13 }}>
          {value.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </Text>
      )
    },
  ];

  const renderExpandedRow = (project: Project) => (
    <Block style={{ paddingVertical: 16 }}>
      <Flex direction="column" gap={24}>
        {/* Project Description */}
        <Block>
          <Text weight="semibold" style={{ fontSize: 14, marginBottom: 8, color: '#1D1D1F' }}>
            Project Description
          </Text>
          <Text style={{ fontSize: 13, lineHeight: 1.5, color: '#6E6E73' }}>
            {project.description}
          </Text>
        </Block>

        <Flex gap={32} wrap="wrap">
          {/* Technologies */}
          <Block style={{ minWidth: 200 }}>
            <Text weight="semibold" style={{ fontSize: 14, marginBottom: 12, color: '#1D1D1F' }}>
              Technologies
            </Text>
            <Flex gap={6} wrap="wrap">
              {project.technologies.map((tech) => (
                <Chip key={tech} size="xs" variant="outline" color="primary">
                  {tech}
                </Chip>
              ))}
            </Flex>
          </Block>

          {/* Team Members */}
          <Block style={{ minWidth: 250 }}>
            <Text weight="semibold" style={{ fontSize: 14, marginBottom: 12, color: '#1D1D1F' }}>
              Team Members
            </Text>
            <Flex gap={8} wrap="wrap">
              {project.teamMembers.slice(0, 4).map((member) => (
                <Avatar
                  key={member.name}
                  size="xs"
                  fallback={member.name.split(' ').map(n => n[0]).join('')}
                  backgroundColor="#007AFF"
                  textColor="white"
                  label={<Text style={{ fontSize: 12, fontWeight: '500' }}>{member.name}</Text>}
                  description={<Text variant="caption" colorVariant="muted" style={{ fontSize: 10 }}>{member.role}</Text>}
                  gap={6}
                />
              ))}
              {project.teamMembers.length > 4 && (
                <Text variant="caption" colorVariant="muted" style={{ fontSize: 11 }}>
                  +{project.teamMembers.length - 4} more
                </Text>
              )}
            </Flex>
          </Block>
        </Flex>

        {/* Milestones */}
        <Block>
          <Text weight="semibold" style={{ fontSize: 14, marginBottom: 12, color: '#1D1D1F' }}>
            Project Milestones
          </Text>
          <Flex gap={12} wrap="wrap">
            {project.milestones.map((milestone, index) => (
              <Flex key={index} align="center" gap={8}>
                <Block style={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  backgroundColor: milestone.completed ? '#34C759' : '#E5E5EA',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {milestone.completed && (
                    <Icon name="check" size={10} color="white" />
                  )}
                </Block>
                <Block>
                  <Text style={{ fontSize: 12, fontWeight: '500' }}>{milestone.title}</Text>
                  <Text variant="caption" colorVariant="muted" style={{ fontSize: 10 }}>
                    {milestone.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </Text>
                </Block>
              </Flex>
            ))}
          </Flex>
        </Block>

        {/* Risks */}
        {project.risks.length > 0 && (
          <Block>
            <Text weight="semibold" style={{ fontSize: 14, marginBottom: 12, color: '#1D1D1F' }}>
              Risk Assessment
            </Text>
            <Flex direction="column" gap={8}>
              {project.risks.map((risk, index) => (
                <Block key={index} style={{
                  padding: 12,
                  backgroundColor: '#F9F9F9',
                  borderRadius: 8,
                  borderLeftWidth: 4,
                  borderLeftColor: risk.severity === 'high' ? '#FF3B30' :
                    risk.severity === 'medium' ? '#FFB800' : '#34C759'
                }}>
                  <Flex align="center" gap={8} style={{ marginBottom: 4 }}>
                    <Indicator size="xs" color={
                      risk.severity === 'high' ? 'danger' :
                        risk.severity === 'medium' ? 'warning' : 'success'
                    }>
                      <Text variant="caption" weight="bold" style={{ color: '#fff', fontSize: 9 }}>
                        {risk.severity.toUpperCase()}
                      </Text>
                    </Indicator>
                    <Text weight="semibold" style={{ fontSize: 12 }}>{risk.title}</Text>
                  </Flex>
                  <Text style={{ fontSize: 11, color: '#6E6E73' }}>{risk.description}</Text>
                </Block>
              ))}
            </Flex>
          </Block>
        )}
      </Flex>
    </Block>
  );

  return (
    <Block style={{ padding: 20 }}>
      <Block style={{ marginBottom: 24 }}>
        <Text variant="h5" style={{ marginBottom: 8 }}>Expandable DataTable with Custom Borders</Text>
        <Text colorVariant="muted">
          Showcasing expandable rows with detailed project information, custom border styling, and smooth animations.
        </Text>
      </Block>

      <Block style={{ marginBottom: 16, display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <Button
          size="sm"
          variant="outline"
          onPress={() => setExpandedRows(expandedRows.length === sampleData.length ? [] : sampleData.map(p => p.id))}
        >
          {expandedRows.length === sampleData.length ? 'Collapse All' : 'Expand All'}
        </Button>

        <Block>
          <Text style={{ fontSize: 13, color: '#6E6E73' }}>
            {expandedRows.length} of {sampleData.length} rows expanded
          </Text>
        </Block>
      </Block>

      <Card variant="outline" style={{ overflow: 'hidden' }}>
        <DataTable
          data={sampleData}
          columns={columns}
          sortBy={sortBy}
          onSortChange={setSortBy}
          pagination={pagination}
          onPaginationChange={setPagination}
          selectedRows={selectedRows}
          onSelectionChange={setSelectedRows}
          variant="default"
          density="comfortable"
          searchable
          expandableRowRender={renderExpandedRow}
          expandedRows={expandedRows}
          onExpandedRowsChange={setExpandedRows}
          allowMultipleExpanded
          // Custom border styling
          rowBorderWidth={1}
          rowBorderColor="#E5E5EA"
          columnBorderWidth={1}
          columnBorderColor="#F0F0F0"
          showOuterBorder
          outerBorderWidth={1}
          outerBorderColor="#D1D1D6"
          // Enhanced styling
          hoverHighlight
          fullWidth
        />
      </Card>
    </Block>
  );
}