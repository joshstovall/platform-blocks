import { View, ScrollView } from 'react-native';
import { TableOfContents, Title, Text } from '@platform-blocks/ui';

/**
 * Example showing how to properly scope TableOfContents to main content
 * This prevents the component from picking up navigation headings
 */
export default function ScopedContentExample() {
  return (
    <ScrollView style={{ flex: 1 }}>
      {/* This is navigation/header content - should be ignored */}
      <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' }}>
        <Title order={1}>Site Navigation</Title>
        <Title order={2}>Components</Title>
        <Title order={2}>Documentation</Title>
      </View>

      <View style={{ flexDirection: 'row', flex: 1 }}>
        {/* Sidebar with TableOfContents scoped to main content */}
        <View style={{ width: 250, padding: 16, borderRightWidth: 1, borderRightColor: '#eee' }}>
          <TableOfContents 
            container="#main-content" // Scope to only main content area
            variant="ghost"
            touchOptimized
          />
        </View>

        {/* Main content area - only these headings should appear in TOC */}
        <View id="main-content" style={{ flex: 1, padding: 24 }}>
          <Title order={1}>Getting Started</Title>
          <Text>This is the main content introduction.</Text>

          <Title order={2}>Installation</Title>
          <Text>Instructions for installation...</Text>

          <Title order={3}>Prerequisites</Title>
          <Text>What you need before installing...</Text>

          <Title order={3}>Package Manager</Title>
          <Text>Using npm or yarn...</Text>

          <Title order={2}>Configuration</Title>
          <Text>How to configure the component...</Text>

          <Title order={3}>Basic Setup</Title>
          <Text>Basic configuration options...</Text>

          <Title order={3}>Advanced Options</Title>
          <Text>Advanced configuration...</Text>

          <Title order={2}>Usage Examples</Title>
          <Text>Code examples and use cases...</Text>

          <Title order={2}>Troubleshooting</Title>
          <Text>Common issues and solutions...</Text>
        </View>
      </View>
    </ScrollView>
  );
}

/**
 * Alternative approach using automatic container detection
 * TableOfContents will automatically look for common main content containers
 */
export function AutoScopedExample() {
  return (
    <ScrollView style={{ flex: 1 }}>
      {/* Navigation content - will be ignored */}
      <View style={{ padding: 16, backgroundColor: '#f5f5f5' }}>
        <Title order={1}>Navigation Title</Title>
        <Title order={2}>Menu Item 1</Title>
        <Title order={2}>Menu Item 2</Title>
      </View>

      <View style={{ flexDirection: 'row', flex: 1 }}>
        <View style={{ width: 250, padding: 16 }}>
          <TableOfContents 
            // No container specified - will auto-detect main, article, .content, etc.
            variant="outline"
            color="primary"
          />
        </View>

        {/* Use semantic HTML elements for automatic detection */}
        <main style={{ flex: 1, padding: 24 }}>
          <Title order={1}>Main Article Title</Title>
          <Text>This content will be detected automatically.</Text>

          <Title order={2}>Section 1</Title>
          <Text>Content for section 1...</Text>

          <Title order={2}>Section 2</Title>
          <Text>Content for section 2...</Text>
        </main>
      </View>
    </ScrollView>
  );
}

/**
 * Example showing container selector options
 */
export function ContainerSelectorExamples() {
  return (
    <View style={{ padding: 20 }}>
      <Text variant="h2" style={{ marginBottom: 16 }}>Container Selector Options</Text>
      
      <Text style={{ marginBottom: 12 }}>
        The TableOfContents component supports various ways to scope content:
      </Text>

      <View style={{ padding: 16, backgroundColor: '#f9f9f9', borderRadius: 8, marginBottom: 16 }}>
        <Text style={{ fontFamily: 'monospace', marginBottom: 8 }}>
          {`// Specific element ID\n<TableOfContents container="#article-content" />`}
        </Text>
        <Text style={{ fontFamily: 'monospace', marginBottom: 8 }}>
          {`// CSS class\n<TableOfContents container=".main-content" />`}
        </Text>
        <Text style={{ fontFamily: 'monospace', marginBottom: 8 }}>
          {`// Multiple selectors (tries in order)\n<TableOfContents container="main, article, .content" />`}
        </Text>
        <Text style={{ fontFamily: 'monospace' }}>
          {`// HTML element reference\n<TableOfContents container={contentRef.current} />`}
        </Text>
      </View>

      <Text style={{ marginBottom: 12 }}>
        <Text style={{ fontWeight: '600' }}>Default behavior:</Text> When no container is specified,
        the component automatically searches for common main content containers:
      </Text>

      <View style={{ padding: 16, backgroundColor: '#f0f7ff', borderRadius: 8 }}>
        <Text style={{ fontFamily: 'monospace', fontSize: 12 }}>
          main, [role="main"], .main-content, #main-content, article, .content, #content
        </Text>
      </View>
    </View>
  );
}