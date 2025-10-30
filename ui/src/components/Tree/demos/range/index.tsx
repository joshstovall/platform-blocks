import React, { useState } from 'react';
import { View } from 'react-native';
import { Tree, TreeNode, Text, Button, Flex, Card } from '../../../..';

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

export default function FinderRangeSelectionDemo() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleClearSelection = () => {
    setSelectedIds([]);
  };

  const handleSelectAll = () => {
    // Get all visible node IDs
    const getAllNodeIds = (nodes: TreeNode[]): string[] => {
      const ids: string[] = [];
      const walk = (nodeList: TreeNode[]) => {
        nodeList.forEach(node => {
          ids.push(node.id);
          if (node.children) {
            walk(node.children);
          }
        });
      };
      walk(nodes);
      return ids;
    };
    
    setSelectedIds(getAllNodeIds(finderData));
  };

  return (
    <View style={{ gap: 16 }}>
      <Card p={16} variant="outline">
        <Text size="sm" weight="bold" mb="sm">
          Finder-style Range Selection
        </Text>
        <Text size="xs" color="secondary" mb="md">
          Try shift-clicking to select ranges of items. Click individual items to toggle selection.
        </Text>
        
        <Flex direction="row" gap="sm" mb="md">
          <Button
            size="sm"
            variant="outline"
            onPress={handleClearSelection}
            disabled={selectedIds.length === 0}
          >
            Clear Selection
          </Button>
          <Button
            size="sm"
            variant="outline"
            onPress={handleSelectAll}
          >
            Select All
          </Button>
        </Flex>
      </Card>

      <Tree
        data={finderData}
        selectionMode="multiple"
        selectedIds={selectedIds}
        onSelectionChange={(ids, node) => {
          setSelectedIds(ids);
          console.log('Selected:', ids.length, 'items. Last selected:', node.label);
        }}
        expandAll
        style={{
          backgroundColor: '#fafafa',
          padding: 12,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#e0e0e0',
        }}
      />
      
      <Card p={16} variant="outline">
        <Text size="sm" weight="bold" mb="xs">
          Selection Summary:
        </Text>
        <Text size="xs" color="secondary" mb="sm">
          {selectedIds.length === 0 ? 'No items selected' : `${selectedIds.length} item(s) selected`}
        </Text>
        {selectedIds.length > 0 && (
          <View style={{ 
            maxHeight: 120, 
            backgroundColor: '#f8f9fa', 
            padding: 8, 
            borderRadius: 6,
            borderWidth: 1,
            borderColor: '#e9ecef'
          }}>
            <Text size="xs" color="secondary" style={{ fontFamily: 'monospace' }}>
              {selectedIds.join(', ')}
            </Text>
          </View>
        )}
      </Card>
      
      <Card p={16} variant="filled">
        <Text size="xs" color="secondary">
          <Text weight="bold">Usage Tips:</Text>{'\n'}
          • Click any item to select/deselect it{'\n'}
          • Hold Shift and click to select a range{'\n'}
          • Use Ctrl/Cmd + click for individual multi-selection{'\n'}
          • Range selection works across expanded/collapsed branches
        </Text>
      </Card>
    </View>
  );
}
