import { PressableProps } from 'react-native';

export type AppStoreType = 
  | 'app-store'
  | 'google-play' 
  | 'microsoft-store'
  | 'amazon-appstore'
  | 'mac-app-store'
  | 'f-droid';

export type AppStoreButtonSize = 'sm' | 'md' | 'lg' | 'xl';

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

export interface AppStoreButtonProps extends Omit<PressableProps, 'style' | 'children'> {
  /** The app store type */
  store: AppStoreType;
  
  /** Button size */
  size?: AppStoreButtonSize;
  
  /** Locale for button text */
  locale?: SupportedLocale;
  
  /** Custom styles */
  style?: any;
  
  /** Press handler */
  onPress?: () => void;
  
  /** Whether button is disabled */
  disabled?: boolean;
  
  /** Test ID for testing */
  testID?: string;
}

export interface StoreConfig {
  backgroundColor: string;
  textColor: string;
  iconName: string;
  primaryText: Record<SupportedLocale, string>;
  secondaryText: Record<SupportedLocale, string>;
}

export interface SizeConfig {
  height: number;
  paddingHorizontal: number;
  paddingVertical: number;
  iconSize: number;
  primaryFontSize: number;
  secondaryFontSize: number;
  borderRadius: number;
}