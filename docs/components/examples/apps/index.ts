export interface MiniApp {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  components: string[];
}

export const miniApps: MiniApp[] = [
  {
    id: 'chatroom',
    title: 'Chatroom App',
    description: 'A complete chat interface demonstrating message bubbles, user avatars, and real-time messaging UI patterns.',
    category: 'Social',
    difficulty: 'Intermediate',
    tags: ['Chat', 'Real-time', 'Messages', 'Social'],
    components: ['Card', 'Input', 'Button', 'Icon', 'Text', 'Flex']
  },
  {
    id: 'todo-app',
    title: 'Todo & Task Manager',
    description: 'Task management interface with lists, priorities, and completion tracking.',
    category: 'Productivity',
    difficulty: 'Beginner',
    tags: ['Tasks', 'Productivity', 'Lists', 'Organization'],
    components: ['Card', 'Input', 'Button', 'Icon', 'Text', 'Flex']
  },
  {
    id: 'ecommerce',
    title: 'E-commerce Store',
    description: 'Complete shopping experience with product catalog, cart management, and checkout flow.',
    category: 'Commerce',
    difficulty: 'Advanced',
    tags: ['Shopping', 'Products', 'Cart', 'E-commerce'],
    components: ['Card', 'Input', 'Button', 'Icon', 'Text', 'Flex', 'Chip']
  },
  {
    id: 'dashboard',
    title: 'Analytics Dashboard',
    description: 'Business dashboard with stats, charts, and project tracking functionality.',
    category: 'Business',
    difficulty: 'Advanced',
    tags: ['Analytics', 'Charts', 'Business', 'Dashboard'],
    components: ['Card', 'Button', 'Icon', 'Text', 'Flex', 'Grid', 'Progress']
  },
  {
    id: 'settings',
    title: 'Settings Page',
    description: 'Comprehensive settings interface with profile management, preferences, and account controls.',
    category: 'Utility',
    difficulty: 'Intermediate',
    tags: ['Settings', 'Profile', 'Preferences', 'Account'],
    components: ['Card', 'Input', 'Button', 'Icon', 'Text', 'Flex', 'Switch']
  },
  {
    id: 'music-player',
    title: 'Music Player',
    description: 'Full-featured music player with playback controls, playlist management, and progress tracking.',
    category: 'Entertainment',
    difficulty: 'Intermediate',
    tags: ['Music', 'Audio', 'Player', 'Streaming'],
    components: ['Card', 'Button', 'Icon', 'Text', 'Flex', 'Progress', 'Slider']
  }
  ,{
    id: 'social-feed',
    title: 'Instagram Feed',
    description: 'Social feed with stories bar, posts, likes, comments, and save actions demonstrating media-heavy scrolling UI.',
    category: 'Social',
    difficulty: 'Intermediate',
    tags: ['Social', 'Feed', 'Media', 'Scrolling'],
    components: ['Card', 'Avatar', 'Icon', 'Text', 'Flex', 'Button']
  },{
  id: 'finder',
    title: 'Finder (File Browser)',
    description: 'MacOS Finder style file browser with sidebar, breadcrumb navigation, file list and preview pane.',
    category: 'Utility',
    difficulty: 'Advanced',
    tags: ['Files', 'Browser', 'Navigation', 'Finder'],
    components: ['Card','Flex','Input','Chip','Switch','Icon','Text']
  } ,
  { 
    id: 'chromatic-tuner',
    title: 'Chromatic Tuner',
    description: 'A musical instrument tuner that detects pitch and displays note information in real-time.',
    category: 'Entertainment',
    difficulty: 'Advanced',
    tags: ['Music', 'Tuner', 'Pitch Detection', 'Audio'],
    components: ['Card','Flex','Text','Icon','Button','Progress','Grid']
  }
  ,{
    id: 'daw',
    title: 'Digital Audio Workstation',
    description: 'Multi-track arrangement view with transport, looping, zoom and clip lanes.',
    category: 'Entertainment',
    difficulty: 'Advanced',
    tags: ['Audio','Tracks','Sequencer','Music'],
    components: ['Flex','Button','Slider','ToggleButton','Chip','Text','Icon','ScrollView']
  }
  ,{
    id: 'photo-gallery',
    title: 'Photo Gallery',
    description: 'Masonry photo grid with endless scrolling and fullscreen lightbox, similar to SmugMug or Pixieset.',
    category: 'Media',
    difficulty: 'Intermediate',
    tags: ['Photos','Masonry','Gallery','Lightbox','Infinite Scroll'],
    components: ['Masonry','Card','Text','Flex','Gallery']
  }
];

export const getMiniAppById = (id: string): MiniApp | undefined => {
  return miniApps.find(app => app.id === id);
};

export const getMiniAppsByCategory = (category: string): MiniApp[] => {
  return miniApps.filter(app => app.category === category);
};

// Group mini apps by category
export const miniAppsByCategory = miniApps.reduce((acc, app) => {
  if (!acc[app.category]) {
    acc[app.category] = [];
  }
  acc[app.category].push(app);
  return acc;
}, {} as Record<string, MiniApp[]>);
