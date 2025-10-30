import type { IconRegistry } from '../types';

// Multimedia and connectivity icons
export const multimediaIcons: IconRegistry = {
  sun: {
    content: 'M12 18C8.68629 18 6 15.3137 6 12C6 8.68629 8.68629 6 12 6C15.3137 6 18 8.68629 18 12C18 15.3137 15.3137 18 12 18ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16ZM11 1H13V4H11V1ZM11 20H13V23H11V20ZM3.51472 4.92893L4.92893 3.51472L7.05025 5.63604L5.63604 7.05025L3.51472 4.92893ZM16.9497 18.364L18.364 16.9497L20.4853 19.0711L19.0711 20.4853L16.9497 18.364ZM19.0711 3.51472L20.4853 4.92893L18.364 7.05025L16.9497 5.63604L19.0711 3.51472ZM5.63604 16.9497L7.05025 18.364L4.92893 20.4853L3.51472 19.0711L5.63604 16.9497ZM23 11V13H20V11H23ZM4 11V13H1V11H4Z',
    viewBox: '0 0 24 24',
    variant: 'filled' as const,
    description: 'Radiating sun icon for light mode or brightness.',
  },
  moon: {
    content: 'M10 7C10 10.866 13.134 14 17 14C18.9584 14 20.729 13.1957 21.9995 11.8995C22 11.933 22 11.9665 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C12.0335 2 12.067 2 12.1005 2.00049C10.8043 3.27098 10 5.04157 10 7ZM4 12C4 16.4183 7.58172 20 12 20C15.0583 20 17.7158 18.2839 19.062 15.7621C18.3945 15.9187 17.7035 16 17 16C12.0294 16 8 11.9706 8 7C8 6.29648 8.08133 5.60547 8.2379 4.938C5.71611 6.28423 4 8.9417 4 12Z',
    viewBox: '0 0 24 24',
    variant: 'filled' as const,
    description: 'Crescent moon for dark mode or nighttime themes.',
  },
  music: {
    content: 'M12 13.535V3H20V5H14V15C14 17.2091 12.2091 19 10 19C7.79086 19 6 17.2091 6 15C6 12.7909 7.79086 11 10 11C10.7286 11 11.4117 11.2028 12 11.535Z',
    viewBox: '0 0 24 24',
    variant: 'filled' as const,
    description: 'Musical note for audio content or playlists.',
  },
  'music-note': {
    content: 'M12 13.535V3H20V5H14V15C14 17.2091 12.2091 19 10 19C7.79086 19 6 17.2091 6 15C6 12.7909 7.79086 11 10 11C10.7286 11 11.4117 11.2028 12 11.535Z',
    viewBox: '0 0 24 24',
    variant: 'filled' as const,
    description: 'Alias for the music note glyph using kebab-case naming.',
  },
  microphone: {
    content: 'M12 1C13.6569 1 15 2.34315 15 4V12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12V4C9 2.34315 10.3431 1 12 1ZM12 3C11.4477 3 11 3.44772 11 4V12C11 12.5523 11.4477 13 12 13C12.5523 13 13 12.5523 13 12V4C13 3.44772 12.5523 3 12 3ZM3 11V12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12V11H19V12C19 15.866 15.866 19 12 19C8.13401 19 5 15.866 5 12V11H3ZM11 22H13V24H11V22Z',
    viewBox: '0 0 24 24',
    variant: 'filled' as const,
    description: 'Studio microphone for recording or voice input.',
  },
  headphones: {
    content: 'M4 12H6C7.10457 12 8 12.8954 8 14V18C8 19.1046 7.10457 20 6 20H4C2.89543 20 2 19.1046 2 18V14C2 12.8954 2.89543 12 4 12ZM4 14V18H6V14H4ZM20 12C21.1046 12 22 12.8954 22 14V18C22 19.1046 21.1046 20 20 20H18C16.8954 20 16 19.1046 16 18V14C16 12.8954 16.8954 12 18 12H20ZM20 14H18V18H20V14ZM12 2C16.4183 2 20 5.58172 20 10V12H18V10C18 6.68629 15.3137 4 12 4C8.68629 4 6 6.68629 6 10V12H4V10C4 5.58172 7.58172 2 12 2Z',
    viewBox: '0 0 24 24',
    variant: 'filled' as const,
    description: 'Headphones for listening experiences or audio output.',
  },
  bluetooth: {
    // Outlined Bluetooth rune with upper/lower lobes and cross-links
    // Upper lobe: 12,2 -> 18,8 -> 12,14
    // Lower lobe: 12,10 -> 18,16 -> 12,22
    // Cross links: 6,6 -> 12,12 and 6,18 -> 12,12
    content: 'M12 2 L18 8 L12 14 L12 2 M12 10 L18 16 L12 22 L12 10 M6 6 L12 12 M6 18 L12 12',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Bluetooth rune for wireless pairing or devices.',
  },
  wifi: {
    // Smooth, balanced arcs + center dot (dot via short round-capped segment)
    content: 'M3.2 10.2C7.3 6.4 16.7 6.4 20.8 10.2M5.8 13.1C9.2 10.1 14.8 10.1 18.2 13.1M8.6 16.0C10.4 14.6 13.6 14.6 15.4 16.0M12 19.0L12.01 19.0',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Wi-Fi signal strength arcs for network connectivity.',
  },
  piano: {
    // Piano keyboard: case, key bed, and key separators
    content: 'M3 5h18v14H3z M3 11h18 M7 11v8 M12 11v8 M17 11v8',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Piano keyboard for instrumentation or music apps.',
  },
  guitar: {
    // Acoustic guitar: body, sound hole, and simple diagonal neck/head
    content: 'M10 12 a5 5 0 1 0 0 10 a5 5 0 1 0 0 -10 M10 17 m -1 0 a 1 1 0 1 0 2 0 a 1 1 0 1 0 -2 0 M13 13l2-2 M15 11l7-7 M22 4 m -1 0 a 1 1 0 1 0 2 0 a 1 1 0 1 0 -2 0',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Acoustic guitar for live music or string instruments.',
  },
  camera: {
    content: 'M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2Z M17 13a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Camera with strap for photography or video capture.',
  },
  mic: {
    content: 'M12 1C13.6569 1 15 2.34315 15 4V12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12V4C9 2.34315 10.3431 1 12 1ZM12 3C11.4477 3 11 3.44772 11 4V12C11 12.5523 11.4477 13 12 13C12.5523 13 13 12.5523 13 12V4C13 3.44772 12.5523 3 12 3ZM3 11V12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12V11H19V12C19 15.866 15.866 19 12 19C8.13401 19 5 15.866 5 12V11H3ZM11 22H13V24H11V22Z',
    viewBox: '0 0 24 24',
    variant: 'filled' as const,
    description: 'Alternate mic glyph used for voice assistants or capture.',
  },
  // Tuning fork icon for tuner apps
  tuning: {
    content: 'M7 2v8M17 2v8M7 10a5 5 0 0 0 10 0M12 15v7M10 22h4',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Tuning fork for pitch reference or tuning tools.',
  },
};