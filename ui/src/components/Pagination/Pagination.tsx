import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '../Text';
import { Icon } from '../Icon';
import { PaginationProps } from './types';
import { factory } from '../../core/factory';
import { useTheme } from '../../core/theme';
import { useDirection } from '../../core/providers/DirectionProvider';
import { getSpacingStyles, extractSpacingProps } from '../../core/utils';

export const Pagination = factory<{
  props: PaginationProps;
  ref: View;
}>((props, ref) => {
  const {
    current,
    total,
    siblings = 1,
    boundaries = 1,
    onChange,
    size = 'md',
    variant = 'default',
    color = 'primary',
    showFirst = true,
    showPrevNext = true,
    labels = {},
    disabled = false,
    style,
    buttonStyle,
    activeButtonStyle,
    textStyle,
    activeTextStyle,
    hideOnSinglePage = false,
    showSizeChanger = false,
    pageSizeOptions = [10, 20, 50, 100],
    pageSize = 10,
    onPageSizeChange,
    showTotal = false,
    totalItems,
    ...rest
  } = props;

  const theme = useTheme();
  const { isRTL } = useDirection();
  const { spacingProps, otherProps } = extractSpacingProps(rest);
  const spacingStyle = getSpacingStyles(spacingProps);

  if (hideOnSinglePage && total <= 1) {
    return null;
  }

  // Generate page numbers to display
  const generatePageNumbers = (): (number | 'ellipsis')[] => {
    const pages: (number | 'ellipsis')[] = [];
    
    // Always show first boundary pages
    for (let i = 1; i <= Math.min(boundaries, total); i++) {
      pages.push(i);
    }
    
    // Calculate range around current page
    const startPage = Math.max(current - siblings, boundaries + 1);
    const endPage = Math.min(current + siblings, total - boundaries);
    
    // Add ellipsis if there's a gap between boundaries and current range
    if (startPage > boundaries + 1) {
      pages.push('ellipsis');
    }
    
    // Add pages around current page
    for (let i = startPage; i <= endPage; i++) {
      if (i > boundaries && i <= total - boundaries) {
        pages.push(i);
      }
    }
    
    // Add ellipsis if there's a gap between current range and last boundaries
    if (endPage < total - boundaries) {
      pages.push('ellipsis');
    }
    
    // Always show last boundary pages
    for (let i = Math.max(total - boundaries + 1, boundaries + 1); i <= total; i++) {
      if (i > boundaries) {
        pages.push(i);
      }
    }
    
    return [...new Set(pages)]; // Remove duplicates
  };

  const pages = generatePageNumbers();

  // Size-based styles
  const getSizeStyles = () => {
    const sizeMap = {
      xs: { fontSize: 12, height: 28, minWidth: 28, padding: 6, iconSize: 12 },
      sm: { fontSize: 14, height: 32, minWidth: 32, padding: 8, iconSize: 14 },
      md: { fontSize: 16, height: 36, minWidth: 36, padding: 10, iconSize: 16 },
      lg: { fontSize: 18, height: 40, minWidth: 40, padding: 12, iconSize: 18 },
    };
    return sizeMap[size];
  };

  const sizeStyles = getSizeStyles();

  // Get button styles based on variant and state
  const getButtonStyles = (isActive: boolean, isDisabled: boolean) => {
    const baseStyle = {
      height: sizeStyles.height,
      minWidth: sizeStyles.minWidth,
      paddingHorizontal: sizeStyles.padding,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      borderRadius: 6,
      marginHorizontal: 2,
    };

    const colorScheme = theme.colors[color] || theme.colors.primary;

    if (isDisabled) {
      return {
        ...baseStyle,
        backgroundColor: variant === 'outline' ? 'transparent' : theme.colors.gray[1],
        borderWidth: variant === 'outline' ? 1 : 0,
        borderColor: theme.colors.gray[3],
        opacity: 0.5,
      };
    }

    if (isActive) {
      switch (variant) {
        case 'outline':
          return {
            ...baseStyle,
            backgroundColor: colorScheme[6],
            borderWidth: 1,
            borderColor: colorScheme[6],
          };
        case 'subtle':
          return {
            ...baseStyle,
            backgroundColor: colorScheme[1],
            borderWidth: 0,
          };
        default:
          return {
            ...baseStyle,
            backgroundColor: colorScheme[6],
            borderWidth: 0,
          };
      }
    }

    switch (variant) {
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.colors.gray[3],
        };
      case 'subtle':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 0,
        };
      default:
        return {
          ...baseStyle,
          backgroundColor: theme.colors.gray[1],
          borderWidth: 0,
        };
    }
  };

  const getTextColor = (isActive: boolean, isDisabled: boolean) => {
    if (isDisabled) {
      return theme.text.disabled;
    }
    
    if (isActive) {
      return variant === 'outline' || variant === 'default' ? 'white' : theme.colors[color][7];
    }
    
    return theme.text.primary;
  };

  const renderButton = (
    content: React.ReactNode,
    onPress: () => void,
    isActive = false,
    isDisabled = false,
    key?: string | number
  ) => {
    const buttonStyles = getButtonStyles(isActive, isDisabled);
    const textColor = getTextColor(isActive, isDisabled);

    return (
      <TouchableOpacity
        key={key}
        onPress={onPress}
        disabled={disabled || isDisabled}
        style={[
          buttonStyles,
          buttonStyle,
          isActive && activeButtonStyle,
        ]}
        accessibilityRole="button"
      >
        {typeof content === 'string' || typeof content === 'number' ? (
          <Text
            style={[
              {
                fontSize: sizeStyles.fontSize,
                color: textColor,
                fontWeight: isActive ? '600' : '400',
              },
              textStyle,
              isActive && activeTextStyle,
            ]}
          >
            {content}
          </Text>
        ) : (
          content
        )}
      </TouchableOpacity>
    );
  };

  const renderPageButton = (page: number | 'ellipsis', index: number) => {
    if (page === 'ellipsis') {
      return (
        <View
          key={`ellipsis-${index}`}
          style={{
            height: sizeStyles.height,
            minWidth: sizeStyles.minWidth,
            justifyContent: 'center',
            alignItems: 'center',
            marginHorizontal: 2,
          }}
        >
          <Text
            style={{
              fontSize: sizeStyles.fontSize,
              color: theme.text.muted,
            }}
          >
            ...
          </Text>
        </View>
      );
    }

    return renderButton(
      page,
      () => onChange(page),
      current === page,
      false,
      page
    );
  };

  const renderTotal = () => {
    if (!showTotal || !totalItems) return null;

    const startItem = (current - 1) * pageSize + 1;
    const endItem = Math.min(current * pageSize, totalItems);

    if (typeof showTotal === 'function') {
      return (
        <View style={isRTL ? { marginLeft: 16 } : { marginRight: 16 }}>
          {showTotal(totalItems, [startItem, endItem])}
        </View>
      );
    }

    return (
      <View style={isRTL ? { marginLeft: 16 } : { marginRight: 16 }}>
        <Text
          style={{
            fontSize: sizeStyles.fontSize,
            color: theme.text.secondary,
          }}
        >
          {startItem}-{endItem} of {totalItems}
        </Text>
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
          flexWrap: 'wrap',
        },
        spacingStyle,
        style,
      ]}
      {...otherProps}
    >
      {renderTotal()}
      
      {showFirst && renderButton(
        labels.first || <Icon name={isRTL ? 'chevron-right' : 'chevron-left'} size={sizeStyles.iconSize} />,
        () => onChange(1),
        false,
        current === 1,
        'first'
      )}

      {showPrevNext && renderButton(
        labels.previous || <Icon name={isRTL ? 'chevron-right' : 'chevron-left'} size={sizeStyles.iconSize} />,
        () => onChange(current - 1),
        false,
        current === 1,
        'prev'
      )}

      {pages.map((page, index) => renderPageButton(page, index))}

      {showPrevNext && renderButton(
        labels.next || <Icon name={isRTL ? 'chevron-left' : 'chevron-right'} size={sizeStyles.iconSize} />,
        () => onChange(current + 1),
        false,
        current === total,
        'next'
      )}

      {showFirst && renderButton(
        labels.last || <Icon name={isRTL ? 'chevron-left' : 'chevron-right'} size={sizeStyles.iconSize} />,
        () => onChange(total),
        false,
        current === total,
        'last'
      )}
    </View>
  );
});

Pagination.displayName = 'Pagination';
