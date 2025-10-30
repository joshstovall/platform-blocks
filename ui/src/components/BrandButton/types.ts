import { ButtonProps } from '../Button';
import { UniversalSystemProps } from '../../core/utils/universalSimple';

export type BrandPlatform = 
  | 'google' 
  | 'facebook' 
  | 'discord' 
  | 'apple' 
  | 'android'
  | 'app-store'
  | 'chrome'
  | 'spotify'
  | 'github'
  | 'x'
  | 'microsoft'
  | 'linkedin'
  | 'slack'
  | 'youtube'
  | 'twitter' 
  | 'instagram'
  | 'npm'
  | 'twitch'
  | 'reddit'
  | 'amazon';

export interface BrandButtonProps extends Omit<ButtonProps, 'startIcon' | 'endIcon' | 'color' | 'lightHidden' | 'darkHidden' | 'hiddenFrom' | 'visibleFrom'>, UniversalSystemProps {
  /** The brand/platform to style the button for */
  brand: BrandPlatform;
  /** Position of the brand icon */
  iconPosition?: 'left' | 'right';
  /** Icon variant: 'full' for multi-color, 'mono' for single-color outline */
  iconVariant?: 'full' | 'mono';
  /** Override the default brand icon */
  icon?: React.ReactNode;
  /** Button text */
  title: string;
  /** Override icon color (overrides brand default colors) */
  color?: string;
}

// Brand configurations
export const brandConfigs: Record<BrandPlatform, {
  icon: string;
  backgroundColor: string;
  textColor: string;
  borderColor?: string;
}> = {
  google: {
    icon: 'google',
    backgroundColor: '#4285F4',
    textColor: '#FFFFFF',
  },
  apple: {
    icon: 'apple', // Will use as placeholder, should be apple icon
    backgroundColor: '#000000',
    textColor: '#FFFFFF',
  },
  android: {
    icon: 'android',
    backgroundColor: '#3DDC84',
    textColor: '#FFFFFF',
  },
  'app-store': {
    icon: 'app-store',
    backgroundColor: '#0D96F6',
    textColor: '#FFFFFF',
  },
  chrome: {
    icon: 'chrome',
    backgroundColor: '#4285F4',
    textColor: '#FFFFFF',
  },
  facebook: {
    icon: 'facebook',
    backgroundColor: '#1877F2',
    textColor: '#FFFFFF',
  },
  twitter: {
    icon: 'twitter',
    backgroundColor: '#1DA1F2',
    textColor: '#FFFFFF',
  },
  x: {
    icon: 'x',
    backgroundColor: '#000000',
    textColor: '#FFFFFF',
  },
  github: {
    icon: 'github',
    backgroundColor: '#181717',
    textColor: '#FFFFFF',
  },
  microsoft: {
    icon: 'microsoft',
    backgroundColor: '#0078D4',
    textColor: '#FFFFFF',
  },
  linkedin: {
    icon: 'linkedin',
    backgroundColor: '#0A66C2',
    textColor: '#FFFFFF',
  },
  discord: {
    icon: 'discord',
    backgroundColor: '#5865F2',
    textColor: '#FFFFFF',
  },
  slack: {
    icon: 'chat',
    backgroundColor: '#4A154B',
    textColor: '#FFFFFF',
  },
  spotify: {
    icon: 'spotify',
    backgroundColor: '#1DB954',
    textColor: '#FFFFFF',
  },
  youtube: {
    icon: 'youtube',
    backgroundColor: '#FF0000',
    textColor: '#FFFFFF',
  },
  instagram: {
    icon: 'instagram',
    backgroundColor: '#E4405F',
    textColor: '#FFFFFF',
  },
  npm: {
    icon: 'npm',
    backgroundColor: '#CB3837',
    textColor: '#FFFFFF',
  },
  twitch: {
    icon: 'twitch',
    backgroundColor: '#9146FF',
    textColor: '#FFFFFF',
  },
  reddit: {
    icon: 'reddit',
    backgroundColor: '#FF5700',
    textColor: '#FFFFFF',
  },
  amazon: {
    icon: 'amazon',
    backgroundColor: '#000000',
    textColor: '#FFFFFF',
    borderColor: '#000000',
  },
};
