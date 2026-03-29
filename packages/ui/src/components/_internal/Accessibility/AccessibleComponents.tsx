import React from 'react';
import { View, Text } from 'react-native';
import { useFocus, useAnnouncer } from '../../../core/accessibility/hooks';
import { useFocusTrap } from '../../../core/accessibility/advancedHooks';
import { createAccessibilityProps } from '../../../core/accessibility/utils';
import { DESIGN_TOKENS } from '../../../core';
import { useTheme } from '../../../core/theme';

interface AccessibleAnnouncerProps {
  children: React.ReactNode;
  announcements: string[];
}

/**
 * Component that provides live region for announcements
 */
export const AccessibleAnnouncer: React.FC<AccessibleAnnouncerProps> = ({
  children,
  announcements,
}) => {
  const theme = useTheme();

  return (
    <View style={{ flex: 1 }}>
      {children}
      
      {/* Live region for announcements */}
      <View
        style={{
          position: 'absolute',
          left: -10000,
          width: 1,
          height: 1,
          overflow: 'hidden',
        }}
        {...createAccessibilityProps({
          role: 'alert',
        })}
        accessibilityLiveRegion="polite"
      >
        {announcements.map((announcement, index) => (
          <Text key={`${announcement}-${index}`}>
            {announcement}
          </Text>
        ))}
      </View>
    </View>
  );
};

interface AccessibleModalProps {
  visible: boolean;
  title?: string;
  children: React.ReactNode;
  onDismiss?: () => void;
}

/**
 * Accessible modal with focus management
 */
export const AccessibleModal: React.FC<AccessibleModalProps> = ({
  visible,
  title,
  children,
  onDismiss,
}) => {
  const theme = useTheme();
  const { announce } = useAnnouncer();
  const { containerRef: trapRef } = useFocusTrap(visible);

  React.useEffect(() => {
    if (visible && title) {
      announce(`${title} dialog opened`);
    }
  }, [visible, title, announce]);

  if (!visible) return null;

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
      {...createAccessibilityProps({
        role: 'alert',
        label: title ? `${title} dialog` : 'Dialog',
      })}
      accessibilityModal={true}
      accessibilityViewIsModal={true}
    >
      <View
        ref={trapRef}
        style={{
          backgroundColor: theme.colors.surface[0],
          borderRadius: DESIGN_TOKENS.radius.lg,
          padding: DESIGN_TOKENS.spacing.xl,
          margin: DESIGN_TOKENS.spacing.lg,
          minWidth: 280,
          maxWidth: '90%',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        {title && (
          <Text
            style={{
              fontSize: DESIGN_TOKENS.typography.fontSize.lg,
              fontWeight: DESIGN_TOKENS.typography.fontWeight.semibold,
              color: theme.colors.gray[9],
              marginBottom: DESIGN_TOKENS.spacing.md,
            }}
            {...createAccessibilityProps({
              role: 'header',
            })}
          >
            {title}
          </Text>
        )}
        
        {children}
      </View>
    </View>
  );
};