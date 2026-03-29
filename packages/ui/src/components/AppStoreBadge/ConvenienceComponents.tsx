import React from 'react';
import { AppStoreBadge } from './AppStoreBadge';
import type { AppStoreBadgeProps } from './types';

type ConvenienceProps = Omit<AppStoreBadgeProps, 'brand' | 'primaryText' | 'secondaryText'>;

/**
 * App Store badge for iOS apps
 */
export const AppStoreDownloadBadge = (props: ConvenienceProps) => (
  <AppStoreBadge
    brand="app-store"
    primaryText="Download on the"
    secondaryText="App Store"
    {...props}
  />
);

/**
 * Samsung Galaxy Store badge
 */
export const GalaxyStoreDownloadBadge = (props: ConvenienceProps) => (
  <AppStoreBadge
    brand="galaxy-store"
    primaryText="Get it on"
    secondaryText="Galaxy Store"
    // backgroundColor="#6D4DFF"
    {...props}
  />
);

/**
 * Google Play badge for Android apps
 */
export const GooglePlayDownloadBadge = (props: ConvenienceProps) => (
  <AppStoreBadge
    brand="google"
    primaryText="Get it on"
    secondaryText="Google Play"
    {...props}
  />
);

/**
 * Huawei AppGallery badge
 */
export const HuaweiAppGalleryBadge = (props: ConvenienceProps) => (
  <AppStoreBadge
    brand="appgallery"
    primaryText="Explore it on"
    secondaryText="AppGallery"
    // backgroundColor="#D70010"
    {...props}
  />
);

/**
 * Amazon Appstore badge
 */
export const AmazonAppstoreBadge = (props: ConvenienceProps) => (
  <AppStoreBadge
    brand="amazonAppstore"
    primaryText="Get it from"
    secondaryText="Amazon Appstore"
    // backgroundColor="#0C65F5"
    {...props}
  />
);

/**
 * Microsoft Store badge
 */
export const MicrosoftStoreDownloadBadge = (props: ConvenienceProps) => (
  <AppStoreBadge
    brand="microsoft"
    primaryText="Get it from"
    secondaryText="Microsoft"
    // backgroundColor="#0078D4"
    {...props}
  />
);

/**
 * Spotify badge for music/podcast apps
 */
export const SpotifyListenBadge = (props: ConvenienceProps) => (
  <AppStoreBadge
    brand="spotify"
    primaryText="Listen on"
    secondaryText="Spotify"
    // backgroundColor="#1DB954"
    {...props}
  />
);

/**
 * Apple Podcasts badge
 */
export const ApplePodcastsListenBadge = (props: ConvenienceProps) => (
  <AppStoreBadge
    brand="applePodcasts"
    primaryText="Listen on"
    secondaryText="Apple Podcasts"
    // backgroundColor="#8A2EFF"
    {...props}
  />
);

/**
 * YouTube badge
 */
export const YouTubeWatchBadge = (props: ConvenienceProps) => (
  <AppStoreBadge
    brand="youtube"
    primaryText="Watch on"
    secondaryText="YouTube"
    // backgroundColor="#FF0000"
    {...props}
  />
);

/**
 * YouTube Music badge
 */
export const YouTubeMusicListenBadge = (props: ConvenienceProps) => (
  <AppStoreBadge
    brand="youtubeMusic"
    primaryText="Listen on"
    secondaryText="YouTube Music"
    // backgroundColor="#FF0000"
    {...props}
  />
);

/**
 * Apple Music badge
 */
export const AppleMusicListenBadge = (props: ConvenienceProps) => (
  <AppStoreBadge
    brand="appleMusic"
    primaryText="Listen on"
    secondaryText="Apple Music"
    {...props}
  />
);

/**
 * Amazon Music badge
 */
export const AmazonMusicListenBadge = (props: ConvenienceProps) => (
  <AppStoreBadge
    brand="amazonMusic"
    primaryText="Listen on"
    secondaryText="Amazon Music"
    // backgroundColor="#0C47D8"
    {...props}
  />
);

/**
 * SoundCloud badge
 */
export const SoundCloudListenBadge = (props: ConvenienceProps) => (
  <AppStoreBadge
    brand="soundcloud"
    primaryText="Listen on"
    secondaryText="SoundCloud"
    // backgroundColor="#FF5500"
    {...props}
  />
);

/**
 * Amazon shopping badge
 */
export const AmazonStoreBadge = (props: ConvenienceProps) => (
  <AppStoreBadge
    brand="amazon"
    primaryText="Shop on"
    secondaryText="Amazon"
    // backgroundColor="#FF9900"
    // textColor="#1A1A1A"
    {...props}
  />
);

/**
 * Amazon Prime Video badge
 */
export const AmazonPrimeVideoBadge = (props: ConvenienceProps) => (
  <AppStoreBadge
    brand="amazon"
    primaryText="Watch on"
    secondaryText="Prime Video"
    // backgroundColor="#00A8E1"
    {...props}
  />
);

/**
 * Twitch badge
 */
export const TwitchWatchBadge = (props: ConvenienceProps) => (
  <AppStoreBadge
    brand="twitch"
    primaryText="Watch on"
    secondaryText="Twitch"
    // backgroundColor="#9146FF"
    {...props}
  />
);

/**
 * GitHub badge for open source projects
 */
export const GitHubViewBadge = (props: ConvenienceProps) => (
  <AppStoreBadge
    brand="github"
    primaryText="View on"
    secondaryText="GitHub"
    // backgroundColor="#efefef"
    // textColor='#000'
    {...props}
  />
);

/**
 * Discord badge for community/chat apps
 */
export const DiscordJoinBadge = (props: ConvenienceProps) => (
  <AppStoreBadge
    brand="discord"
    primaryText="Join us on"
    secondaryText="Discord"
    // backgroundColor="#5865F2"
    {...props}
  />
);

/**
 * Reddit badge
 */
export const RedditJoinBadge = (props: ConvenienceProps) => (
  <AppStoreBadge
    brand="reddit"
    primaryText="Join us on"
    secondaryText="Reddit"
    backgroundColor="#FF4500"
    {...props}
  />
);

/**
 * TikTok badge
 */
export const TikTokWatchBadge = (props: ConvenienceProps) => (
  <AppStoreBadge
    brand="tiktok"
    primaryText="Watch on"
    secondaryText="TikTok"
    backgroundColor="#000000"
    {...props}
  />
);

/**
 * Chrome Web Store badge
 */
export const ChromeWebStoreBadge = (props: ConvenienceProps) => (
  <AppStoreBadge
    brand="chromeWebStore"
    primaryText="Available in the"
    secondaryText="Chrome Web Store"
    // backgroundColor="#5F6368"
    {...props}
  />
);