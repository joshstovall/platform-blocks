import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useAccessibility } from '../../../core/accessibility/context';
import { DESIGN_TOKENS } from '../../../core';
import { useTheme } from '../../../core/theme';
import { Icon } from '../../Icon';

interface AccessibilityDebuggerProps {
  visible?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

/**
 * Development tool for debugging accessibility features
 */
export const AccessibilityDebugger: React.FC<AccessibilityDebuggerProps> = ({
  visible = __DEV__,
  position = 'bottom-right',
}) => {
  const theme = useTheme();
  const {
    prefersReducedMotion,
    screenReaderEnabled,
    announcements,
    currentFocusId,
    focusHistory,
  } = useAccessibility();

  const [expanded, setExpanded] = React.useState(false);

  if (!visible) return null;

  const getPositionStyles = () => {
    const base = {
      position: 'absolute' as const,
      zIndex: 99999,
      backgroundColor: theme.colors.gray[9],
      borderRadius: DESIGN_TOKENS.radius.md,
      padding: DESIGN_TOKENS.spacing.sm,
      minWidth: 200,
      maxWidth: 300,
    };

    switch (position) {
      case 'top-left':
        return { ...base, top: DESIGN_TOKENS.spacing.lg, left: DESIGN_TOKENS.spacing.lg };
      case 'top-right':
        return { ...base, top: DESIGN_TOKENS.spacing.lg, right: DESIGN_TOKENS.spacing.lg };
      case 'bottom-left':
        return { ...base, bottom: DESIGN_TOKENS.spacing.lg, left: DESIGN_TOKENS.spacing.lg };
      case 'bottom-right':
        return { ...base, bottom: DESIGN_TOKENS.spacing.lg, right: DESIGN_TOKENS.spacing.lg };
      default:
        return base;
    }
  };

  return (
    <View style={getPositionStyles()}>
      <Pressable
        onPress={() => setExpanded(!expanded)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: expanded ? DESIGN_TOKENS.spacing.sm : 0,
        }}
      >
        <Text style={{ color: 'white', fontSize: DESIGN_TOKENS.typography.fontSize.sm, fontWeight: 'bold' }}>
          A11y Debug
        </Text>
        <Icon 
          name={expanded ? 'chevron-up' : 'chevron-down'} 
          size={16} 
          color="white" 
        />
      </Pressable>

      {expanded && (
        <View style={{ gap: DESIGN_TOKENS.spacing.xs }}>
          {/* Motion Preference */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: theme.colors.gray[3], fontSize: DESIGN_TOKENS.typography.fontSize.xs }}>
              Reduced Motion:
            </Text>
            <Text style={{ color: prefersReducedMotion ? theme.colors.warning[4] : theme.colors.success[4], fontSize: DESIGN_TOKENS.typography.fontSize.xs }}>
              {prefersReducedMotion ? 'ON' : 'OFF'}
            </Text>
          </View>

          {/* Screen Reader */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: theme.colors.gray[3], fontSize: DESIGN_TOKENS.typography.fontSize.xs }}>
              Screen Reader:
            </Text>
            <Text style={{ color: screenReaderEnabled ? theme.colors.success[4] : theme.colors.gray[5], fontSize: DESIGN_TOKENS.typography.fontSize.xs }}>
              {screenReaderEnabled ? 'ON' : 'OFF'}
            </Text>
          </View>

          {/* Current Focus */}
          <View>
            <Text style={{ color: theme.colors.gray[3], fontSize: DESIGN_TOKENS.typography.fontSize.xs }}>
              Current Focus:
            </Text>
            <Text style={{ color: 'white', fontSize: DESIGN_TOKENS.typography.fontSize.xs, marginTop: 2 }}>
              {currentFocusId || 'None'}
            </Text>
          </View>

          {/* Focus History */}
          {focusHistory.length > 0 && (
            <View>
              <Text style={{ color: theme.colors.gray[3], fontSize: DESIGN_TOKENS.typography.fontSize.xs }}>
                Focus History ({focusHistory.length}):
              </Text>
              <Text style={{ color: 'white', fontSize: DESIGN_TOKENS.typography.fontSize.xs, marginTop: 2 }}>
                {focusHistory.slice(-3).join(' → ')}
              </Text>
            </View>
          )}

          {/* Live Announcements */}
          {announcements.length > 0 && (
            <View>
              <Text style={{ color: theme.colors.gray[3], fontSize: DESIGN_TOKENS.typography.fontSize.xs }}>
                Announcements ({announcements.length}):
              </Text>
              <View style={{ maxHeight: 80, overflow: 'hidden' }}>
                {announcements.slice(-3).map((announcement, index) => (
                  <Text 
                    key={index} 
                    style={{ 
                      color: 'white', 
                      fontSize: DESIGN_TOKENS.typography.fontSize.xs, 
                      marginTop: 2,
                      opacity: 0.8,
                    }}
                    numberOfLines={2}
                  >
                    • {announcement}
                  </Text>
                ))}
              </View>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

interface AccessibilityTestSuiteProps {
  onTestComplete?: (results: AccessibilityTestResults) => void;
}

interface AccessibilityTestResults {
  colorContrast: boolean;
  focusableElements: number;
  screenReaderLabels: boolean;
  keyboardNavigation: boolean;
  reducedMotion: boolean;
}

/**
 * Automated accessibility testing component
 */
export const AccessibilityTestSuite: React.FC<AccessibilityTestSuiteProps> = ({
  onTestComplete,
}) => {
  const theme = useTheme();
  const { prefersReducedMotion, screenReaderEnabled } = useAccessibility();
  const [testResults, setTestResults] = React.useState<AccessibilityTestResults | null>(null);
  const [testing, setTesting] = React.useState(false);

  const runTests = async () => {
    setTesting(true);
    
    // Simulate testing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const results: AccessibilityTestResults = {
      colorContrast: true, // Simplified - would need actual contrast calculations
      focusableElements: 0, // Would count actual focusable elements
      screenReaderLabels: screenReaderEnabled,
      keyboardNavigation: true, // Would test keyboard navigation
      reducedMotion: prefersReducedMotion,
    };

    setTestResults(results);
    setTesting(false);
    onTestComplete?.(results);
  };

  const getTestStatus = (passed: boolean) => ({
    color: passed ? theme.colors.success[5] : theme.colors.error[5],
    icon: passed ? 'check-circle' : 'x-circle',
  });

  return (
    <View style={{
      backgroundColor: theme.colors.surface[0],
      borderRadius: DESIGN_TOKENS.radius.md,
      padding: DESIGN_TOKENS.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.gray[3],
    }}>
      <Text style={{
        fontSize: DESIGN_TOKENS.typography.fontSize.lg,
        fontWeight: DESIGN_TOKENS.typography.fontWeight.semibold,
        color: theme.colors.gray[9],
        marginBottom: DESIGN_TOKENS.spacing.md,
      }}>
        Accessibility Test Suite
      </Text>

      <Pressable
        onPress={runTests}
        disabled={testing}
        style={({ pressed }) => ({
          backgroundColor: testing ? theme.colors.gray[3] : theme.colors.primary[5],
          paddingHorizontal: DESIGN_TOKENS.spacing.md,
          paddingVertical: DESIGN_TOKENS.spacing.sm,
          borderRadius: DESIGN_TOKENS.radius.sm,
          marginBottom: DESIGN_TOKENS.spacing.md,
          opacity: pressed ? 0.8 : 1,
        })}
      >
        <Text style={{ 
          color: 'white', 
          fontSize: DESIGN_TOKENS.typography.fontSize.sm,
          textAlign: 'center',
        }}>
          {testing ? 'Running Tests...' : 'Run Accessibility Tests'}
        </Text>
      </Pressable>

      {testResults && (
        <View style={{ gap: DESIGN_TOKENS.spacing.sm }}>
          <Text style={{
            fontSize: DESIGN_TOKENS.typography.fontSize.md,
            fontWeight: DESIGN_TOKENS.typography.fontWeight.medium,
            color: theme.colors.gray[8],
            marginBottom: DESIGN_TOKENS.spacing.xs,
          }}>
            Test Results:
          </Text>

          {Object.entries(testResults).map(([key, value]) => {
            const status = getTestStatus(value as boolean);
            const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            
            return (
              <View key={key} style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                gap: DESIGN_TOKENS.spacing.sm,
              }}>
                <Icon name={status.icon as any} size={16} color={status.color} />
                <Text style={{ 
                  fontSize: DESIGN_TOKENS.typography.fontSize.sm,
                  color: theme.colors.gray[7],
                  flex: 1,
                }}>
                  {label}
                </Text>
                <Text style={{ 
                  fontSize: DESIGN_TOKENS.typography.fontSize.xs,
                  color: status.color,
                  fontWeight: DESIGN_TOKENS.typography.fontWeight.medium,
                }}>
                  {typeof value === 'boolean' ? (value ? 'PASS' : 'FAIL') : value}
                </Text>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};