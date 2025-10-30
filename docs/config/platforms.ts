import type { BrandName } from '@platform-blocks/ui';

// Available brand icons (must match BrandName keys from the registry)
export const AVAILABLE_BRANDS: BrandName[] = [
  'google', 'facebook', 'discord', 'android', 'apple', 'app-store', 'chrome',
  'spotify', 'github', 'x', 'microsoft', 'linkedin', 'slack', 'youtube',
  'youtubeMusic', 'openai', 'reddit', 'amazon', 'twitch', 'mastercard', 'visa', 'tiktok',
  'paypal', 'appleMusic', 'whatsapp', 'telegram', 'signal', 'meta',
  'discover', 'amex', 'zoom',
];

// Tag configuration for better maintainability
export const TAG_CONFIG = {
  'Supported': { color: 'success', variant: 'filled' },
  'In Progress': { color: 'info', variant: 'subtle' },
  'Experimental': { color: 'warning', variant: 'subtle' },
  'Beta': { color: 'secondary', variant: 'subtle' },
  'Coming Soon': { color: 'gray', variant: 'outline' }
} as const;

export type TagType = keyof typeof TAG_CONFIG;

// Platform information with navigation
export const PLATFORMS = [
  {
    key: 'ios',
    label: 'iOS',
    brand: 'apple' as const,
    note: 'iOS 26+',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    route: '/platforms/ios',
    tags: ['Supported'] as TagType[]
  },
  {
    key: 'android',
    label: 'Android',
    brand: 'android' as const,
    note: 'API 36+',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    route: '/platforms/android',
    tags: ['Supported'] as TagType[]
  },
  {
    key: 'web',
    label: 'Web',
    brand: 'chrome' as const,
    note: 'Modern browsers',
    description: 'Progressive web apps with responsive design',
    route: '/platforms/web',
    tags: ['Supported'] as TagType[]
  },
];

// Helper function for rendering tag chips
export const getTagConfig = (tag: TagType) => TAG_CONFIG[tag];