import type { IconRegistry } from '../types';

// Essential action icons
export const actionIcons: IconRegistry = {
  plus: {
    content: 'M12 5v14m-7-7h14',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Plus symbol used for create or add actions.',
  },
  bolt: {
    content: 'M13 2L3 14h7v8l11-13h-7l1-9z',
    viewBox: '0 0 24 24',
    variant: 'filled' as const,
    description: 'Lightning bolt indicating quick actions, performance, or energy.',
  },
  funnel: {
    content: 'M3 4a1 1 0 0 1 1-1h16a1 1 0 0 1 .707 1.707L15 10.414V17a1 1 0 0 1-.553.894l-4 2A1 1 0 0 1 9 19v-8.586L3.293 4.707A1 1 0 0 1 3 4Z',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Funnel icon for filter panels or narrowing result sets.',
  },
  phone: {
    content: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Classic handset to represent phone contact or call actions.',
  },
  email: {
    content: 'm4 4 16 0c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Envelope glyph for email, messaging, or contact output.',
  },
  toggle:{
    content:  'M7 6h10a6 6 0 1 1 0 12H7a6 6 0 1 1 0-12Zm10 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Toggle switch showing an active state with the knob on the right.',
  },
  toggleOff: {
    content:    'M7 6h10a6 6 0 0 1 0 12H7a6 6 0 0 1 0-12z M7 7a5 5 0 1 1 0 10a5 5 0 1 1 0-10',
   viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Toggle track illustrating the off position with the knob on the left.',
  },
  toggleOn: {
    content:      'M7 6h10a6 6 0 0 1 0 12H7a6 6 0 0 1 0-12z M17 7a5 5 0 1 1 0 10a5 5 0 1 1 0-10',
   viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Toggle track illustrating the on position with the knob on the right.',
  },
  
  qrcode: {
    content: 'M3 3h6v6H3V3zm2 2v2h2V5H5zM3 15h6v6H3v-6zm2 2v2h2v-2H5zM15 3h6v6h-6V3zm2 2v2h2V5h-2zM13 13h2v2h-2v-2zM15 15h2v2h-2v-2zM17 13h2v2h-2v-2zM19 15h2v2h-2v-2zM13 17h2v2h-2v-2zM15 19h2v2h-2v-2zM17 17h2v2h-2v-2zM19 19h2v2h-2v-2z',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'QR code grid useful for scanning or linking to external content.',
  },
  location: {
    content: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Map pin marker indicating a specific location or address.',
  },
  spotlight: {
    content: 'M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5a3 3 0 11-6 0 3 3 0 016 0z',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Magnifying glass and highlight circle to represent spotlight search.',
  },
  minus: {
    content: 'M5 12h14',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Minus glyph for remove, collapse, or subtract actions.',
  },
  x: {
    content: 'm18 6-12 12M6 6l12 12',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Diagonal cross used for dismissal or closing elements.',
  },
  // Alias commonly used name 'close' -> same glyph as 'x'
  close: {
    content: 'm18 6-12 12M6 6l12 12',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Alias for the close icon; identical to the x glyph.',
  },
  check: {
    content: 'M20 6 9 17l-5-5',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Checkmark for confirmation, success, or selection.',
  },
  search: {
    content: 'm21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Search magnifier indicating find or lookup functionality.',
  },
  menu: {
    content: 'M3 6h18M3 12h18M3 18h18',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Hamburger menu with three horizontal bars.',
  },
  settings: {
    content: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Gear wheel for settings, configuration, or preferences.',
  },
  edit: {
    content: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7m-1.5-9.5a2.5 2.5 0 1 1 3.54 3.54L12 18l-4 1 1-4Z',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Pencil editing icon for modify, rename, or compose actions.',
  },
  delete: {
    content: 'M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m-6 5v6m4-6v6',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Trash can outline for delete or remove operations.',
  },
  copy: {
    content: 'M8 4v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7.242a2 2 0 0 0-.602-1.43L16.083 2.57A2 2 0 0 0 14.685 2H10a2 2 0 0 0-2 2Zm0 0a2 2 0 0 1-2 2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Stacked documents indicating duplicate or copy to clipboard.',
  },
  download: {
    // Clean download: vertical arrow into a tray line
    content: 'M12 3v12 M8 11l4 4 4-4 M4 21h16',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Arrow descending into a tray for download or save locally.',
  },
  upload: {
    // Clean upload: vertical up arrow from a tray line
    content: 'M12 21v-12 M8 13l4-4 4 4 M4 21h16',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Arrow rising from a tray for upload or submit actions.',
  },
  refresh: {
    content: 'M1 4v6h6m16 6v-6h-6M4 20a16 16 0 0 1 16-16M20 4a16 16 0 0 1-16 16',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Refresh arrows indicating reload or sync.',
  },
  bell: {
    content: 'M6 8A6 6 0 0 1 18 8c0 7 3 9 3 9H3s3-2 3-9Zm4.3 13a1.94 1.94 0 0 0 3.4 0',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Notification bell for alerts and reminders.',
  },
  lock: {
    content: 'M12 1a3 3 0 0 0-3 3v4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2V4a3 3 0 0 0-3-3ZM10 4a2 2 0 1 1 4 0v4h-4V4Z',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Padlock symbol for secure content or authentication.',
  },
  trash: {
    content: 'M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m-6 5v6m4-6v6',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Metal trash can for delete or remove operations.',
  },
  times: {
    content: 'M6 18L18 6M6 6l12 12',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Another alias for the close icon drawn as a diagonal cross.',
  },
  play: {
    content: 'M8 5v14l11-7L8 5z',
    viewBox: '0 0 24 24',
    variant: 'filled' as const,
    description: 'Play button triangle for media playback.',
  },
  pause: {
    content: 'M6 4h4v16H6V4zm8 0h4v16h-4V4z',
    viewBox: '0 0 24 24',
    variant: 'filled' as const,
    description: 'Pause icon with two vertical bars for media controls.',
  },
  stop: {
    content: 'M6 6h12v12H6V6z',
    viewBox: '0 0 24 24',
    variant: 'filled' as const,
    description: 'Solid square stop button for halting playback.',
  },
  calendar: {
    content: 'M8 2v3m8-3v3M5 9h14M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Calendar page with binding bars for scheduling or events.',
  },
  share: {
    // Three-node share: circles connected by two links
    content: 'M8 12L16 6 M8 12L16 18 M6 12 m -2 0 a 2 2 0 1 0 4 0 a 2 2 0 1 0 -4 0 M18 6 m -2 0 a 2 2 0 1 0 4 0 a 2 2 0 1 0 -4 0 M18 18 m -2 0 a 2 2 0 1 0 4 0 a 2 2 0 1 0 -4 0',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Share nodes connected by lines, suitable for share sheets.',
  },
  bookmark: {
    content: 'm19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Bookmark ribbon to mark favorites or saved items.',
  },
  camera: {
    content: 'M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3zM12 17a5 5 0 1 1 0-10 5 5 0 0 1 0 10z',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Camera body icon for media capture or photography.',
  },
  mail: {
    content: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm16 4-8 5-8-5',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Envelope mail glyph for messaging or inbox features.',
  },
  cog: {
    content: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Alternate gear cog for system-level controls or utilities.',
  },
  chat: {
    content: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Speech bubble representing chat, messaging, or comments.',
  },
  code: {
    content: 'm16 18 6-6-6-6M8 6l-6 6 6 6',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Angle brackets for code snippets or developer tooling.',
  },
  link: {
    content: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71m-4.24 4.24a5 5 0 0 0 7.07 7.07l1.72-1.71m-4.24-4.24L9 12l2.83-2.83',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Interlocking chain links for linking or attachments.',
  },
  form: {
    content: 'M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm2 4h6v2H9V6Zm0 4h6v2H9v-2Zm0 4h4v2H9v-2Zm-2 4h10v2H7v-2Z',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Form document with stacked fields to represent inputs or paperwork.',
  },
  contrast: {
    content: 'M12 3a9 9 0 0 0 0 18V3Zm0 0a9 9 0 1 1 0 18 9 9 0 0 1 0-18Z',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    preserveStrokeOnFill: true,
    description: 'Half-shaded circle for contrast or dark mode toggles.',
  },
  // Additional app icons
  record: {
    content: 'M12 6a6 6 0 1 1 0 12 6 6 0 0 1 0-12z',
    viewBox: '0 0 24 24',
    variant: 'filled' as const,
    description: 'Solid recording dot for capture or live status.',
  },
  paper: {
    // paper-plane (send)
    content: 'M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Paper plane symbolizing send or share.',
  },
  flag: {
    content: 'M4 3v18M4 3h10l-1 3h7v8h-9l-1 3H4',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Waving flag marker for reports, goals, or highlights.',
  },
  cart: {
    content: 'M6 6H4l2 12h12l2-8H7M6 6l1-3h4m5 19a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-9 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Shopping cart with wheels for commerce and checkout flows.',
  },
  shop: {
    // Storefront with marquee awning and centered doorway
    content: 'M4 4h16l1 6H3l1-6ZM5 12h14v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-8Zm5 0v8h4v-8Z',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Retail storefront for shopping hubs, marketplaces, or stores.',
  },
  repeat: {
    content: 'M17 1l4 4-4 4M3 11a6 6 0 0 1 6-6h12M7 23l-4-4 4-4m14-2a6 6 0 0 1-6 6H1',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Bidirectional arrows indicating repeat or replay.',
  },
  rotate: {
    content: 'M12 2v4m0 12v4m8-8h4M0 12h4M5.64 5.64 8.46 8.46M15.54 15.54l2.82 2.82M15.54 8.46l2.82-2.82M5.64 18.36l2.82-2.82',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Arrows on a compass rose for rotate or orientation change.',
  },
  volumeOff: {
    content: 'M3 10v4h4l5 4V6L7 10H3zm12-4l6 12M21 6l-6 12',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Speaker with strike-through showing muted audio.',
  },
  pin: {
    content: 'M3 3h7v7H3V3zm0 11h7v7H3v-7zM14 3h7v7h-7V3zm0 11h7v7h-7v-7z',
    viewBox: '0 0 24 24',
    variant: 'outlined' as const,
    description: 'Grid of squares used to pin or arrange applications.',
  },
};