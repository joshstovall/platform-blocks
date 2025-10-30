import React from 'react';
import {
  AppStoreDownloadBadge,
  GalaxyStoreDownloadBadge,
  GooglePlayDownloadBadge,
  HuaweiAppGalleryBadge,
  AmazonAppstoreBadge,
  SpotifyListenBadge,
  ApplePodcastsListenBadge,
  YouTubeWatchBadge,
  AppleMusicListenBadge,
  AmazonMusicListenBadge,
  SoundCloudListenBadge,
  TwitchWatchBadge,
  GitHubViewBadge,
  DiscordJoinBadge,
  Block,
  MicrosoftStoreDownloadBadge,
  AmazonPrimeVideoBadge,
  AmazonStoreBadge,
  ChromeWebStoreBadge,
} from '@platform-blocks/ui';

export default function Demo() {
  return (
    <Block direction="row" gap={12} wrap justify="center" align="center">
      <AppStoreDownloadBadge onPress={() => console.log('App Store pressed')} />
      <GalaxyStoreDownloadBadge onPress={() => console.log('Galaxy Store pressed')} />
      <GooglePlayDownloadBadge onPress={() => console.log('Google Play pressed')} />
      <HuaweiAppGalleryBadge onPress={() => console.log('AppGallery pressed')} />
      <AmazonAppstoreBadge onPress={() => console.log('Amazon Appstore pressed')} />
      <SpotifyListenBadge onPress={() => console.log('Spotify pressed')} />
      <ApplePodcastsListenBadge onPress={() => console.log('Apple Podcasts pressed')} />
      <YouTubeWatchBadge onPress={() => console.log('YouTube pressed')} />
      <AppleMusicListenBadge onPress={() => console.log('Apple Music pressed')} />
      <AmazonMusicListenBadge onPress={() => console.log('Amazon Music pressed')} />
      <SoundCloudListenBadge onPress={() => console.log('SoundCloud pressed')} />
      <TwitchWatchBadge onPress={() => console.log('Twitch pressed')} />
      <GitHubViewBadge onPress={() => console.log('GitHub pressed')} />
      <DiscordJoinBadge onPress={() => console.log('Discord pressed')} />
      <MicrosoftStoreDownloadBadge onPress={() => console.log('Microsoft Store pressed')} />
      <AmazonPrimeVideoBadge onPress={() => console.log('Amazon Prime Video pressed')} />
      <AmazonStoreBadge onPress={() => console.log('Amazon Store pressed')} />
      <ChromeWebStoreBadge onPress={() => console.log('Chrome Web Store pressed')} />
    </Block>
  );
}