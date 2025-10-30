/**
 * Button Component Rendering Tests
 * 
 * Tests actual component behavior, rendering, and interactions
 * using React Native Testing Library
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../Button';

// Mock the heavy dependencies
jest.mock('../../../hooks/useHaptics', () => ({
  useHaptics: () => ({
    trigger: jest.fn(),
    triggerImpact: jest.fn(),
    triggerNotification: jest.fn(),
    triggerSelection: jest.fn(),
    impactLight: jest.fn(),
    impactMedium: jest.fn(),
    impactHeavy: jest.fn(),
    impactPressIn: jest.fn(),
    impactPressOut: jest.fn(),
    notificationSuccess: jest.fn(),
    notificationWarning: jest.fn(),
    notificationError: jest.fn(),
  }),
}));

jest.mock('../../../core/accessibility/hooks', () => ({
  useFocus: () => ({
    ref: { current: null },
    focus: jest.fn(),
    isFocused: false,
  }),
  useReducedMotion: () => ({
    getDuration: (duration: number) => duration,
    shouldReduceMotion: false,
  }),
  useAnnouncer: () => ({
    announce: jest.fn(),
  }),
}));

describe('Button Component - Rendering & Behavior', () => {
  
  // ============================================================================
  // RENDERING TESTS
  // ============================================================================
  
  describe('Rendering', () => {
    it('should render with title prop', () => {
      const { getByText } = render(<Button title="Click me" />);
      expect(getByText('Click me')).toBeTruthy();
    });

    it('should render with children prop', () => {
      const { getByText } = render(<Button>Press here</Button>);
      expect(getByText('Press here')).toBeTruthy();
    });

    it('should render with testID', () => {
      const { getByTestId } = render(
        <Button title="Test" testID="button" />
      );
      expect(getByTestId('button')).toBeTruthy();
    });

    it('should prefer children over title', () => {
      const { getByText, queryByText } = render(
        <Button title="Title">Children</Button>
      );
      
      expect(getByText('Children')).toBeTruthy();
      expect(queryByText('Title')).toBeFalsy();
    });
  });

  // ============================================================================
  // INTERACTION TESTS
  // ============================================================================
  
  describe('User Interactions', () => {
    it('should call onPress when pressed', () => {
      const onPress = jest.fn();
      const { getByTestId } = render(
        <Button title="Press me" onPress={onPress} testID="button" />
      );
      
      fireEvent.press(getByTestId('button'));
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('should call onPressIn when press starts', () => {
      const onPressIn = jest.fn();
      const { getByTestId } = render(
        <Button title="Press" onPressIn={onPressIn} testID="button" />
      );
      
      fireEvent(getByTestId('button'), 'pressIn');
      expect(onPressIn).toHaveBeenCalledTimes(1);
    });

    it('should call onPressOut when press ends', () => {
      const onPressOut = jest.fn();
      const { getByTestId } = render(
        <Button title="Press" onPressOut={onPressOut} testID="button" />
      );
      
      fireEvent(getByTestId('button'), 'pressOut');
      expect(onPressOut).toHaveBeenCalledTimes(1);
    });

    it('should call onLongPress on long press', () => {
      const onLongPress = jest.fn();
      const { getByTestId } = render(
        <Button title="Hold" onLongPress={onLongPress} testID="button" />
      );
      
      fireEvent(getByTestId('button'), 'longPress');
      expect(onLongPress).toHaveBeenCalledTimes(1);
    });

    it('should not call onPress when disabled', () => {
      const onPress = jest.fn();
      const { getByTestId } = render(
        <Button title="Disabled" disabled onPress={onPress} testID="button" />
      );
      
      // Button should not trigger onPress when disabled
      fireEvent.press(getByTestId('button'));
      expect(onPress).not.toHaveBeenCalled();
    });

    it('should not call onPress when loading', () => {
      const onPress = jest.fn();
      const { getByTestId } = render(
        <Button title="Loading" loading onPress={onPress} testID="button" />
      );
      
      fireEvent.press(getByTestId('button'));
      expect(onPress).not.toHaveBeenCalled();
    });
  });

  // ============================================================================
  // LOADING STATE TESTS
  // ============================================================================
  
  describe('Loading State', () => {
    it('should display loadingTitle when provided', () => {
      const { getByText, queryByText } = render(
        <Button title="Submit" loading loadingTitle="Submitting..." />
      );
      
      expect(getByText('Submitting...')).toBeTruthy();
      expect(queryByText('Submit')).toBeFalsy();
    });

    it('should hide title when loading without loadingTitle', () => {
      const { queryByText } = render(
        <Button title="Submit" loading testID="button" />
      );
      
      // Original title should not be shown
      expect(queryByText('Submit')).toBeFalsy();
    });

    it('should not call onPress when loading', () => {
      const onPress = jest.fn();
      const { getByTestId } = render(
        <Button title="Loading" loading onPress={onPress} testID="button" />
      );
      
      fireEvent.press(getByTestId('button'));
      expect(onPress).not.toHaveBeenCalled();
    });
  });

  // ============================================================================
  // VARIANT TESTS
  // ============================================================================
  
  describe('Visual Variants', () => {
    const variants = ['filled', 'outline', 'ghost', 'link', 'gradient', 'secondary', 'none'] as const;
    
    variants.forEach(variant => {
      it(`should render ${variant} variant`, () => {
        const { getByTestId } = render(
          <Button title={variant} variant={variant} testID="button" />
        );
        expect(getByTestId('button')).toBeTruthy();
      });
    });
  });

  // ============================================================================
  // SIZE TESTS
  // ============================================================================
  
  describe('Size Variations', () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
    
    sizes.forEach(size => {
      it(`should render ${size} size`, () => {
        const { getByTestId } = render(
          <Button title={size.toUpperCase()} size={size} testID="button" />
        );
        expect(getByTestId('button')).toBeTruthy();
      });
    });
  });

  // ============================================================================
  // DISABLED STATE TESTS
  // ============================================================================
  
  describe('Disabled State', () => {
    it('should have disabled pressable when disabled prop is true', () => {
      const { getByTestId } = render(
        <Button title="Disabled" disabled testID="button" />
      );
      
      const button = getByTestId('button');
      // Check accessibility state instead of internal disabled prop
      expect(button.props.accessibilityState?.disabled).toBe(true);
    });

    it('should have accessibilityState.disabled', () => {
      const { getByTestId } = render(
        <Button title="Disabled" disabled testID="button" />
      );
      
      const button = getByTestId('button');
      expect(button.props.accessibilityState?.disabled).toBe(true);
    });
  });

  // ============================================================================
  // CUSTOM COLOR TESTS
  // ============================================================================
  
  describe('Custom Colors', () => {
    it('should accept custom colorVariant', () => {
      const { getByTestId } = render(
        <Button title="Custom" colorVariant="#FF0000" testID="button" />
      );
      expect(getByTestId('button')).toBeTruthy();
    });

    it('should accept custom textColor', () => {
      const { getByTestId } = render(
        <Button title="Custom Text" textColor="#00FF00" testID="button" />
      );
      expect(getByTestId('button')).toBeTruthy();
    });

    it('should accept theme color tokens', () => {
      const { getByTestId } = render(
        <Button title="Theme Color" colorVariant="primary.6" testID="button" />
      );
      expect(getByTestId('button')).toBeTruthy();
    });
  });

  // ============================================================================
  // ACCESSIBILITY TESTS
  // ============================================================================
  
  describe('Accessibility', () => {
    it('should have role="button" by default', () => {
      const { getByTestId } = render(
        <Button title="Accessible" testID="button" />
      );
      
      const button = getByTestId('button');
      expect(button.props.accessibilityRole).toBe('button');
    });

    it('should accept custom accessibilityLabel', () => {
      const { getByLabelText } = render(
        <Button 
          title="Submit" 
          accessibilityLabel="Submit form button"
        />
      );
      
      expect(getByLabelText('Submit form button')).toBeTruthy();
    });

    it('should accept custom accessibilityHint', () => {
      const { getByTestId } = render(
        <Button 
          title="Submit" 
          accessibilityHint="Double tap to submit"
          testID="button"
        />
      );
      
      const button = getByTestId('button');
      expect(button.props.accessibilityHint).toBe('Double tap to submit');
    });

    it('should set accessibilityHint when loading', () => {
      const { getByTestId } = render(
        <Button title="Loading" loading testID="button" />
      );
      
      const button = getByTestId('button');
      // Check that button indicates loading state through hint
      expect(button.props.accessibilityHint).toBeTruthy();
    });
  });

  // ============================================================================
  // FULL WIDTH TESTS
  // ============================================================================
  
  describe('Full Width', () => {
    it('should accept fullWidth prop', () => {
      const { getByTestId } = render(
        <Button title="Full Width" fullWidth testID="button" />
      );
      expect(getByTestId('button')).toBeTruthy();
    });
  });

  // ============================================================================
  // EDGE CASES
  // ============================================================================
  
  describe('Edge Cases', () => {
    it('should handle empty string title gracefully', () => {
      const { getByTestId } = render(
        <Button title="" testID="button" />
      );
      
      expect(getByTestId('button')).toBeTruthy();
    });

    it('should handle both loading and disabled states', () => {
      const onPress = jest.fn();
      const { getByTestId } = render(
        <Button 
          title="Button" 
          loading 
          disabled 
          onPress={onPress} 
          testID="button" 
        />
      );
      
      const button = getByTestId('button');
      // Check accessibility state for disabled
      expect(button.props.accessibilityState?.disabled).toBe(true);
      
      // Should not call onPress
      fireEvent.press(button);
      expect(onPress).not.toHaveBeenCalled();
    });

    it('should handle multiple event handlers', () => {
      const onPress = jest.fn();
      const onPressIn = jest.fn();
      const onPressOut = jest.fn();
      
      const { getByTestId } = render(
        <Button 
          title="Multi Events" 
          onPress={onPress}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          testID="button" 
        />
      );
      
      const button = getByTestId('button');
      
      fireEvent(button, 'pressIn');
      expect(onPressIn).toHaveBeenCalledTimes(1);
      
      fireEvent.press(button);
      expect(onPress).toHaveBeenCalledTimes(1);
      
      fireEvent(button, 'pressOut');
      expect(onPressOut).toHaveBeenCalledTimes(1);
    });

    it('should handle onLayout callback', () => {
      const onLayout = jest.fn();
      
      const { getByTestId } = render(
        <Button title="Layout" onLayout={onLayout} testID="button" />
      );
      
      const button = getByTestId('button');
      const mockEvent = { nativeEvent: { layout: { width: 100, height: 40 } } };
      
      fireEvent(button, 'layout', mockEvent);
      expect(onLayout).toHaveBeenCalledWith(mockEvent);
    });
  });

  // ============================================================================
  // ICON TESTS
  // ============================================================================
  
  describe('Icon Support', () => {
    it('should accept icon prop', () => {
      const { getByTestId } = render(
        <Button icon={<></>} testID="button" />
      );
      expect(getByTestId('button')).toBeTruthy();
    });

    it('should accept startIcon with title', () => {
      const { getByText, getByTestId } = render(
        <Button title="Next" startIcon={<></>} testID="button" />
      );
      
      expect(getByText('Next')).toBeTruthy();
      expect(getByTestId('button')).toBeTruthy();
    });

    it('should accept endIcon with title', () => {
      const { getByText, getByTestId } = render(
        <Button title="Previous" endIcon={<></>} testID="button" />
      );
      
      expect(getByText('Previous')).toBeTruthy();
      expect(getByTestId('button')).toBeTruthy();
    });
  });

  // ============================================================================
  // TOOLTIP TESTS
  // ============================================================================
  
  describe('Tooltip Integration', () => {
    it('should accept tooltip prop', () => {
      const { getByTestId } = render(
        <Button title="With Tooltip" tooltip="Click here" testID="button" />
      );
      expect(getByTestId('button')).toBeTruthy();
    });

    it('should accept tooltipPosition prop', () => {
      const { getByTestId } = render(
        <Button 
          title="Tooltip" 
          tooltip="Info" 
          tooltipPosition="bottom" 
          testID="button" 
        />
      );
      expect(getByTestId('button')).toBeTruthy();
    });
  });
});
