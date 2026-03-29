import { FeedUser, FeedPost } from './types';

export const feedUsers: FeedUser[] = [
  { id: 'u1', name: 'Jane Cooper', handle: 'janecooper', avatar: 'https://randomuser.me/api/portraits/women/1.jpg', verified: true },
  { id: 'u2', name: 'Devon Lane', handle: 'devonlane', avatar: 'https://randomuser.me/api/portraits/men/2.jpg' },
  { id: 'u3', name: 'Leslie Alexander', handle: 'lesliealex', avatar: 'https://randomuser.me/api/portraits/women/3.jpg' },
  { id: 'u4', name: 'Jacob Jones', handle: 'jjones', avatar: 'https://randomuser.me/api/portraits/men/4.jpg' }
];

const sampleImages = [
  'https://images.unsplash.com/photo-1755371034010-51c25321312d?q=80',
  'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=800',
  'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=800',
  'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
  'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=800',
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800'
];

export const feedPosts: FeedPost[] = Array.from({ length: 12 }).map((_, i) => {
  const user = feedUsers[i % feedUsers.length];
  const basePost: FeedPost = {
    id: `p${i + 1}`,
    userId: user.id,
    image: sampleImages[i % sampleImages.length],
    caption: 'Exploring UI design systems with Platform Blocks – building consistent cross‑platform experiences. #' + (i % 2 ? 'reactnative' : 'designsystem'),
    liked: Math.random() > 0.5,
    likeCount: 40 + Math.floor(Math.random() * 900),
    commentCount: 2 + Math.floor(Math.random() * 80),
    createdAt: new Date(Date.now() - (i * 3600 * 1000)),
    saved: Math.random() > 0.8
  };

  // Make every 4th post (e.g., p2, p5, p8) an album with 3-5 images
  if ((i + 1) % 3 === 2) {
    const albumImages = Array.from({ length: 3 + (i % 3) }).map((__, idx) => sampleImages[(i + idx) % sampleImages.length]);
    return { ...basePost, images: albumImages };
  }

  return basePost;
});

export const getUser = (id: string) => feedUsers.find(u => u.id === id)!;
