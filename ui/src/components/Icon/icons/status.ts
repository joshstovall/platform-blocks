import type { IconRegistry } from '../types';

// Status and feedback icons
export const statusIcons: IconRegistry = {
  info: {
    content: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20ZM12 9v4m0 4v.01',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Circled information symbol for tips or contextual help.',
  },
  warning: {
    content: 'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0ZM12 9v4m0 4v.01',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Triangular warning sign with exclamation mark.',
  },
  error: {
    content: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20ZM15 9l-6 6m0-6l6 6',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Circle with an x mark signaling errors or critical issues.',
  },
  success: {
    content: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9Z',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Circle with checkmark denoting success or completion.',
  },
  loading: {
    content: 'M21 12a9 9 0 1 1-6.219-8.56',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Partial spinner arc for loading or in-progress states.',
  },
  'volume-up': {
    content: 'M11 5.882v12.236a1 1 0 0 0 1.514.858l5.464-3.618a1 1 0 0 0 0-1.716l-5.464-3.618a1 1 0 0 0-1.514.858ZM7 8.118v7.764a1 1 0 0 1-1.514.858l-3.464-2.294a1 1 0 0 1 0-1.716l3.464-2.294a1 1 0 0 1 1.514.858Z',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Speaker with sound waves for high-volume status.',
  },
  'volume-off': {
    content: 'M9.516 5.106A1 1 0 0 1 11 6.118v11.764a1 1 0 0 1-1.484.912L4.618 15.5H2a1 1 0 0 1-1-1V9.5a1 1 0 0 1 1-1h2.618l4.898-3.394a1 1 0 0 1 .001-.001ZM22.707 21.293l-18-18a1 1 0 0 0-1.414 1.414l18 18a1 1 0 0 0 1.414-1.414Z',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Mute icon combining a speaker and strike-through line.',
  },
  expand: {
    content: 'M4 10v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6M8 14l4-4m0 0l4 4m-4-4v10',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Arrows pointing outward to indicate expand or maximize.',
  },
  compress: {
    content: 'M20 14V8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6m16 0l-4-4m0 0l-4 4m4-4v10',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Arrows drawing inward to represent collapse or minimize.',
  },
  exclamation: {
    content: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Alert triangle with exclamation point for high severity.',
  },
  bell: {
    content: 'M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Bell silhouette for notifications or alerts.',
  },
  bone: {
    content: 'M8 12h8 M6 12 m -2 0 a 2 2 0 1 0 4 0 a 2 2 0 1 0 -4 0 M18 12 m -2 0 a 2 2 0 1 0 4 0 a 2 2 0 1 0 -4 0',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Cartoon bone for health, pets, or veterinary contexts.',
  },
  toast: {
    content: 'M6 8c0-2 2-4 6-4s6 2 6 4v10c0 1-1 2-2 2H8c-1 0-2-1-2-2V8z',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Rounded toast shape for warm notifications or snacks.',
  },
};