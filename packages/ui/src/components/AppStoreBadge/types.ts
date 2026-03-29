import { PressableProps } from 'react-native';
import type { BrandName } from '../BrandIcon';

export type AppStoreBadgeSize = 'sm' | 'md' | 'lg' | 'xl';

export type SupportedLocale = 
  | 'en' 
  | 'es' 
  | 'fr' 
  | 'de' 
  | 'it' 
  | 'pt' 
  | 'ru' 
  | 'ja' 
  | 'ko' 
  | 'zh';

export interface AppStoreBadgeProps extends Omit<PressableProps, 'style' | 'children'> {
  /** The brand/platform for the badge (uses BrandIcon) */
  brand: BrandName | 'galaxy-store' | 'amazonAppstore' | 'applePodcasts' | 'amazonMusic' | 'chromeWebStore';
  
  /** The primary text (e.g., "Download on the", "Listen on", "Watch on") */
  primaryText: string;
  
  /** The secondary text (e.g., "App Store", "Spotify", "Netflix") */
  secondaryText: string;
  
  /** Badge size */
  size?: AppStoreBadgeSize;
  
  /** Background color override */
  backgroundColor?: string;
  
  /** Text color override */
  textColor?: string;
  
  /** Border color override */
  borderColor?: string;
  
  /** Custom styles */
  style?: any;
  
  /** Press handler */
  onPress?: () => void;
  
  /** Whether badge is disabled */
  disabled?: boolean;
  
  /** Test ID for testing */
  testID?: string;
  
  /** Whether to use dark mode styling (auto-detected if not specified) */
  darkMode?: boolean;
}

export interface BadgeConfig {
  backgroundColor: string;
  textColor: string;
  borderColor?: string;
  brandColor?: string;
}