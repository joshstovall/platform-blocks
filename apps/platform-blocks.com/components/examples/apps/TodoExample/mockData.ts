import { Task } from './types';

export const initialTasks: Task[] = [
  { id: 1, text: 'Design new button component', completed: true, priority: 'high' },
  { id: 2, text: 'Update documentation', completed: false, priority: 'medium' },
  { id: 3, text: 'Review PR #42', completed: false, priority: 'high' },
  { id: 4, text: 'Test mobile responsiveness', completed: false, priority: 'low' }
];
