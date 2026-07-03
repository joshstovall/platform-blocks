import React from 'react';
import { View, Pressable, Platform } from 'react-native';
import { Text } from '../Text';
import { Icon } from '../Icon';
import type { AccordionItem, AccordionProps } from './types';
import { useAccordionItemAnimation } from './hooks/useAccordionItemAnimation';
import type { AccordionAnimationProp } from './types';
import type { AccordionAccentStyles } from './styles';
import { Collapse } from '../Collapse';
import { mergeSlotProps } from '../../core/utils';
export interface AccordionItemComponentProps {
  item: AccordionItem;
  isExpanded: boolean;
  isDisabled: boolean;
  isLast: boolean;
  variant: AccordionProps['variant'];
  onPress: () => void;
  showChevron: boolean;
  styles: any;
  /** Resolved expanded-item emphasis (accordion-level or per-item `color`). */
  accent: AccordionAccentStyles;
  chevronColor: string;
  disabledChevronColor: string;
  headerStyle?: any;
  contentStyle?: any;
  headerTextStyle?: any;
  titleProps?: any;
  idPrefix: string;
  animated: AccordionAnimationProp;
  chevronPosition?: 'start' | 'end';
}

export const AccordionItemComponent: React.FC<AccordionItemComponentProps> = ({
  item,
  isExpanded,
  isDisabled,
  isLast,
  variant,
  onPress,
  showChevron,
  styles,
  accent,
  chevronColor,
  disabledChevronColor,
  headerStyle,
  contentStyle,
  headerTextStyle,
  titleProps,
  idPrefix,
  animated,
  chevronPosition = 'end',
}) => {
  const headerId = `${idPrefix}-header-${item.key}`;
  const panelId = `${idPrefix}-panel-${item.key}`;
  const { CollapseConfig, animatedChevronStyle } = useAccordionItemAnimation({ expanded: isExpanded, animated });
  const { shouldAnimate, duration, easing } = CollapseConfig;

  // Chevron follows the accent color while expanded (from the `color` prop).
  const resolvedChevronColor = isDisabled
    ? disabledChevronColor
    : isExpanded && accent.activeChevronColor
      ? accent.activeChevronColor
      : chevronColor;

  return (
    <View style={[
      styles.item,
      isLast && variant === 'default' && { borderBottomWidth: 0 },
      isExpanded && !isDisabled && accent.activeItem
    ]}>
      <Pressable
        style={[styles.header, headerStyle]}
        onPress={onPress}
        disabled={isDisabled}
        accessibilityRole="button"
        accessibilityState={{ expanded: isExpanded, disabled: isDisabled }}
        {...(Platform.OS === 'web' ? {
          id: headerId,
          'aria-controls': panelId,
          'aria-expanded': isExpanded,
        } as any : {})}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          {chevronPosition === 'start' && showChevron && (
            <View style={[styles.chevron, animatedChevronStyle]}>
              <Icon name="chevron-right" size="md" color={resolvedChevronColor} />
            </View>
          )}
          {item.icon && <View style={{ marginRight: 12 }}>{item.icon}</View>}
          <Text
            {...mergeSlotProps(
              {
                weight: isExpanded ? '600' : '400',
                selectable: false,
                style: [
                  styles.headerText,
                  isExpanded && accent.activeHeaderText,
                  isDisabled && styles.disabledHeaderText,
                  headerTextStyle,
                ],
              },
              titleProps
            )}
          >
            {item.title}
          </Text>
          {chevronPosition === 'end' && showChevron && (
            <View style={[
              styles.chevron,
              animatedChevronStyle,
              { marginLeft: 'auto' }
            ]}>
              <Icon name="chevron-right" size="md" color={resolvedChevronColor} />
            </View>
          )}
        </View>
      </Pressable>
      <View
        style={[
          { position: 'relative', zIndex: 1 },
          !shouldAnimate && !isExpanded && { height: 0, overflow: 'hidden' as const },
        ]}
        {...(Platform.OS === 'web' ? {
          id: panelId,
          role: 'region',
          'aria-labelledby': headerId,
          hidden: !isExpanded,
        } as any : {})}
      >
        {shouldAnimate ? (
          <Collapse
            isCollapsed={isExpanded}
            duration={duration}
            easing={easing}
            fadeContent={false}
            contentStyle={[styles.content, contentStyle]}
          >
            <View pointerEvents="box-none">
              {item.content}
            </View>
          </Collapse>
        ) : (
          isExpanded && (
            <View
              pointerEvents="box-none"
              style={[styles.content, contentStyle]}
            >
              <View>
                {item.content}
              </View>
            </View>
          )
        )}
      </View>
    </View>
  );
};

export default AccordionItemComponent;
