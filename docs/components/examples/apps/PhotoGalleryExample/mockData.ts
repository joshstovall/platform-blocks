import type { PhotoItem } from './types';

const sampleURIs = [
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=80&auto=format',
  'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=1200&q=80&auto=format',
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=1200&q=80&auto=format',
  'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=1200&q=80&auto=format',
  'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=1200&q=80&auto=format',
  'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1200&q=80&auto=format',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=80&auto=format',
  'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=1200&q=80&auto=format',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80&auto=format',
  'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=1200&q=80&auto=format'
];

const TITLES = ['Sunset Vista', 'Urban Mood', 'Nature Walk', 'Calm Waters', 'Desert Trails', 'City Nights', 'Morning Light', 'Coastal Breeze', 'Forest Path', 'Golden Hour'];

export const PHOTOS: PhotoItem[] = Array.from({ length: 36 }).map((_, i) => {
  const ratio = [1, 1.2, 1.5, 0.75, 1.8, 0.66][i % 6];
  return {
    id: `ph-${i + 1}`,
    uri: sampleURIs[i % sampleURIs.length],
    ratio,
    title: TITLES[i % TITLES.length],
    subtitle: ['Portrait', 'Landscape', 'Travel', 'Street', 'Nature'][i % 5]
  };
});

export function createMorePhotos(startIndex = 0, count = 20): PhotoItem[] {
  return Array.from({ length: count }).map((_, i) => {
    const idx = startIndex + i;
    const ratio = [1, 1.25, 1.6, 0.7, 1.3, 0.8][idx % 6];
    return {
      id: `ph-${idx + 1}`,
      uri: sampleURIs[idx % sampleURIs.length],
      ratio,
      title: TITLES[idx % TITLES.length],
      subtitle: ['Portrait', 'Landscape', 'Travel', 'Street', 'Nature'][idx % 5]
    };
  });
}
