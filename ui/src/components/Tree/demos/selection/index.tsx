import { useState } from 'react';

import { Block, Button, Column, Row, Text, Tree, type TreeNode } from '@platform-blocks/ui';

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

export default function Demo() {
  const [selectionMode, setSelectionMode] = useState<'single' | 'multiple'>('single');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  return (
    <Block gap="sm" fullWidth>
      <Row gap="xs" align="center" wrap="wrap">
        <Text size="sm" weight="semibold">
          Selection mode
        </Text>
        <Button
          size="sm"
          variant={selectionMode === 'single' ? 'filled' : 'outline'}
          onPress={() => {
            setSelectionMode('single');
            setSelectedIds((ids) => (ids.length > 0 ? [ids[0]] : []));
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
      </Row>

      {selectionMode === 'multiple' && (
        <Text size="xs" colorVariant="secondary">
          Hold Shift for ranges or Cmd/Ctrl-click to toggle individual items.
        </Text>
      )}

      <Tree
        data={treeData}
        selectionMode={selectionMode}
        selectedIds={selectedIds}
        onSelectionChange={(ids) => {
          setSelectedIds(ids);
        }}
        expandAll
      />

      <Column gap="xs">
        <Text size="sm" weight="semibold">
          Selected ({selectionMode})
        </Text>
        <Text size="xs" colorVariant="secondary">
          {selectedIds.length === 0 ? 'None selected' : selectedIds.join(', ')}
        </Text>
      </Column>
    </Block>
  );
}
