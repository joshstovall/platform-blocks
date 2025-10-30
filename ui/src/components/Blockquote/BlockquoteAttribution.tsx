import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../core/theme';
import { BlockquoteAuthor } from './BlockquoteAuthor';
import { BlockquoteSource } from './BlockquoteSource';
import { BlockquoteMeta } from './BlockquoteMeta';
import type { BlockquoteAttributionProps } from './types';

export function BlockquoteAttribution({
  author,
  date,
  rating,
  source,
  links,
  verified,
  verifiedTooltip,
  alignment = 'left',
}: BlockquoteAttributionProps) {
  const theme = useTheme();

  const containerStyle = {
    marginTop: parseInt(theme.spacing.md),
    alignItems: alignment === 'center' ? 'center' as const : alignment === 'right' ? 'flex-end' as const : 'flex-start' as const,
  };

  return (
    <View style={containerStyle}>
      {/* Author Information */}
      {author && (
        <BlockquoteAuthor
          author={author}
          alignment={alignment}
        />
      )}

      {/* Source Information */}
      {source && (
        <BlockquoteSource
          source={source}
          alignment={alignment}
        />
      )}

      {/* Metadata (date, rating, verification) */}
      {(date || rating || verified) && (
        <BlockquoteMeta
          date={date}
          rating={rating}
          verified={verified}
          verifiedTooltip={verifiedTooltip}
          alignment={alignment}
        />
      )}
    </View>
  );
}