import React from 'react';
import { View, TouchableOpacity, Platform } from 'react-native';
import { Text } from '../Text';
import { BreadcrumbsProps, BreadcrumbItem } from './types';
import { factory } from '../../core/factory';
import { useTheme } from '../../core/theme';
import { getSpacingStyles, extractSpacingProps } from '../../core/utils';
import { Icon } from '../Icon';
import { useDirection } from '../../core/providers/DirectionProvider';

export const Breadcrumbs = factory<{
  props: BreadcrumbsProps;
  ref: View;
}>((props, ref) => {
  const {
    items,
    separator = '/',
    maxItems,
    size = 'md',
    showIcons = true,
    style,
    textStyle,
    separatorStyle,
    accessibilityLabel = 'Breadcrumb navigation',
    ...rest
  } = props;

  const theme = useTheme();
  const { isRTL } = useDirection();
  const { spacingProps, otherProps } = extractSpacingProps(rest);
  const spacingStyle = getSpacingStyles(spacingProps);

  // Handle collapsing items if maxItems is specified
  const getDisplayItems = (): BreadcrumbItem[] => {
    if (!maxItems || items.length <= maxItems) {
      return items;
    }

    if (maxItems <= 2) {
      return [items[0], items[items.length - 1]];
    }

    const firstItems = items.slice(0, 1);
    const lastItems = items.slice(-1);
    const ellipsisItem: BreadcrumbItem = {
      label: '...',
      disabled: true,
    };

    return [...firstItems, ellipsisItem, ...lastItems];
  };

  const displayItems = getDisplayItems();
  
  // Reverse items in RTL to read right-to-left
  const orderedItems = isRTL ? [...displayItems].reverse() : displayItems;

  // Size-based styles
  const getSizeStyles = () => {
    const sizeMap = {
      xs: { fontSize: 12, height: 8, iconSize: 12 },
      sm: { fontSize: 14, height: 24, iconSize: 14 },
      md: { fontSize: 16, height: 28, iconSize: 16 },
      lg: { fontSize: 18, height: 32, iconSize: 18 },
    };
    return sizeMap[size];
  };

  const sizeStyles = getSizeStyles();

  const renderBreadcrumbItem = (item: BreadcrumbItem, index: number, isLast: boolean) => {
    const isClickable = !item.disabled && (item.href || item.onPress);
    
    const itemStyle = {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      minHeight: sizeStyles.height,
      opacity: item.disabled ? 0.5 : 1,
    };

    const textColor = isLast ? theme.text.primary : theme.text.muted;

    const content = (
      <View style={itemStyle}>
        {showIcons && item.icon && (
          <View style={isRTL ? { marginLeft: 6 } : { marginRight: 6 }}>
              <Icon name={
                item.icon ? (item.icon as any).props.name : 'chevron-right'
              } size={sizeStyles.iconSize} color={textColor} />
           
          </View>
        )}
        <Text
        size={sizeStyles.fontSize}
        colorVariant={isLast ? 'primary' : 'muted'}
        weight={isLast ? '600' : '200'}
        
        >
          {item.label}
        </Text>
      </View>
    );

    if (isClickable && !isLast) {
      return (
        <TouchableOpacity
          key={index}
          onPress={item.onPress}
          disabled={item.disabled}
          style={{
            opacity: item.disabled ? 0.5 : 1,
          }}
          accessibilityRole="link"
          accessibilityLabel={`Navigate to ${item.label}`}
        >
          {content}
        </TouchableOpacity>
      );
    }

    return (
      <View key={index} accessibilityRole={isLast ? 'text' : 'link'}>
        {content}
      </View>
    );
  };

  const renderSeparator = (index: number) => {
    return (
      <View
        key={`separator-${index}`}
        style={[
          {
            marginHorizontal: 8,
            alignItems: 'center' as const,
            justifyContent: 'center' as const,
          },
          separatorStyle,
        ]}
      >
        {typeof separator === 'string' ? (
          <Text
            style={{
              fontSize: sizeStyles.fontSize - 2,
              color: theme.text.muted,
            }}
          >
            {separator}
          </Text>
        ) : (
          separator
        )}
      </View>
    );
  };

  return (
    <View
      ref={ref}
      style={[
        {
          flexDirection: isRTL ? 'row-reverse' : 'row',
          alignItems: 'center',
          flexWrap: Platform.OS === 'web' ? 'wrap' : undefined,
        },
        spacingStyle,
        style,
      ]}
      accessibilityLabel={accessibilityLabel}
      {...otherProps}
    >
      {orderedItems.map((item, index) => {
        const isLast = index === orderedItems.length - 1;
        return (
          <React.Fragment key={index}>
            {renderBreadcrumbItem(item, index, isLast)}
            {!isLast && renderSeparator(index)}
          </React.Fragment>
        );
      })}
    </View>
  );
});

Breadcrumbs.displayName = 'Breadcrumbs';
