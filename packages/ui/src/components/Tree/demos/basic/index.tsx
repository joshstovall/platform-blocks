import { useState } from 'react';

import { Block, Text, Tree, type TreeNode } from '@platform-blocks/ui';

const treeData: TreeNode[] = [
  {
    id: 'documents',
    label: 'Documents',
    children: [
      {
        id: 'work',
        label: 'Work',
        children: [
          { id: 'presentation.pptx', label: 'Presentation.pptx' },
          { id: 'budget.xlsx', label: 'Budget.xlsx' },
          { id: 'report.docx', label: 'Report.docx' },
        ],
      },
      {
        id: 'personal',
        label: 'Personal',
        children: [
          { id: 'vacation-photos', label: 'Vacation Photos' },
          { id: 'recipes.txt', label: 'Recipes.txt' },
        ],
      },
    ],
  },
  {
    id: 'downloads',
    label: 'Downloads',
    children: [
      { id: 'installer.dmg', label: 'Installer.dmg' },
      { id: 'archive.zip', label: 'Archive.zip' },
    ],
  },
  {
    id: 'desktop',
    label: 'Desktop',
    children: [
      { id: 'screenshot.png', label: 'Screenshot.png' },
      { id: 'notes.txt', label: 'Notes.txt' },
    ],
  },
];

export default function Demo() {
  const [lastAction, setLastAction] = useState('Expand folders or open files to see updates.');

  return (
    <Block gap="sm" fullWidth>
      <Tree
        data={treeData}
        collapsible
        indent={20}
        onNavigate={(node) => {
          setLastAction(`Opened ${node.label}`);
        }}
        onToggle={(node, expanded) => {
          setLastAction(`${expanded ? 'Expanded' : 'Collapsed'} ${node.label}`);
        }}
      />
      <Text size="xs" colorVariant="secondary">
        {lastAction}
      </Text>
    </Block>
  );
}
