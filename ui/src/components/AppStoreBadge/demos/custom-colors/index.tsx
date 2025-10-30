import React from 'react';
import { View } from 'react-native';
import { AppStoreBadge, Block } from '@platform-blocks/ui';

export default function CustomColors() {
  return (
    <Block direction="row" gap={12} wrap>
      <AppStoreBadge
        brand="github"
        primaryText="View on"
        secondaryText="GitHub"
        backgroundColor="#24292e"
        textColor="#ffffff"
        onPress={() => console.log('GitHub dark pressed')}
      />
      
      <AppStoreBadge
        brand="github"
        primaryText="View on"
        secondaryText="GitHub"
        backgroundColor="#ffffff"
        textColor="#24292e"
        borderColor="#24292e"
        onPress={() => console.log('GitHub light pressed')}
      />
      
      <AppStoreBadge
        brand="spotify"
        primaryText="Listen on"
        secondaryText="Spotify"
        backgroundColor="#191414"
        textColor="#1DB954"
        borderColor="#1DB954"
        onPress={() => console.log('Spotify custom pressed')}
      />
    </Block>
  );
}