import { View } from 'react-native';
import { Tree, TreeNode, Text, Icon, Flex } from '@platform-blocks/ui';

interface CustomNodeData {
  status: 'active' | 'inactive' | 'pending';
  count?: number;
  type: 'folder' | 'file' | 'project';
}

const treeData: TreeNode[] = [
  {
    id: 'workspace',
    label: 'Workspace',
    data: { status: 'active', type: 'folder', count: 3 },
    children: [
      {
        id: 'project-a',
        label: 'Project Alpha',
        data: { status: 'active', type: 'project', count: 12 },
        children: [
          { 
            id: 'file-1', 
            label: 'main.ts',
            data: { status: 'active', type: 'file' }
          },
          { 
            id: 'file-2', 
            label: 'config.json',
            data: { status: 'pending', type: 'file' }
          },
          { 
            id: 'file-3', 
            label: 'README.md',
            data: { status: 'active', type: 'file' }
          },
        ],
      },
      {
        id: 'project-b',
        label: 'Project Beta',
        data: { status: 'pending', type: 'project', count: 5 },
        children: [
          { 
            id: 'file-4', 
            label: 'app.tsx',
            data: { status: 'inactive', type: 'file' }
          },
          { 
            id: 'file-5', 
            label: 'styles.css',
            data: { status: 'active', type: 'file' }
          },
        ],
      },
      {
        id: 'project-c',
        label: 'Project Gamma',
        data: { status: 'inactive', type: 'project', count: 0 },
        children: [],
      },
    ],
  },
];

export default function CustomTreeDemo() {
  const renderCustomLabel = (
    node: TreeNode, 
    depth: number, 
    isOpen: boolean, 
    state: { selected: boolean; checked: boolean; indeterminate: boolean }
  ) => {
    const data = node.data as CustomNodeData;
    
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'active': return '#4caf50';
        case 'pending': return '#ff9800';
        case 'inactive': return '#f44336';
        default: return '#9e9e9e';
      }
    };

    const getTypeIcon = (type: string) => {
      switch (type) {
        case 'folder': return 'eye';
        case 'project': return 'star';
        case 'file': return 'check';
        default: return 'check';
      }
    };

    return (
      <Flex direction="row" align="center" gap="sm" style={{ flex: 1, paddingVertical: 4 }}>
        <Icon 
          name={getTypeIcon(data.type)} 
          size="sm" 
          color={getStatusColor(data.status)} 
        />
        
        <Text 
          size="sm" 
          weight={state.selected ? 'bold' : 'medium'}
          color={state.selected ? 'primary' : 'inherit'}
          style={{ flex: 1 }}
        >
          {node.label}
        </Text>
        
        {data.count !== undefined && (
          <View style={{
            backgroundColor: getStatusColor(data.status),
            paddingHorizontal: 6,
            paddingVertical: 2,
            borderRadius: 12,
            minWidth: 20,
            alignItems: 'center',
          }}>
            <Text size="xs" color="white" weight="bold">
              {data.count}
            </Text>
          </View>
        )}
        
        <View style={{
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: getStatusColor(data.status),
        }} />
      </Flex>
    );
  };

  return (
    <View style={{ gap: 16 }}>
      <View style={{ gap: 8 }}>
        <Text size="sm" weight="bold">Project Status Legend:</Text>
        <Flex direction="row" gap="md">
          <Flex direction="row" align="center" gap="xs">
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#4caf50' }} />
            <Text size="xs">Active</Text>
          </Flex>
          <Flex direction="row" align="center" gap="xs">
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#ff9800' }} />
            <Text size="xs">Pending</Text>
          </Flex>
          <Flex direction="row" align="center" gap="xs">
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#f44336' }} />
            <Text size="xs">Inactive</Text>
          </Flex>
        </Flex>
      </View>

      <Tree
        data={treeData}
        renderLabel={renderCustomLabel}
        selectionMode="single"
        expandAll
        onNavigate={(node) => {
          const data = node.data as CustomNodeData;
          console.log(`Opened ${data.type}:`, node.label, `(${data.status})`);
        }}
      />
    </View>
  );
}
