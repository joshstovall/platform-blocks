// Example usage of AppStoreBadge component
import React from 'react';
import { View, Linking, Alert } from 'react-native';
import {
  AppStoreBadge,
  AppStoreDownloadBadge,
  GooglePlayDownloadBadge,
  SpotifyListenBadge,
  GitHubViewBadge,
  DiscordJoinBadge,
} from '@platform-blocks/ui';

export function AppPromotionExample() {
  const handleAppStorePress = async () => {
    try {
      await Linking.openURL('https://apps.apple.com/app/your-app-id');
    } catch (error) {
      Alert.alert('Error', 'Cannot open App Store');
    }
  };

  const handleGooglePlayPress = async () => {
    try {
      await Linking.openURL('https://play.google.com/store/apps/details?id=your.package.name');
    } catch (error) {
      Alert.alert('Error', 'Cannot open Google Play');
    }
  };

  return (
    <View style={{ padding: 20, gap: 16 }}>
      {/* Basic Usage */}
      <AppStoreBadge
        brand="apple"
        primaryText="Download on the"
        secondaryText="App Store"
        onPress={handleAppStorePress}
      />

      {/* Convenience Components */}
      <AppStoreDownloadBadge onPress={handleAppStorePress} />
      <GooglePlayDownloadBadge onPress={handleGooglePlayPress} />

      {/* Music/Entertainment Platforms */}
      <SpotifyListenBadge
        size="lg"
        onPress={() => Linking.openURL('https://open.spotify.com/artist/your-artist')}
      />

      {/* Developer/Community Links */}
      <GitHubViewBadge
        onPress={() => Linking.openURL('https://github.com/your-username/your-repo')}
      />
      
      <DiscordJoinBadge
        onPress={() => Linking.openURL('https://discord.gg/your-invite')}
      />

      {/* Custom Brand Badge */}
      <AppStoreBadge
        brand="youtube"
        primaryText="Watch on"
        secondaryText="YouTube"
        backgroundColor="#FF0000"
        size="xl"
        onPress={() => Linking.openURL('https://youtube.com/c/your-channel')}
      />

      {/* Dark Mode Example */}
      <AppStoreBadge
        brand="github"
        primaryText="Contribute on"
        secondaryText="GitHub"
        darkMode={true}
        borderColor="#30363d"
        backgroundColor="#0d1117"
        textColor="#f0f6fc"
        onPress={() => Linking.openURL('https://github.com/your-org/your-project')}
      />
    </View>
  );
}

// Landing page footer example
export function LandingPageFooter() {
  return (
    <View style={{ 
      flexDirection: 'row', 
      justifyContent: 'center', 
      gap: 12, 
      flexWrap: 'wrap',
      padding: 20 
    }}>
      <AppStoreDownloadBadge 
        size="md"
        onPress={() => Linking.openURL('https://apps.apple.com/app/your-app')}
      />
      <GooglePlayDownloadBadge 
        size="md"
        onPress={() => Linking.openURL('https://play.google.com/store/apps/details?id=your.app')}
      />
    </View>
  );
}

// Music artist promotion example
export function MusicArtistPromotion() {
  const artistSpotifyUrl = 'https://open.spotify.com/artist/your-artist-id';
  const artistAppleMusicUrl = 'https://music.apple.com/artist/your-artist-id';
  const artistYouTubeUrl = 'https://youtube.com/c/your-channel';

  return (
    <View style={{ alignItems: 'center', gap: 12, padding: 20 }}>
      <SpotifyListenBadge 
        onPress={() => Linking.openURL(artistSpotifyUrl)}
      />
      
      <AppStoreBadge
        brand="appleMusic"
        primaryText="Listen on"
        secondaryText="Apple Music"
        onPress={() => Linking.openURL(artistAppleMusicUrl)}
      />
      
      <AppStoreBadge
        brand="youtube"
        primaryText="Subscribe on"
        secondaryText="YouTube"
        backgroundColor="#FF0000"
        onPress={() => Linking.openURL(artistYouTubeUrl)}
      />
    </View>
  );
}