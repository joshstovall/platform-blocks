import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@platform-blocks/ui';

interface FolderIconProps {
  size?: number; // overall height
  color?: string; // override color
  hasFiles?: boolean; // render paper insert when folder contains files
}

// Simple folder glyph (tab + body) using Views to avoid extra svg deps.
// Height = size; width ~ size * 1.25 for proportions.
export const FolderIcon: React.FC<FolderIconProps> = ({ size = 16, color, hasFiles = false }) => {
  const theme = useTheme();
  const baseColor = color || (theme.colorScheme === 'dark' ? '#3B82F6' : '#2D7FF9');
  const accent = theme.colorScheme === 'dark' ? '#60A5FA' : '#5EA0FF';
  const paperColor = theme.colorScheme === 'dark' ? '#F3F4F68C' : '#FFFFFF';
  const width = Math.round(size * 1.25);
  const tabHeight = Math.max(4, Math.round(size * 0.35));
  const radius = Math.round(size * 0.15);
  const paperHeight = Math.min(5, Math.max(3, Math.round(size * 0.35)));
  const bodyTop = tabHeight * 0.5;
  const paperTop = Math.max(0, Math.round(bodyTop - paperHeight +10));
  return (
    <View style={{ width, height: size, position: 'relative' }}>
      {/* Folder body */}
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: tabHeight * 0.5, backgroundColor: baseColor, borderTopLeftRadius: radius, borderTopRightRadius: radius, borderBottomLeftRadius: radius, borderBottomRightRadius: radius }} />
      {/* Folder tab */}
      <View style={{ position: 'absolute', left: 0, top: 0, height: tabHeight, width: width * 0.6, backgroundColor: accent, borderTopLeftRadius: radius, borderTopRightRadius: Math.round(radius * 0.6) }} />
      {hasFiles && (
        <View
          style={{
            position: 'absolute',
            // left: Math.round(width * 0.2),
            width: Math.round(width ),
            right: Math.round(width * 0.0),
            // opacity: 0.8,
            top: paperTop,
            height: paperHeight,
            backgroundColor: paperColor,
            borderRadius: 2,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: theme.colorScheme === 'dark' ? '#C7D2FE66' : '#1E3A8A33'
          }}
        />
      )}
    </View>
  );
};

FolderIcon.displayName = 'FolderIcon';
