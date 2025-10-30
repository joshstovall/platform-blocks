import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../core/theme';
import { Text } from '../Text';
import { Avatar } from '../Avatar';
import { Flex } from '../Flex';
import type { BlockquoteAuthorProps } from './types';

export function BlockquoteAuthor({
  author,
  alignment = 'left',
}: BlockquoteAuthorProps) {
  const theme = useTheme();

  const containerStyle = {
    flexDirection: alignment === 'center' ? 'column' as const : 'row' as const,
    alignItems: alignment === 'center' ? 'center' as const : 'flex-start' as const,
    gap: parseInt(theme.spacing.sm),
  };

  return (
    <Flex 
      direction={alignment === 'center' ? 'column' : 'row'} 
      align={alignment === 'center' ? 'center' : 'flex-start'}
      gap="sm"
    >
      {/* Avatar */}
      {author.avatar && (
        <Avatar
          src={author.avatar}
          fallback={author.avatarFallback || author.name.charAt(0)}
          size="md"
        />
      )}

      {/* Author Details */}
      <View style={{ 
        alignItems: alignment === 'center' ? 'center' : 'flex-start',
        flex: alignment === 'center' ? 0 : 1,
      }}>
        {/* Name */}
        <Text 
          weight="semibold"
          size="sm"
          style={{ textAlign: alignment }}
        >
          {author.name}
        </Text>

        {/* Title */}
        {author.title && (
          <Text 
            size="xs"
            colorVariant="secondary"
            style={{ textAlign: alignment }}
          >
            {author.title}
          </Text>
        )}

        {/* Organization */}
        {author.organization && (
          <Text 
            size="xs"
            colorVariant="muted"
            style={{ textAlign: alignment }}
          >
            {author.organization}
          </Text>
        )}
      </View>
    </Flex>
  );
}