import React, { useState } from 'react';
import { View, TextInput } from 'react-native';
import { Tree, TreeNode, Text, Button, Flex } from '../../../..';

const treeData: TreeNode[] = [
  {
    id: 'programming',
    label: 'Programming Languages',
    children: [
      {
        id: 'frontend',
        label: 'Frontend',
        children: [
          { id: 'javascript', label: 'JavaScript' },
          { id: 'typescript', label: 'TypeScript' },
          { id: 'html', label: 'HTML' },
          { id: 'css', label: 'CSS' },
        ],
      },
      {
        id: 'backend',
        label: 'Backend',
        children: [
          { id: 'python', label: 'Python' },
          { id: 'java', label: 'Java' },
          { id: 'csharp', label: 'C#' },
          { id: 'go', label: 'Go' },
        ],
      },
      {
        id: 'mobile',
        label: 'Mobile',
        children: [
          { id: 'swift', label: 'Swift' },
          { id: 'kotlin', label: 'Kotlin' },
          { id: 'dart', label: 'Dart' },
        ],
      },
    ],
  },
  {
    id: 'databases',
    label: 'Databases',
    children: [
      { id: 'mysql', label: 'MySQL' },
      { id: 'postgresql', label: 'PostgreSQL' },
      { id: 'mongodb', label: 'MongoDB' },
      { id: 'redis', label: 'Redis' },
    ],
  },
];

export default function FilteringTreeDemo() {
  const [filterQuery, setFilterQuery] = useState('');
  const [hideFiltered, setHideFiltered] = useState(true);

  const highlightMatch = (label: string, query: string) => {
    if (!query) return label;
    
    const parts = label.split(new RegExp(`(${query})`, 'gi'));
    return (
      <Text size="sm">
        {parts.map((part, index) => 
          part.toLowerCase() === query.toLowerCase() ? (
            <Text key={index} style={{ backgroundColor: '#ffeb3b', fontWeight: 'bold' }}>
              {part}
            </Text>
          ) : (
            part
          )
        )}
      </Text>
    );
  };

  return (
    <View style={{ gap: 16 }}>
      <View style={{ gap: 12 }}>
        <TextInput
          placeholder="Search technologies..."
          value={filterQuery}
          onChangeText={setFilterQuery}
          style={{ 
            borderWidth: 1, 
            borderColor: '#ddd', 
            borderRadius: 8, 
            padding: 12,
            fontSize: 14 
          }}
        />
        
        <Flex direction="row" gap="md" align="center">
          <Text size="sm" weight="bold">Filter Mode:</Text>
          <Button
            size="sm"
            variant={hideFiltered ? 'filled' : 'outline'}
            onPress={() => setHideFiltered(true)}
          >
            Hide Non-matching
          </Button>
          <Button
            size="sm"
            variant={!hideFiltered ? 'filled' : 'outline'}
            onPress={() => setHideFiltered(false)}
          >
            Highlight Only
          </Button>
        </Flex>
      </View>

      <Tree
        data={treeData}
        filterQuery={filterQuery}
        hideFiltered={hideFiltered}
        highlight={highlightMatch}
        expandAll={!!filterQuery} // Auto-expand when searching
        noResultsFallback={
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text size="sm" color="secondary">
              No technologies found matching &quot;{filterQuery}&quot;
            </Text>
          </View>
        }
      />
    </View>
  );
}
