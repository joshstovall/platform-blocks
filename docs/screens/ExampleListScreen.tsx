import { Text, Card, Block, Button, Flex, Icon, useTheme, Title, Alert, Grid, GridItem, Chip, AnimatedPressable } from '@platform-blocks/ui';
import { useRouter } from 'expo-router';
import { useBrowserTitle, formatPageTitle } from '../hooks/useBrowserTitle';
import { PageLayout } from 'components';
import { Pressable } from 'react-native';

interface ExampleApp {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
}

const exampleApps: ExampleApp[] = [
  {
    id: 'chatroom',
    title: 'Chatroom App',
    description: 'A complete chat interface with message bubbles, user avatars, and real-time messaging UI.',
    category: 'Social',
    icon: 'chat',
    difficulty: 'Intermediate',
    tags: ['Chat', 'Real-time', 'Messages', 'Social']
  },
  {
    id: 'ecommerce',
    title: 'E-commerce Store',
    description: 'Product catalog with cards, filters, shopping cart, and checkout flow.',
    category: 'Commerce',
    icon: 'shop',
    difficulty: 'Advanced',
    tags: ['Shopping', 'Products', 'Cart', 'E-commerce']
  },
  {
    id: 'social-feed',
    title: 'Social Media Feed',
    description: 'Instagram-like feed with posts, likes, comments, and user interactions.',
    category: 'Social',
    icon: 'heart',
    difficulty: 'Intermediate',
    tags: ['Social', 'Feed', 'Posts', 'Likes']
  },
  {
    id: 'todo-app',
    title: 'Todo & Task Manager',
    description: 'Task management with lists, priorities, due dates, and completion tracking.',
    category: 'Productivity',
    icon: 'check',
    difficulty: 'Beginner',
    tags: ['Tasks', 'Productivity', 'Lists', 'Organization']
  },
  {
    id: 'music-player',
    title: 'Music Player',
    description: 'Music streaming interface with playlists, player controls, and audio visualization.',
    category: 'Entertainment',
    icon: 'music',
    difficulty: 'Intermediate',
    tags: ['Music', 'Audio', 'Player', 'Streaming']
  },
  {
    id: 'dashboard',
    title: 'Analytics Dashboard',
    description: 'Business dashboard with stats, charts, and project tracking functionality.',
    category: 'Business',
    icon: 'bar-chart',
    difficulty: 'Advanced',
    tags: ['Analytics', 'Charts', 'Business', 'Dashboard']
  },
  {
    id: 'settings',
    title: 'Settings Page',
    description: 'User settings interface with profile management, preferences, and account controls.',
    category: 'Utility',
    icon: 'settings',
    difficulty: 'Intermediate',
    tags: ['Settings', 'Profile', 'Preferences', 'Account']
  }, {
    id: 'finder',
    title: 'Finder (File Browser)',
    description: 'MacOS Finder style file browser with sidebar, breadcrumb navigation, file list and preview pane.',
    category: 'Utility',
    icon: 'folder',
    difficulty: 'Advanced',
    tags: ['Files', 'Browser', 'Navigation', 'Finder']
  },
  {
    id: 'chromatic-tuner',
    title: 'Chromatic Tuner',
    description: 'A musical instrument tuner that detects pitch and displays note information in real-time.',
    category: 'Entertainment',
    icon: 'music-note',
    difficulty: 'Advanced',
    tags: ['Music', 'Tuner', 'Pitch Detection', 'Audio']
  }
  , {
    id: 'daw',
    title: 'Digital Audio Workstation',
    description: 'Multi-track sequencer with transport, loop, zoom and clip lane visualization.',
    category: 'Entertainment',
    icon: 'music',
    difficulty: 'Advanced',
    tags: ['Audio', 'Tracks', 'Sequencer', 'Music']
  }
  , {
    id: 'photo-gallery',
    title: 'Photo Gallery',
    description: 'Masonry layout with endless scrolling and fullscreen lightbox.',
    category: 'Media',
    icon: 'gallery',
    difficulty: 'Intermediate',
    tags: ['Photos', 'Masonry', 'Gallery', 'Infinite Scroll']
  }
];

const getDifficultyColor = (difficulty: ExampleApp['difficulty']) => {
  switch (difficulty) {
    case 'Beginner': return 'success';
    case 'Intermediate': return 'warning';
    case 'Advanced': return 'error';
    default: return 'gray';
  }
};

export default function ExampleListScreen() {
  const router = useRouter();
  const theme = useTheme();

  // Set browser title
  useBrowserTitle(formatPageTitle('Examples'));

  const handleExamplePress = (category: string) => {
    router.push(`/examples/${category}`);
  };

  return (
    <PageLayout>
      <Block p="lg" gap="lg">
        <Block >
          <Title variant='h1' weight="bold" afterline>
            Example Apps
          </Title>
          <Text size="lg" color="muted">
            Explore complete UI implementations built with PlatformBlocks components
          </Text>
        </Block>

        <Grid columns={{ base: 1, md: 2 }} gap="lg">
          {exampleApps.map((app) => (

            <GridItem key={app.id} >
              <AnimatedPressable onPress={() => handleExamplePress(app.id)}>
              <Card key={app.id} shadow="md" variant='outline'>
                <Flex direction="column" gap={16}>
                  <Flex direction="row" align="center" justify="space-between" gap={12}>
                    <Flex direction="row" align="center" gap={12}>
                      <Flex
                        align="center"
                        justify="center"
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: 12,
                          backgroundColor: theme.colors.primary[0],
                        }}
                      >
                        <Icon name={app.icon as any} size={22} color={theme.colors.primary[6]} />
                      </Flex>
                      <Text size="lg" weight="semibold">
                        {app.title}
                      </Text>
                    </Flex>
{/* 
                    <Text
                      size="sm"
                      color={getDifficultyColor(app.difficulty) as any}
                      weight="medium"
                    >
                      {app.difficulty}
                    </Text> */}
                  </Flex>

                  <Text color="muted">
                    {app.description}
                  </Text>

                  <Flex direction="row" gap={4} >
                    {app.tags.map((tag) => (
                      <Chip
                        key={tag}
                        size="sm"
                        variant="light"
                        color="gray"
                      >
                        {tag}
                      </Chip>
                    ))}
                  </Flex>

                  {/* <Button
                    title="view"
                    variant="filled"
                    size="sm"
                    onPress={() => handleExamplePress(app.id)}
                  >
                    View Example
                  </Button> */}
                </Flex>
              </Card>
              
              </AnimatedPressable>
              </GridItem>
          ))}
        </Grid>

        <Alert variant="light">
          <Flex direction="column" gap={16}>
            <Flex direction="row" align="center" gap={8}>
              <Icon name="star" size="md" color="primary" />
              <Text size="lg" weight="semibold">
                About Examples
              </Text>
            </Flex>
            <Text color="muted">
              These examples showcase real-world UI patterns and demonstrate how to combine
              PlatformBlocks components to build complete applications. Each example includes
              interactive components, proper responsive design, and follows best practices
              for accessibility and user experience.
            </Text>
          </Flex>
        </Alert>
      </Block>
    </PageLayout>
  );
}
