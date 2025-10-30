import { useState } from 'react';
import { Spotlight, useSpotlightStoreInstance, Text, Button, Flex, Card } from '@platform-blocks/ui';

// Actions intentionally share overlapping substrings to show highlighting effect
const actions = [
  { id: 'create-project', label: 'Create Project', description: 'Start a new project workspace', icon: 'plus', onPress: () => console.log('create project') },
  { id: 'create-branch', label: 'Create Branch', description: 'Open branch creation workflow', icon: 'code', onPress: () => console.log('create branch') },
  { id: 'open-recent', label: 'Open Recent Project', description: 'Choose from recently opened', icon: 'folder', onPress: () => console.log('open recent') },
  { id: 'project-settings', label: 'Project Settings', description: 'Configure repository options', icon: 'settings', onPress: () => console.log('project settings') },
];

export default function Demo() {
  const [store] = useSpotlightStoreInstance();
  
  return (
    <Flex direction="column" gap={16}>
      <Card p={16} variant="outline">
        <Text size="lg" weight="semibold" mb={8}>Highlighting Query Matches</Text>
        <Text size="sm" color="dimmed" mb={12}>Type "proj" or "create" after opening to see matching substrings emphasized.</Text>
        <Button title="Open Spotlight" onPress={() => store.open()} />
      </Card>
      <Spotlight actions={actions as any} highlightQuery store={store} />
    </Flex>
  );
}
