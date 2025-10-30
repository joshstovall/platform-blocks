import React, { useState } from 'react';
import { View } from 'react-native';
import { Tree, TreeNode, Text } from '../../../..';

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

export default function CheckboxTreeDemo() {
  const [checkedIds, setCheckedIds] = useState<string[]>(['react', 'css']);

  return (
    <View style={{ gap: 16 }}>
      <Tree
        data={treeData}
        checkboxes
        cascadeCheck
        checkedIds={checkedIds}
        onCheckedChange={(ids, node) => {
          setCheckedIds(ids);
          console.log('Checked items:', ids);
        }}
        expandAll
      />
      
      <View style={{ marginTop: 16, padding: 12, backgroundColor: '#f5f5f5', borderRadius: 8 }}>
        <Text size="sm" weight="bold" mb="xs">Selected Technologies:</Text>
        <Text size="xs" color="secondary">
          {checkedIds.length === 0 ? 'None selected' : checkedIds.join(', ')}
        </Text>
      </View>
    </View>
  );
}
