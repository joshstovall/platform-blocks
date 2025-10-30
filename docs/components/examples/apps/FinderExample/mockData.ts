import { FinderFile } from './types';

export const rootFiles: FinderFile[] = [
  {
    id: 'docs', name: 'Documents', type: 'folder', modified: '2025-09-01T10:00:00Z', children: [
      { id: 'proposal', name: 'Product Proposal.md', type: 'file', ext: 'md', size: 18234, modified: '2025-09-05T12:20:00Z' },
      { id: 'roadmap', name: 'Roadmap.xlsx', type: 'file', ext: 'xlsx', size: 522301, modified: '2025-08-28T09:15:00Z' },
      {
        id: 'brand', name: 'Brand', type: 'folder', modified: '2025-08-20T14:12:00Z', children: [
          { id: 'logo-svg', name: 'logo.svg', type: 'file', ext: 'svg', size: 5341, modified: '2025-09-02T11:05:00Z', content: '<svg width="48" height="48" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="20" fill="#4F46E5"/></svg>', mime: 'image/svg+xml' },
          { id: 'palette', name: 'palette.json', type: 'file', ext: 'json', size: 901, modified: '2025-09-02T11:10:00Z', content: '{\n  "primary": "#4F46E5",\n  "accent": "#EC4899",\n  "neutral": "#64748B"\n}', mime: 'application/json' }
        ]
      }
    ]
  },
  {
    id: 'media', name: 'Media', type: 'folder', modified: '2025-09-03T08:00:00Z', children: [
      { id: 'apple', name: 'apple.png', type: 'file', ext: 'png', size: 312003, modified: '2025-09-03T10:30:00Z', uri: 'https://cdn.pixabay.com/photo/2016/09/29/08/33/apple-1702316_1280.jpg', mime: 'image/png' },
      { id: 'intro-video', name: 'intro.mov', type: 'file', ext: 'mov', size: 10312003, modified: '2025-09-01T16:44:00Z', uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', mime: 'video/mp4' }
    ]
  },
  { id: 'license', name: 'LICENSE', type: 'file', ext: 'txt', size: 1092, modified: '2025-07-12T07:00:00Z', content: 'MIT License\n\nPermission is hereby granted... (truncated)', mime: 'text/plain' },
  { id: 'readme', name: 'README.md', type: 'file', ext: 'md', size: 4201, modified: '2025-09-06T13:00:00Z', content: '# Project README\n\nThis is a sample project README preview.\n\n## Features\n- Finder demo\n- Drag & drop\n- Tree view', mime: 'text/markdown' }
];
