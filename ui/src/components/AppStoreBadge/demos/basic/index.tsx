import React from 'react';
import { AppStoreBadge, Column, Row } from '@platform-blocks/ui';

export default function BasicUsage() {
  return (
    <Row gap="md" wrap="wrap" justify="center" align="center">
      <AppStoreBadge
        brand="app-store"
        primaryText="Download on the"
        secondaryText="App Store"
        onPress={() => console.log('App Store pressed')}
      />
      
      <AppStoreBadge
        brand="google"
        primaryText="Get it on"
        secondaryText="Google Play"
        onPress={() => console.log('Google Play pressed')}
      />
      
      <AppStoreBadge
        brand="spotify"
        primaryText="Listen on"
        secondaryText="Spotify"
        // backgroundColor="#1DB954"
        onPress={() => console.log('Spotify pressed')}
      />
    </Row>
  );
}