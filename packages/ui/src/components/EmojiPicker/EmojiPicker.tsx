import React, { useCallback } from 'react';
import { View, Pressable } from 'react-native';
import { factory } from '../../core/factory';
import { useTheme } from '../../core/theme';
import { getSpacingStyles, extractSpacingProps } from '../../core/utils';
import { Text } from '../Text';
import type { EmojiPickerProps } from './types';



export const EmojiPicker = factory<{ props: EmojiPickerProps; ref: View }>((props, ref) => {
  const {
    variant = 'quick',
    value,
    onSelect,
    disabled,
    searchPlaceholder = 'Search emoji…',
    emojis = [{
      label: 'Thumbs Up',
      emoji: '👍'
    }, {
      label: 'Heart',
      emoji: '❤️'
    }, {
      label: 'Fire',
      emoji: '🔥'
    }, {
      label: 'Laughing',
      emoji: '😂'
    }, {
      label: 'Party Popper',
      emoji: '🎉'
    }, {
      label: 'Heart Eyes',
      emoji: '😍'
    }],
    defaultOpened,
    onOpenChange,
    onSearchChange,
    showBackground = false,
    testID,
    ...spacing
  } = props;

  const theme = useTheme();

  const containerStyles = getSpacingStyles(extractSpacingProps(spacing).spacingProps);

  const handleSelect = useCallback((emoji: string) => {
    onSelect?.(emoji);
  }, [onSelect]);

  if (variant === 'quick') {
    return (
      <View
        ref={ref}
        style={[
          {
            flexDirection: 'row',
            ...(showBackground && {
              backgroundColor: theme.colors.surface[2],
              borderWidth: 1,
              borderColor: theme.colors.gray[3],
              borderRadius: 8,
              padding: 4
            })
          },
          containerStyles
        ]}
        testID={testID}
      >
        {emojis.map(e => {
          const isActive = value === e.emoji;
          return (
            <Pressable
              key={e.label}
              disabled={disabled}
              onPress={() => handleSelect(e.emoji)}
              style={({ pressed }) => ({
                paddingHorizontal: 6,
                paddingVertical: 4,
                borderRadius: 6,
                backgroundColor: isActive
                  ? theme.colors.primary[2]
                  : pressed
                    ? theme.colors.gray[2]
                    : 'transparent',
                ...(isActive && {
                  borderWidth: 1,
                  borderColor: theme.colors.primary[4]
                }),
                opacity: pressed ? 0.6 : 1,
              })}
              accessibilityLabel={`Select emoji ${e}`}
              accessibilityState={{ selected: isActive }}
            >
              <Text style={{ fontSize: 22 }}>{e.emoji}</Text>
            </Pressable>
          );
        })}
      </View>
    );
  }
});

EmojiPicker.displayName = 'EmojiPicker';
