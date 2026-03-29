import { useMemo, useState } from 'react';

import { Block, Button, Column, Row, Text, Tree, type TreeNode } from '@platform-blocks/ui';

const finderData: TreeNode[] = [
  {
    id: 'documents',
    label: 'Documents',
    startOpen: true,
    children: [
      {
        id: 'projects',
        label: 'Projects',
        startOpen: true,
        children: [
          { id: 'project-a', label: 'Project Alpha' },
          { id: 'project-b', label: 'Project Beta' },
          { id: 'project-c', label: 'Project Gamma' },
          { id: 'project-d', label: 'Project Delta' },
          { id: 'project-e', label: 'Project Epsilon' },
        ],
      },
      {
        id: 'reports',
        label: 'Reports',
        children: [
          { id: 'q1-report', label: 'Q1 Financial Report' },
          { id: 'q2-report', label: 'Q2 Financial Report' },
          { id: 'annual-report', label: 'Annual Performance Report' },
        ],
      },
      {
        id: 'presentations',
        label: 'Presentations',
        children: [
          { id: 'deck-1', label: 'Product Launch Deck' },
          { id: 'deck-2', label: 'Quarterly Review' },
          { id: 'deck-3', label: 'Team Updates' },
          { id: 'deck-4', label: 'Budget Planning' },
        ],
      },
    ],
  },
  {
    id: 'downloads',
    label: 'Downloads',
    children: [
      { id: 'software', label: 'Software Installers' },
      { id: 'images', label: 'Image Files' },
      { id: 'videos', label: 'Video Files' },
      { id: 'archives', label: 'ZIP Archives' },
    ],
  },
  {
    id: 'desktop',
    label: 'Desktop',
    children: [
      { id: 'shortcuts', label: 'App Shortcuts' },
      { id: 'temp-files', label: 'Temporary Files' },
    ],
  },
];

const collectAllIds = (nodes: TreeNode[]): string[] => {
  const ids: string[] = [];
  const walk = (nodeList: TreeNode[]) => {
    nodeList.forEach((node) => {
      ids.push(node.id);
      if (node.children) {
        walk(node.children);
      }
    });
  };
  walk(nodes);
  return ids;
};

export default function Demo() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const allIds = useMemo(() => collectAllIds(finderData), []);

  const handleClearSelection = () => {
    setSelectedIds([]);
  };

  const handleSelectAll = () => {
    setSelectedIds(allIds);
  };

  return (
    <Block gap="sm" fullWidth>
      <Column gap="xs">
        <Text weight="semibold">Finder-style range selection</Text>
        <Text size="xs" colorVariant="secondary">
          Click to toggle individual items or hold Shift to capture ranges.
        </Text>
        <Row gap="xs" wrap="wrap">
          <Button size="sm" variant="outline" onPress={handleClearSelection} disabled={selectedIds.length === 0}>
            Clear selection
          </Button>
          <Button size="sm" variant="outline" onPress={handleSelectAll}>
            Select all
          </Button>
        </Row>
      </Column>

      <Tree
        data={finderData}
        selectionMode="multiple"
        selectedIds={selectedIds}
        onSelectionChange={(ids) => {
          setSelectedIds(ids);
        }}
        expandAll
        striped
      />

      <Column gap="xs">
        <Text size="sm" weight="semibold">
          Selection summary
        </Text>
        <Text size="xs" colorVariant="secondary">
          {selectedIds.length === 0 ? 'No items selected' : `${selectedIds.length} item(s) selected`}
        </Text>
        {selectedIds.length > 0 && (
          <Text size="xs" colorVariant="secondary">
            {selectedIds.join(', ')}
          </Text>
        )}
      </Column>
    </Block>
  );
}
