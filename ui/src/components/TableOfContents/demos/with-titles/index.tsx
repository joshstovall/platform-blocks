import React from 'react';
import { View, ScrollView } from 'react-native';
import { TableOfContents } from '../../TableOfContents';
import { Text } from '../../../Text';
import { Title } from '../../../Title';
import { TitleRegistryProvider } from '../../../../contexts';

export default function BasicTableOfContentsDemo() {
  return (
    <TitleRegistryProvider>
      <View style={{ flex: 1, padding: 16 }}>
        <Text variant="h2" style={{ marginBottom: 16, textAlign: 'center' }}>
          TableOfContents with Title Detection
        </Text>
        
        <ScrollView style={{ flex: 1 }}>
          {/* TableOfContents - will automatically detect Title components below */}
          <TableOfContents
            variant="outline"
            radius="md"
            size="sm"
            style={{ marginBottom: 24 }}
          />

          {/* Sample content using Title components */}
          <View>
            <Title order={1}>
              Introduction
            </Title>
            <Text style={{ marginBottom: 16 }}>
              This demonstrates how TableOfContents automatically detects Title components.
            </Text>

            <Title order={2}>
              Getting Started
            </Title>
            <Text style={{ marginBottom: 16 }}>
              Simply wrap your content with TitleRegistryProvider and use Title components.
            </Text>

            <Title order={3}>
              Installation
            </Title>
            <Text style={{ marginBottom: 16 }}>
              No additional setup required - Title components register themselves automatically.
            </Text>

            <Title order={2}>
              Usage Examples
            </Title>
            <Text style={{ marginBottom: 16 }}>
              The TableOfContents will show all registered Title components in the order they appear.
            </Text>

            <Title order={3}>
              With Decorations
            </Title>
            <Text style={{ marginBottom: 16 }}>
              Title components can include underlines, prefixes, and other decorative elements.
            </Text>

            <Title order={1}>
              Advanced Features
            </Title>
            <Text style={{ marginBottom: 16 }}>
              TableOfContents supports mobile modes, customization, and more.
            </Text>
          </View>
        </ScrollView>
      </View>
    </TitleRegistryProvider>
  );
}