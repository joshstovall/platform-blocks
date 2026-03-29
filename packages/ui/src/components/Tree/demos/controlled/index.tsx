import { useState } from 'react';

import { Block, Button, Column, Row, Text, Tree, type TreeNode } from '@platform-blocks/ui';

const treeData: TreeNode[] = [
  {
    id: 'settings',
    label: 'Settings',
    children: [
      {
        id: 'general',
        label: 'General',
        children: [
          { id: 'language', label: 'Language' },
          { id: 'timezone', label: 'Timezone' },
          { id: 'theme', label: 'Theme' },
        ],
      },
      {
        id: 'privacy',
        label: 'Privacy',
        children: [
          { id: 'cookies', label: 'Cookies' },
          { id: 'tracking', label: 'Tracking' },
          { id: 'data-sharing', label: 'Data Sharing' },
        ],
      },
      {
        id: 'security',
        label: 'Security',
        children: [
          { id: 'password', label: 'Password' },
          { id: 'two-factor', label: 'Two-Factor Auth' },
          { id: 'devices', label: 'Devices' },
        ],
      },
    ],
  },
  {
    id: 'account',
    label: 'Account',
    children: [
      { id: 'profile', label: 'Profile' },
      { id: 'billing', label: 'Billing' },
      { id: 'notifications', label: 'Notifications' },
    ],
  },
];

// Helper to collect all branch node IDs
const getAllBranchIds = (nodes: TreeNode[]): string[] => {
  const ids: string[] = [];
  const traverse = (nodeList: TreeNode[]) => {
    nodeList.forEach((node) => {
      if (node.children && node.children.length > 0) {
        ids.push(node.id);
        traverse(node.children);
      }
    });
  };
  traverse(nodes);
  return ids;
};

export default function Demo() {
  const [expandedIds, setExpandedIds] = useState<string[]>(['settings']);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const allBranchIds = getAllBranchIds(treeData);

  const expandAll = () => {
    setExpandedIds(allBranchIds);
  };

  const collapseAll = () => {
    setExpandedIds([]);
  };

  const expandSettings = () => {
    setExpandedIds(['settings', 'general', 'privacy', 'security']);
  };

  return (
    <Block gap="sm" fullWidth>
      <Column gap="xs">
        <Text weight="semibold">Tree controls</Text>
        <Row gap="xs" wrap="wrap">
          <Button size="sm" variant="outline" onPress={expandAll}>
            Expand all
          </Button>
          <Button size="sm" variant="outline" onPress={collapseAll}>
            Collapse all
          </Button>
          <Button size="sm" variant="outline" onPress={expandSettings}>
            Expand settings branch
          </Button>
        </Row>
      </Column>

      <Tree
        data={treeData}
        expandedIds={expandedIds}
        onToggle={(node, expanded) => {
          setExpandedIds((prev) => {
            if (expanded) {
              return prev.includes(node.id) ? prev : [...prev, node.id];
            }
            return prev.filter((id) => id !== node.id);
          });
        }}
        selectionMode="multiple"
        selectedIds={selectedIds}
        onSelectionChange={(ids) => {
          setSelectedIds(ids);
        }}
      />

      <Column gap="sm">
        <Column gap="xs">
          <Text size="sm" weight="semibold">
            Expanded nodes
          </Text>
          <Text size="xs" colorVariant="secondary">
            {expandedIds.length === 0 ? 'None' : expandedIds.join(', ')}
          </Text>
        </Column>

        <Column gap="xs">
          <Text size="sm" weight="semibold">
            Selected nodes
          </Text>
          <Text size="xs" colorVariant="secondary">
            {selectedIds.length === 0 ? 'None' : selectedIds.join(', ')}
          </Text>
        </Column>
      </Column>
    </Block>
  );
}
