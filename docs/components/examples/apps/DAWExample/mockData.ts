import { DAWTrack } from './types';

export const tracksMock: DAWTrack[] = [
  {
    id: 't1',
    name: 'Drums',
    color: '#f59e0b',
    armed: true,
    clips: [
      { id: 'c1', start: 0, length: 4 },
      { id: 'c2', start: 8, length: 4 },
      { id: 'c3', start: 16, length: 8 }
    ]
  },
  {
    id: 't2',
    name: 'Bass',
    color: '#10b981',
    clips: [
      { id: 'c4', start: 4, length: 4 },
      { id: 'c5', start: 12, length: 4 }
    ]
  },
  {
    id: 't3',
    name: 'Synth Pad',
    color: '#6366f1',
    clips: [
      { id: 'c6', start: 0, length: 8 },
      { id: 'c7', start: 12, length: 8 }
    ]
  },
  {
    id: 't4',
    name: 'Lead',
    color: '#ec4899',
    clips: [
      { id: 'c8', start: 6, length: 4 },
      { id: 'c9', start: 18, length: 4 }
    ]
  }
];
