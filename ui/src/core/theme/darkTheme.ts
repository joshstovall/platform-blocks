import { PlatformBlocksTheme } from './types';

export const DARK_THEME: PlatformBlocksTheme = {
  primaryColor: '#0A84FF',
  colorScheme: 'dark',

  colors: {
    primary: [
      '#001A33',
      '#003366',
      '#004D99',
      '#0066CC',
      '#0080FF',
      '#0A84FF', // Base color (brighter for dark mode)
      '#3399FF',
      '#66B7FF',
      '#99CFFF',
      '#CCE7FF'
    ],
    secondary: [
      '#1C1C1E',
      '#2C2C2E',
      '#3A3A3C',
      '#48484A',
      '#636366',
      '#8E8E93',
      '#AEAEB2',
      '#C7C7CC',
      '#D1D1D6',
      '#E5E5EA'
    ],
    tertiary: [
      '#0B1A26',
      '#16334D',
      '#204D73',
      '#2B6699',
      '#357FFF',
      '#5E9CFF',
      '#85B3FF',
      '#ADD0FF',
      '#D4E6FF',
      '#EBF3FF'
    ],
    surface: [
      '#1C1C1E',
      '#2C2C2E',
      '#3A3A3C',
      '#48484A',
      '#636366',
      '#8E8E93',
      '#AEAEB2',
      '#C7C7CC',
      '#D1D1D6',
      '#E5E5EA'
    ],
    success: [
      '#0D2818',
      '#1A4F30',
      '#267648',
      '#329D60',
      '#3EC478',
      '#30D158', // Apple's green for dark mode
      '#5DD87A',
      '#8ADF9C',
      '#B7E6BE',
      '#E4F3E0'
    ],
    warning: [
      '#332500',
      '#664A00',
      '#996E00',
      '#CC9300',
      '#FFB800',
      '#FF9F0A', // Apple's orange for dark mode
      '#FFB340',
      '#FFC266',
      '#FFD199',
      '#FFE0CC'
    ],
    error: [
      '#330B0A',
      '#661713',
      '#99231D',
      '#CC2F26',
      '#FF3333',
      '#FF453A', // Apple's red for dark mode
      '#FF6B60',
      '#FF9186',
      '#FFB7AC',
      '#FFDDD2'
    ],
    gray: [
      '#000000',
      '#1C1C1E',
      '#2C2C2E',
      '#3A3A3C',
      '#48484A',
      '#636366',
      '#8E8E93',
      '#AEAEB2',
      '#C7C7CC',
      '#F2F2F7'
    ],
    highlight: [
      '#2A2313',
      '#3D3320',
      '#4F422D',
      '#61523A',
      '#736247',
      '#FBBF24', // Keep same base as light mode for consistency
      '#FCD34D',
      '#FDE68A',
      '#FEF3C7',
      '#FFFBEB'
    ],
    pink: [
      '#831843', '#9D174D', '#BE185D', '#DB2777', '#EC4899',
      '#F472B6', '#F9A8D4', '#FBCFE8', '#FCE7F3', '#FDF2F8'
    ],
    purple: [
      '#581C87', '#6B21A8', '#7E22CE', '#9333EA', '#A855F7',
      '#C084FC', '#D8B4FE', '#E9D5FF', '#F3E8FF', '#FAF5FF'
    ],
    violet: [
      '#4C1D95', '#5B21B6', '#6D28D9', '#7C3AED', '#8B5CF6',
      '#A78BFA', '#C4B5FD', '#DDD6FE', '#EDE9FE', '#F5F3FF'
    ],
    cyan: [
      '#164E63', '#155E75', '#0E7490', '#0891B2', '#06B6D4',
      '#22D3EE', '#67E8F9', '#A5F3FC', '#CFFAFE', '#ECFEFF'
    ],
    lime: [
      '#365314', '#3F6212', '#4D7C0F', '#65A30D', '#84CC16',
      '#A3E635', '#BEF264', '#D9F99D', '#ECFCCB', '#F7FEE7'
    ],
    sky: [
      '#0C4A6E', '#075985', '#0369A1', '#0284C7', '#0EA5E9',
      '#38BDF8', '#7DD3FC', '#BAE6FD', '#E0F2FE', '#F0F9FF'
    ],
    amber: [
      '#78350F', '#92400E', '#B45309', '#D97706', '#F59E0B',
      '#FBBF24', '#FCD34D', '#FDE68A', '#FEF3C7', '#FFFBEB'
    ],
    indigo: [
      '#312E81', '#3730A3', '#4338CA', '#4F46E5', '#6366F1',
      '#818CF8', '#A5B4FC', '#C7D2FE', '#E0E7FF', '#EEF2FF'
    ],
    teal: [
      '#134E4A', '#0F766E', '#0D9488', '#14B8A6', '#2DD4BF',
      '#5EEAD4', '#99F6E4', '#CCFBF1', '#ECFEFF', '#F0FDFA'
    ]
  },

  text: {
    primary: '#F2F2F7',
    onPrimary: '#F2F2F7',
    secondary: '#AEAEB2',
    muted: '#8E8E93',
    disabled: '#636366',
    link: '#0A84FF'
  },

  backgrounds: {
    base: '#000000',
    subtle: '#121214',
    surface: '#1C1C1E',
    elevated: '#2C2C2E',
    border: '#2C2C2E'
  },

  states: {
    focusRing: 'rgba(10,132,255,0.55)',
    textSelection: 'rgba(251, 191, 36, 0.2)', // Slightly more subtle for dark mode
    highlightText: '#FDE68A', // highlight[7] for good contrast on dark
    highlightBackground: 'rgba(97, 82, 58, 0.8)' // Darker highlight[3] with more opacity
  },

  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',

  fontSizes: {
    xs: '10px',
    sm: '12px',
    md: '14px',
    lg: '16px',
    xl: '18px',
    '2xl': '20px',
    '3xl': '24px'
  },

  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '32px'
  },

  radii: {
    xs: '2px',
    sm: '4px',
    md: '6px',
    lg: '8px',
    xl: '12px',
    '2xl': '16px',
    '3xl': '20px'
  },

  shadows: {
    xs: '0 1px 3px rgba(0, 0, 0, 0.3)',
    sm: '0 1px 3px rgba(0, 0, 0, 0.4), 0 1px 2px rgba(0, 0, 0, 0.5)',
    md: '0 3px 6px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3)',
    lg: '0 10px 20px rgba(0, 0, 0, 0.4), 0 3px 6px rgba(0, 0, 0, 0.2)',
    xl: '0 15px 25px rgba(0, 0, 0, 0.4), 0 5px 10px rgba(0, 0, 0, 0.1)'
  },

  breakpoints: {
    xs: '480px',
    sm: '768px',
    md: '1024px',
    lg: '1280px',
    xl: '1536px'
  },

  motion: {
    easing: {
      ease: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      easeIn: 'cubic-bezier(0.42, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.58, 1)',
      easeInOut: 'cubic-bezier(0.42, 0, 0.58, 1)',
      spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
    },
    duration: {
      instant: '0ms',
      fast: '150ms',
      normal: '250ms',
      slow: '400ms'
    }
  },

  semantic: {
    accent: '#0A84FF', // primary[5] adjusted for dark mode
    borderDefault: '#3A3A3C', // surface[2]
    borderSubtle: '#2C2C2E', // surface[1] 
    surfaceElevated: '#2C2C2E', // surface[1]
    surfaceCard: '#1C1C1E', // surface[0]
    focusRing: '#0A84FF' // primary[5]
  },

  components: {},
  other: {
    zIndices: {
      header: 900,
      navbar: 800,
      footer: 500,
      overlay: 1300,
      drawer: 1200,
      skipLink: 2000
    },
    elevations: {
      header: '0 1px 2px rgba(0,0,0,0.5)',
      navbar: '0 0 0 1px rgba(255,255,255,0.08)',
      surface: '0 1px 3px rgba(0,0,0,0.6)',
      floating: '0 4px 12px rgba(0,0,0,0.7)'
    }
  }
};
