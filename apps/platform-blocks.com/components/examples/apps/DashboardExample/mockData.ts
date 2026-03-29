import { Stat, Project } from './types';

export const stats: Stat[] = [
  { 
    title: 'Total Users',
    value: '12,847',
    change: '+12%',
    positive: true,
    icon: 'user'
  },
  {
    title: 'Revenue',
    value: '$24,580',
    change: '+8%',
    positive: true,
    icon: 'star'
  },
  {
    title: 'Orders',
    value: '1,247',
    change: '-3%',
    positive: false,
    icon: 'heart'
  },
  {
    title: 'Conversion',
    value: '3.24%',
    change: '+15%',
    positive: true,
    icon: 'chevron-up'
  }
];

export const projects: Project[] = [
  {
    id: 1,
    name: 'Mobile App Redesign',
    progress: 75,
    dueDate: 'Dec 15',
    status: 'In Progress',
    team: ['John', 'Sarah', 'Mike']
  },
  {
    id: 2,
    name: 'API Integration',
    progress: 45,
    dueDate: 'Dec 20',
    status: 'In Progress',
    team: ['Alice', 'Bob']
  },
  {
    id: 3,
    name: 'UI Component Library',
    progress: 90,
    dueDate: 'Dec 10',
    status: 'Almost Done',
    team: ['Sarah', 'Tom', 'Lisa']
  }
];
