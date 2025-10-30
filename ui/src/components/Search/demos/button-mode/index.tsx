import React, { useState } from 'react';
import { Flex, Text, useToast, KeyCap, Row } from '@platform-blocks/ui';
import { Search } from '../../../Search/Search';

export default function SearchButtonModeDemo() {
  const [lastAction, setLastAction] = useState('');
  const toast = useToast();

  const handleCustomPress = () => {
    setLastAction('Custom onPress called');
    toast.show({
      message: 'Search button pressed!',
    });
  };

  // CMD+K shortcut component
  const shortcutComponent = (
    <Row gap={4} align="center">
      <KeyCap size="xs">⌘</KeyCap>
      <KeyCap size="xs">K</KeyCap>
    </Row>
  );

  return (
    <Flex direction="column" gap={16} style={{ maxWidth: 400 }}>
      <Text size="sm" weight="medium">
        Search Button Mode Demo
      </Text>
      
      <Flex direction="column" gap={8}>
        <Text size="xs" color="muted">
          Button mode with CMD+K shortcut display:
        </Text>
        <Search 
          buttonMode={true}
          placeholder="Press to search..."
          rightComponent={shortcutComponent}
        />
      </Flex>

      <Flex direction="column" gap={8}>
        <Text size="xs" color="muted">
          Button mode with custom onPress and different shortcut:
        </Text>
        <Search 
          buttonMode={true}
          placeholder="Press to search..."
          onPress={handleCustomPress}
          rightComponent={
            <Row gap={4} align="center">
              <KeyCap size="xs" variant="outline">Ctrl</KeyCap>
              <KeyCap size="xs" variant="outline">F</KeyCap>
            </Row>
          }
        />
      </Flex>

      <Flex direction="column" gap={8}>
        <Text size="xs" color="muted">
          Button mode with default behavior (opens Spotlight):
        </Text>
        <Search 
          buttonMode={true}
          placeholder="Press to open Spotlight..."
        />
      </Flex>

      <Flex direction="column" gap={8}>
        <Text size="xs" color="muted">
          Normal input mode for comparison:
        </Text>
        <Search 
          placeholder="Type to search..."
        />
      </Flex>

      {lastAction && (
        <Text size="xs" color="muted">
          Last action: {lastAction}
        </Text>
      )}
    </Flex>
  );
}