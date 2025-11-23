import { useState } from 'react';

import { Badge, Block, Column, Icon, Row, Text, Tree, type TreeNode } from '@platform-blocks/ui';

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

const typeIcons: Record<CustomNodeData['type'], string> = {
  folder: 'folder',
  project: 'sheild',
  file: 'file',
};

const statusBadges: Record<CustomNodeData['status'], { label: string; color: string }> = {
  active: { label: 'Active', color: 'success' },
  pending: { label: 'Pending', color: 'warning' },
  inactive: { label: 'Inactive', color: 'gray' },
};

export default function Demo() {
  const [lastOpened, setLastOpened] = useState<string | null>(null);

  const renderCustomLabel = (
    node: TreeNode,
    depth: number,
    isOpen: boolean,
    state: { selected: boolean; checked: boolean; indeterminate: boolean }
  ) => {
    const data = node.data as CustomNodeData;
    const status = statusBadges[data.status];

    return (
      <Row gap="sm" align="center" style={{ flex: 1 }}>
        <Icon name={typeIcons[data.type]} size="sm" />
        <Text
          size="sm"
          weight={state.selected ? 'semibold' : 'medium'}
          style={{ flex: 1 }}
        >
          {node.label}
        </Text>
        {typeof data.count === 'number' && (
          <Badge variant="subtle" color={status.color}>
            {data.count}
          </Badge>
        )}
        <Badge variant="outline" color={status.color}>
          {status.label}
        </Badge>
      </Row>
    );
  };

  return (
    <Block gap="sm" fullWidth>
      <Column gap="xs">
        <Text weight="semibold">Status legend</Text>
        <Row gap="sm" wrap="wrap">
          {Object.values(statusBadges).map(({ label, color }) => (
            <Badge key={label} variant="subtle" color={color}>
              {label}
            </Badge>
          ))}
        </Row>
      </Column>

      <Tree
        data={treeData}
        renderLabel={renderCustomLabel}
        selectionMode="single"
        expandAll
        onNavigate={(node) => {
          const data = node.data as CustomNodeData;
          setLastOpened(`${data.type} • ${node.label} (${data.status})`);
        }}
      />

      {lastOpened && (
        <Text size="xs" colorVariant="secondary">
          Last opened: {lastOpened}
        </Text>
      )}
    </Block>
  );
}
