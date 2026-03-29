import type { Message } from './types';

export const mockMessages: Message[] = [
  {
    id: 1,
    user: 'Alice Johnson',
    avatar: 'AJ',
    avatarUrl: 'https://randomuser.me/api/portraits/women/1.jpg',
    message: 'Hey everyone! How\'s the new design system working out?',
    time: '9:45 AM',
    date: '2024-03-15',
    isOwn: false,
    status: 'read',
    isOnline: true,
    reaction: '👍'
  },
  {
    id: 2,
    user: 'Bob Smith',
    avatar: 'BS',
    avatarUrl: 'https://randomuser.me/api/portraits/men/2.jpg',
    message: 'I\'ve been testing it all morning. The components are incredibly well structured!',
    time: '9:47 AM',
    date: '2024-03-15',
    isOwn: false,
    status: 'read',
    isOnline: true
  },
  {
    id: 3,
    user: 'You',
    avatar: 'YU',
    message: 'Thanks! We put a lot of effort into the architecture.',
    time: '9:50 AM',
    date: '2024-03-15',
    isOwn: true,
    status: 'read',
    replyTo: {
      id: 2,
      user: 'Bob Smith',
      message: 'I\'ve been testing it all morning. The components are incredibly well structured!'
    }
  },
  {
    id: 4,
    user: 'Sarah Chen',
    avatar: 'SC',
    avatarUrl: 'https://randomuser.me/api/portraits/women/3.jpg',
    message: 'The theming system is a game changer! 🎨',
    time: '9:52 AM',
    date: '2024-03-15',
    isOwn: false,
    status: 'read',
    isOnline: false
  },
  {
    id: 5,
    user: 'Mike Rodriguez',
    avatar: 'MR',
    avatarUrl: 'https://randomuser.me/api/portraits/men/4.jpg',
    message: 'Just shipped our first feature using PlatformBlocks. The developer experience is fantastic!',
    time: '2:15 PM',
    date: '2024-03-16',
    isOwn: false,
    status: 'delivered',
    isOnline: true,
    reaction: '🚀'
  },
  {
    id: 6,
    user: 'Emma Wilson',
    avatar: 'EW',
    message: 'That\'s awesome to hear!',
    time: '2:16 PM',
    date: '2024-03-16',
    isOwn: false,
    status: 'delivered',
    isOnline: true,
    replyTo: {
      id: 5,
      user: 'Mike Rodriguez',
      message: 'Just shipped our first feature using PlatformBlocks. The developer experience is fantastic!'
    }
  },
  {
    id: 7,
    user: 'Alice Johnson',
    avatar: 'AJ',
    avatarUrl: 'https://randomuser.me/api/portraits/women/1.jpg',
    message: 'We should definitely showcase this in our next team demo! 💪',
    time: '2:18 PM',
    date: '2024-03-16',
    isOwn: false,
    status: 'sent',
    isOnline: true
  },
  {
    id: 8,
    user: 'You',
    avatar: 'YU',
    message: 'Great idea! I\'ll prepare some examples.',
    time: '2:20 PM',
    date: '2024-03-16',
    isOwn: true,
    status: 'read'
  },
  {
    id: 9,
    user: 'David Kim',
    avatar: 'DK',
    avatarUrl: 'https://randomuser.me/api/portraits/men/5.jpg',
    message: 'The TypeScript support is incredible. IntelliSense works perfectly! 🔥',
    time: '4:30 PM',
    date: '2024-03-16',
    isOwn: false,
    status: 'sent',
    isOnline: false,
    reaction: '💯'
  }
];
