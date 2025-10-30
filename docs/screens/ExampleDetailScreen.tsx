import { View } from 'react-native';
import { Text, Card, Flex, Chip, Tabs, useTheme, Button, Icon } from '@platform-blocks/ui';
import { useBrowserTitle, formatPageTitle } from '../hooks/useBrowserTitle';

import { useRouter } from 'expo-router';

// Import mini-app examples
import { ChatroomExample } from '../components/examples/apps/ChatroomExample/ChatroomExample';
import { TodoExample } from '../components/examples/apps/TodoExample/TodoExample';
import { DashboardExample } from '../components/examples/apps/DashboardExample/DashboardExample';
import { SettingsExample } from '../components/examples/apps/SettingsExample/SettingsExample';
import { MusicPlayerExample } from '../components/examples/apps/MusicPlayerExample/MusicPlayerExample';
import { EcommerceExample } from '../components/examples/apps/EcommerceExample/EcommerceExample';
import { FinderExample } from '../components/examples/apps/FinderExample/FinderExample';
import { SocialFeedExample } from '../components/examples/apps/SocialFeedExample/SocialFeedExample';
import { ChromaticTunerApp } from '../components/examples/apps/ChromaticTuner';
import { DAWExample } from '../components/examples/apps/DAWExample/DAWExample';
import { PhotoGalleryExample } from '../components/examples/apps/PhotoGalleryExample';
import { PageWrapper } from 'components/PageWrapper';

interface ExampleDetailScreenProps {
  category?: string;
}

const FULLSCREEN_EXAMPLES = new Set<string>([
  'chatroom',
  'todo-app',
  'dashboard',
  'settings',
  'music-player',
  'ecommerce',
  'finder',
  'daw',
  'photo-gallery',
  'social-feed',
  'chromatic-tuner',
]);

export default function ExampleDetailScreen({ category = 'unknown' }: ExampleDetailScreenProps) {
  const router = useRouter();
  const theme = useTheme();

  // Set browser title based on category
  const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);
  useBrowserTitle(formatPageTitle(`${categoryTitle} Example`));

  const handleComponentPress = (componentName: string) => {
    router.push(`/components/${componentName}`);
  };

  const renderExample = () => {
    switch (category) {
      case 'chatroom':
        return <ChatroomExample />;
      case 'todo-app':
        return <TodoExample />;
      case 'dashboard':
        return <DashboardExample />;
      case 'settings':
        return <SettingsExample />;
      case 'music-player':
        return <MusicPlayerExample />;
      case 'social-feed':
        return <SocialFeedExample />;
      case 'ecommerce':
        return <EcommerceExample />;
      case 'finder':
        return <FinderExample />;
      case 'chromatic-tuner':
        return <ChromaticTunerApp />;
      case 'daw':
        return <DAWExample />;
      case 'photo-gallery':
        return <PhotoGalleryExample />;
      default:
        return (
          <Card shadow="md" style={{ width: '100%', overflow: 'hidden' }}>
            <Text>Example "{category}" is coming soon!</Text>
          </Card>
        );
    }
  };

  const exampleInfo = (() => {
    switch (category) {
      case 'chatroom':
        return {
          title: 'Chatroom App',
          description: 'A complete chat interface demonstrating message bubbles, user avatars, and real-time messaging UI patterns.',
          components: ['Card', 'Input', 'Button', 'Icon', 'Text', 'Flex'],
        };
      case 'todo-app':
        return {
          title: 'Todo & Task Manager',
          description: 'Task management interface with lists, priorities, and completion tracking.',
          components: ['Card', 'Input', 'Button', 'Icon', 'Text', 'Flex'],
        };
      case 'dashboard':
        return {
          title: 'Analytics Dashboard',
          description: 'Business dashboard with stats, charts, and project tracking functionality.',
          components: ['Card', 'Button', 'Icon', 'Text', 'Flex', 'Grid', 'Progress'],
        };
      case 'settings':
        return {
          title: 'Settings Page',
          description: 'Comprehensive settings interface with profile management, preferences, and account controls.',
          components: ['Card', 'Input', 'Button', 'Icon', 'Text', 'Flex', 'Switch'],
        };
      case 'music-player':
        return {
          title: 'Music Player',
          description: 'Full-featured music player with playback controls, playlist management, and progress tracking.',
          components: ['Card', 'Button', 'Icon', 'Text', 'Flex', 'Progress', 'Slider'],
        };
      case 'ecommerce':
        return {
          title: 'E-commerce Shop',
          description: 'Complete shopping interface with product catalog, search, categories, and shopping cart functionality.',
          components: ['Card', 'Input', 'Button', 'Icon', 'Text', 'Flex', 'Chip'],
        };
      case 'finder':
        return {
          title: 'Finder (File Browser)',
          description: 'MacOS Finder style file browser with sidebar, breadcrumb navigation, file list and preview pane.',
          components: ['Card', 'Flex', 'Input', 'Chip', 'Switch', 'Icon', 'Text'],
        };
      case 'social-feed':
        return {
          title: 'Social Media Feed',
          description: 'Instagram-like feed with posts, likes, comments, and user interactions.',
          components: [],
        };
      case 'photo-gallery':
        return {
          title: 'Photo Gallery',
          description: 'Masonry layout with endless scrolling and fullscreen lightbox.',
          components: [],
        };
      case 'chromatic-tuner':
        return {
          title: 'Chromatic Tuner',
          description: 'Instrument tuner showcasing audio visualization and pitch detection UI.',
          components: [],
        };
      case 'daw':
        return {
          title: 'Digital Audio Workstation',
          description: 'Multi-track sequencer interface with transport controls and timeline visualization.',
          components: [],
        };
      default:
        return {
          title: 'Example App',
          description: 'This example is under construction.',
          components: [],
        };
    }
  })();

  const isValidExample = FULLSCREEN_EXAMPLES.has(category);

  const exitToExamples = () => {
    const canGoBack = typeof (router as any).canGoBack === 'function' ? (router as any).canGoBack() : false;

    if (canGoBack) {
      router.back();
    } else {
      router.replace('/examples');
    }
  };

  if (isValidExample) {
    const overlayBackground = theme.colorScheme === 'dark' ? 'rgba(12, 12, 12, 0.72)' : 'rgba(17, 17, 17, 0.6)';

    return (
      <View style={{ flex: 1, width: '100%', height: '100%', position: 'relative', backgroundColor: theme.colors.surface[5] }}>
        {/* <View
          style={{
            position: 'absolute',
            top: 16,
            left: 16,
            zIndex: 1000,
          }}
        >
          <Button
            title={exampleInfo.title}
            onPress={exitToExamples}
            variant="ghost"
            size="sm"
            textColor="#ffffff"
            radius="full"
            accessibilityLabel="Back to example list"
            startIcon={<Icon name="arrow-left" size="sm" color="#ffffff" />}
            style={{
              backgroundColor: overlayBackground,
              borderColor: 'transparent',
            }}
          />
        </View> */}
        {renderExample()}
      </View>
    );
  }

  return (
    <PageWrapper
    // style={styles.container} contentContainerStyle={styles.content}
    >

      {exampleInfo.components.length > 0 && (
        <Flex mt="md">
          <Text size="sm" weight="semibold" color="muted" mb="xs">
            Components used:
          </Text>
          <Tabs
            items={exampleInfo.components.map((component) => ({
              key: component,
              label: component,
              content: (
                <Card p="md" mt="xs" shadow="sm">
                  <Text size="lg" weight="semibold" color="primary">
                    {component}
                  </Text>
                  <Text size="sm" color="muted" mt="xs" mb="xs">
                    Click to view the {component} component documentation and examples.
                  </Text>
                  <Chip
                    variant="filled"
                    color="primary"
                    size="sm"
                    onPress={() => handleComponentPress(component)}
                    style={{ alignSelf: 'flex-start' }}
                  >
                    View Documentation
                  </Chip>
                </Card>
              )
            }))}
            variant="chip"
            size="sm"
            color="primary"
            scrollable={true}
            mt="xs"
          />
        </Flex>
      )}

      {renderExample()}
    </PageWrapper>
  );
}
