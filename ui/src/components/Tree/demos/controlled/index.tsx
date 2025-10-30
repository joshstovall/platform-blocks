import React, { useState } from 'react';
import { View } from 'react-native';
import { Tree, TreeNode, Text, Button, Flex } from '../../../..';

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
    nodeList.forEach(node => {
      if (node.children && node.children.length > 0) {
        ids.push(node.id);
        traverse(node.children);
      }
    });
  };
  traverse(nodes);
  return ids;
};

export default function ControlledTreeDemo() {
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
    <View style={{ gap: 16 }}>
      <View style={{ gap: 12 }}>
        <Text size="sm" weight="bold">Tree Controls:</Text>
        <Flex direction="row" gap="sm" style={{ flexWrap: 'wrap' }}>
          <Button size="sm" variant="outline" onPress={expandAll}>
            Expand All
          </Button>
          <Button size="sm" variant="outline" onPress={collapseAll}>
            Collapse All
          </Button>
          <Button size="sm" variant="outline" onPress={expandSettings}>
            Expand Settings
          </Button>
        </Flex>
      </View>

      <Tree
        data={treeData}
        expandedIds={expandedIds}
        onToggle={(node, expanded) => {
          if (expanded) {
            setExpandedIds(prev => [...prev, node.id]);
          } else {
            setExpandedIds(prev => prev.filter(id => id !== node.id));
          }
        }}
        selectionMode="multiple"
        selectedIds={selectedIds}
        onSelectionChange={(ids) => {
          setSelectedIds(ids);
        }}
      />

      <View style={{ padding: 12, backgroundColor: '#f5f5f5', borderRadius: 8, gap: 8 }}>
        <View>
          <Text size="sm" weight="bold">Expanded Nodes:</Text>
          <Text size="xs" color="secondary">
            {expandedIds.length === 0 ? 'None' : expandedIds.join(', ')}
          </Text>
        </View>
        <View>
          <Text size="sm" weight="bold">Selected Nodes:</Text>
          <Text size="xs" color="secondary">
            {selectedIds.length === 0 ? 'None' : selectedIds.join(', ')}
          </Text>
        </View>
      </View>
    </View>
  );
}
