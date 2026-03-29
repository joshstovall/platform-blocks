import React from 'react';
import { ScrollView } from 'react-native';
import { PageLayout } from '../../components/PageLayout';
import { Text, Card, Checkbox, Title, Flex } from '@platform-blocks/ui';

// Emoji component for larger display
const EmojiIcon = ({ emoji }: { emoji: string }) => (
  <Text size="xl">{emoji}</Text>
);

// Project goals and roadmap
const PROJECT_GOALS = [
  {
    id: 'core-components',
    emoji: '🧱',
    label: 'Core Component Library',
    description: 'Essential UI components (Button, Text, Input, Card, etc.)',
    completed: true
  },
  {
    id: 'theming-system',
    emoji: '🎨',
    label: 'Comprehensive Theming System',
    description: 'Design tokens, dark mode, and customizable themes',
    completed: true
  },
  {
    id: 'icons-package',
    emoji: '🎯',
    label: 'Icon System & Package',
    description: 'Scalable icon library with platform-specific icons',
    completed: true
  },
  {
    id: 'data-table',
    emoji: '📊',
    label: 'DataTable Component',
    description: 'Advanced table with filtering, sorting, and pagination',
    completed: true
  },
  {
    id: 'platform-docs',
    emoji: '📱',
    label: 'Platform Documentation',
    description: 'iOS, Android, and Web platform-specific guides',
    completed: true
  },
  {
    id: 'charts-library',
    emoji: '📈',
    label: 'Data Visualization Charts',
    description: 'Interactive charts for analytics and reporting',
    completed: false
  },
  {
    id: 'forms-system',
    emoji: '📝',
    label: 'Advanced Forms Package',
    description: 'Form validation, fields, and complex form layouts',
    completed: false
  },
  {
    id: 'accessibility',
    emoji: '♿',
    label: 'Accessibility Compliance',
    description: 'WCAG 2.1 AA compliance across all components',
    completed: false
  },
  {
    id: 'testing-suite',
    emoji: '🧪',
    label: 'Comprehensive Testing',
    description: 'Unit tests, integration tests, and visual regression',
    completed: false
  },
  {
    id: 'performance',
    emoji: '⚡',
    label: 'Performance Optimization',
    description: 'Tree-shaking, code splitting, and bundle optimization',
    completed: false
  },
  {
    id: 'animation-system',
    emoji: '✨',
    label: 'Animation Framework',
    description: 'Smooth animations and micro-interactions',
    completed: false
  },
  {
    id: 'marketplace-ready',
    emoji: '📦',
    label: 'NPM Package Distribution',
    description: 'Published packages ready for production use',
    completed: false
  }
];

export default function RoadmapScreen() {
  return (
    <PageLayout>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Flex direction="column" p="lg" gap="xl">
          
          {/* Header */}
          <Flex direction="column">
            <Title afterline>
              Platform Blocks Roadmap
            </Title>
            <Text variant="p" colorVariant="secondary" mb="md">
              Our vision for building the most comprehensive React Native UI library 🚀
            </Text>
          </Flex>

          {/* Goals List */}
           
            <Flex direction="column" gap="md">
              {PROJECT_GOALS.map((goal) => (
                <Flex key={goal.id} direction="row" align="flex-start" gap="md">
                  <EmojiIcon emoji={goal.emoji} />
                  <Flex style={{ flex: 1 }}>
                    <Checkbox
                      label={goal.label}
                      description={goal.description}
                      checked={goal.completed}
                      size="xs"
                      colorVariant="secondary"
                    />
                  </Flex>
                </Flex>
              ))}
            </Flex>

        </Flex>
      </ScrollView>
    </PageLayout>
  );
}