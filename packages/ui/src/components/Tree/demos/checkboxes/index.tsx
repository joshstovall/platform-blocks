import { useState } from 'react';

import { Block, Column, Text, Tree, type TreeNode } from '@platform-blocks/ui';

const treeData: TreeNode[] = [
  {
    id: 'frontend',
    label: 'Frontend Technologies',
    children: [
      {
        id: 'frameworks',
        label: 'Frameworks',
        children: [
          { id: 'react', label: 'React' },
          { id: 'vue', label: 'Vue.js' },
          { id: 'angular', label: 'Angular' },
        ],
      },
      {
        id: 'styling',
        label: 'Styling',
        children: [
          { id: 'css', label: 'CSS' },
          { id: 'sass', label: 'Sass' },
          { id: 'tailwind', label: 'Tailwind CSS' },
        ],
      },
    ],
  },
  {
    id: 'backend',
    label: 'Backend Technologies',
    children: [
      {
        id: 'languages',
        label: 'Languages',
        children: [
          { id: 'nodejs', label: 'Node.js' },
          { id: 'python', label: 'Python' },
          { id: 'go', label: 'Go' },
        ],
      },
      {
        id: 'databases',
        label: 'Databases',
        children: [
          { id: 'postgresql', label: 'PostgreSQL' },
          { id: 'mongodb', label: 'MongoDB' },
          { id: 'redis', label: 'Redis' },
        ],
      },
    ],
  },
];

export default function Demo() {
  const [checkedIds, setCheckedIds] = useState<string[]>(['react', 'css']);

  return (
    <Block gap="sm" fullWidth>
      <Tree
        data={treeData}
        checkboxes
        cascadeCheck
        checkedIds={checkedIds}
        onCheckedChange={(ids) => {
          setCheckedIds(ids);
        }}
        expandAll
      />

      <Column gap="xs">
        <Text weight="semibold">Checked technologies</Text>
        <Text size="xs" colorVariant="secondary">
          {checkedIds.length === 0 ? 'None selected' : checkedIds.join(', ')}
        </Text>
      </Column>
    </Block>
  );
}
