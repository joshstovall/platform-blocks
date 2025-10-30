import React, { useState } from 'react';
import { View } from 'react-native';
import { Tree, TreeNode, Text, Button, Flex, Alert } from '../../../..';

const treeData: TreeNode[] = [
  {
    id: 'products',
    label: 'Products',
    children: [
      {
        id: 'electronics',
        label: 'Electronics',
        children: [
          { id: 'laptop', label: 'Laptops' },
          { id: 'phone', label: 'Smartphones' },
          { id: 'tablet', label: 'Tablets' },
        ],
      },
      {
        id: 'clothing',
        label: 'Clothing',
        children: [
          { id: 'shirts', label: 'Shirts' },
          { id: 'pants', label: 'Pants' },
          { id: 'shoes', label: 'Shoes' },
        ],
      },
    ],
  },
  {
    id: 'services',
    label: 'Services',
    children: [
      { id: 'support', label: 'Customer Support' },
      { id: 'consulting', label: 'Consulting' },
      { id: 'training', label: 'Training' },
    ],
  },
];

export default function SelectionTreeDemo() {
  const [selectionMode, setSelectionMode] = useState<'single' | 'multiple'>('single');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  return (
    <View style={{ gap: 16 }}>
      <Flex direction="row" gap="md" align="center">
        <Text size="sm" weight="bold">Selection Mode:</Text>
        <Button
          size="sm"
          variant={selectionMode === 'single' ? 'filled' : 'outline'}
          onPress={() => {
            setSelectionMode('single');
            setSelectedIds(selectedIds.slice(0, 1)); // Keep only first selection
          }}
        >
          Single
        </Button>
        <Button
          size="sm"
          variant={selectionMode === 'multiple' ? 'filled' : 'outline'}
          onPress={() => setSelectionMode('multiple')}
        >
          Multiple
        </Button>
      </Flex>

      {selectionMode === 'multiple' && (
        <Text size="xs" color="secondary" style={{ marginTop: -8 }}>
          💡 Try shift-clicking to select ranges or ctrl/cmd-clicking for individual selection
        </Text>
      )}

      <Tree
        data={treeData}
        selectionMode={selectionMode}
        selectedIds={selectedIds}
        onSelectionChange={(ids, node) => {
          setSelectedIds(ids);
          console.log('Selected:', ids, 'Last selected:', node.label);
        }}
        expandAll
      />
      
      <Alert style={{ padding: 12, borderRadius: 8 }}>
        <Text size="sm" weight="bold" mb="xs">
          Selected ({selectionMode} mode):
        </Text>
        <Text size="xs" color="secondary">
          {selectedIds.length === 0 ? 'None selected' : selectedIds.join(', ')}
        </Text>
      </Alert>
    </View>
  );
}
