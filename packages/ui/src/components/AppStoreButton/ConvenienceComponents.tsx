import React from 'react';
import { AppStoreButton } from './AppStoreButton';
import type { AppStoreButtonProps } from './types';

// Convenience components for common app stores

export const GooglePlayButton: React.FC<Omit<AppStoreButtonProps, 'store'>> = (props) => (
  <AppStoreButton {...props} store="google-play" />
);

export const AppleAppStoreButton: React.FC<Omit<AppStoreButtonProps, 'store'>> = (props) => (
  <AppStoreButton {...props} store="app-store" />
);

export const MacAppStoreButton: React.FC<Omit<AppStoreButtonProps, 'store'>> = (props) => (
  <AppStoreButton {...props} store="mac-app-store" />
);

export const MicrosoftStoreButton: React.FC<Omit<AppStoreButtonProps, 'store'>> = (props) => (
  <AppStoreButton {...props} store="microsoft-store" />
);

export const AmazonAppstoreButton: React.FC<Omit<AppStoreButtonProps, 'store'>> = (props) => (
  <AppStoreButton {...props} store="amazon-appstore" />
);

export const FDroidButton: React.FC<Omit<AppStoreButtonProps, 'store'>> = (props) => (
  <AppStoreButton {...props} store="f-droid" />
);

// Convenience components with proper display names
GooglePlayButton.displayName = 'GooglePlayButton';
AppleAppStoreButton.displayName = 'AppleAppStoreButton';
MacAppStoreButton.displayName = 'MacAppStoreButton';
MicrosoftStoreButton.displayName = 'MicrosoftStoreButton';
AmazonAppstoreButton.displayName = 'AmazonAppstoreButton';
FDroidButton.displayName = 'FDroidButton';