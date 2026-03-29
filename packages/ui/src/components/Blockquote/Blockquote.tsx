import React from 'react';
import { View, Pressable } from 'react-native';
import { useTheme } from '../../core/theme';
import { Text } from '../Text';
import { Icon } from '../Icon';
import { BlockquoteAttribution } from './BlockquoteAttribution';
import { createBlockquoteStyles } from './styles';
import type { BlockquoteProps } from './types';

export function Blockquote({
  children,
  variant = 'default',
  size = 'md',
  color,
  quoteIcon = 'quote',
  quoteIconPosition = 'top-left',
  quoteIconSize = 'lg',
  author,
  links,
  date,
  rating,
  source,
  verified,
  verifiedTooltip,
  alignment = 'left',
  border = false,
  shadow = false,
  style,
  onPress,
}: BlockquoteProps) {
  const theme = useTheme();
  const styles = createBlockquoteStyles(theme, {
    variant,
    size,
    alignment,
    border,
    shadow,
    color,
  });

  const hasAttribution = author || date || rating || source || verified;
  const showQuoteIcon = quoteIconPosition !== 'none';

  const renderQuoteIcon = () => {
    if (!showQuoteIcon) return null;

    let positionStyle: any;
    switch (quoteIconPosition) {
      case 'top-left':
        positionStyle = styles.quoteIconTopLeft;
        break;
      case 'top-center':
        positionStyle = styles.quoteIconTopCenter;
        break;
      case 'bottom-right':
        positionStyle = styles.quoteIconBottomRight;
        break;
      default:
        positionStyle = undefined;
    }

    const iconElement = React.isValidElement(quoteIcon) ? (
      quoteIcon
    ) : (
      <Icon
        name={quoteIcon as string}
        size={
          quoteIconSize === 'sm' ? 16 :
          quoteIconSize === 'md' ? 24 :
          quoteIconSize === 'lg' ? 32 :
          typeof quoteIconSize === 'number' ? quoteIconSize :
          24 // default size
        }
        color={theme.colors.gray[4]}
        style={styles.quoteIcon}
        variant="filled"
      />
    );

    return (
      <View style={[styles.quoteIconContainer, positionStyle]}>
        {iconElement}
      </View>
    );
  };

  const content = (
    <View style={[styles.container, style]}>
      {/* Quote Icon - Top positions */}
      {(quoteIconPosition === 'top-left' || quoteIconPosition === 'top-center') && renderQuoteIcon()}
      
      {/* Quote Content */}
      <View style={styles.content}>
        <Text style={styles.quoteText}>
          {children}
        </Text>
        
        {/* Quote Icon - Bottom position */}
        {quoteIconPosition === 'bottom-right' && renderQuoteIcon()}
      </View>

      {/* Attribution */}
      {hasAttribution && (
        <BlockquoteAttribution
          author={author}
          date={date}
          rating={rating}
          source={source}
          links={links}
          verified={verified}
          verifiedTooltip={verifiedTooltip}
          alignment={alignment}
        />
      )}
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [
        pressed && styles.pressed
      ]}>
        {content}
      </Pressable>
    );
  }

  return content;
}