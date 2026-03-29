/**
 * Rating Component - Comprehensive Test Suite
 * 
 * Tests type definitions, prop validation, and functionality.
 * 
 * Coverage:
 * - Size types, Colors, Values, Count, ReadOnly
 * - Fractional ratings, Labels, Gap sizing
 * - Accessibility, Ref forwarding
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { View, Text } from 'react-native';
import { Rating } from '../Rating';

// Mock the theme
jest.mock('../../../core/theme/ThemeProvider', () => ({
  useTheme: () => ({
    colors: {
      gray: ['#f8f9fa', '#f1f3f5', '#e9ecef', '#dee2e6', '#ced4da', '#adb5bd', '#868e96', '#495057', '#343a40', '#212529'],
      warning: ['#fff9db', '#fff3bf', '#ffec99', '#ffe066', '#ffd43b', '#fcc419', '#fab005', '#f59f00', '#f08c00', '#e67700'],
    },
    text: {
      primary: '#212529',
      secondary: '#495057',
    },
  }),
}));

// Mock Icon component
jest.mock('../../Icon', () => ({
  Icon: ({ name, size, color, testID }: any) => {
    const MockedIcon = require('react-native').View;
    return <MockedIcon testID={testID || `icon-${name}`} style={{ width: size, height: size, backgroundColor: color }} />;
  },
}));

// Mock Text component
jest.mock('../../Text', () => ({
  Text: ({ children, testID }: any) => {
    const MockedText = require('react-native').Text;
    return <MockedText testID={testID}>{children}</MockedText>;
  },
}));

describe('Rating - Type Safety and Prop Validation', () => {
  
  describe('Basic Rendering', () => {
    it('should render with default props', () => {
      const { getByTestId } = render(<Rating testID="rating" />);
      expect(getByTestId('rating')).toBeTruthy();
    });

    it('should render with custom count', () => {
      const { getByTestId } = render(<Rating count={3} testID="rating" />);
      expect(getByTestId('rating')).toBeTruthy();
    });

    it('should render with count={10}', () => {
      const { getByTestId } = render(<Rating count={10} testID="rating" />);
      expect(getByTestId('rating')).toBeTruthy();
    });
  });

  describe('Size Types', () => {
    it('should accept size "xs"', () => {
      const { getByTestId } = render(<Rating size="xs" testID="rating" />);
      expect(getByTestId('rating')).toBeTruthy();
    });

    it('should accept size "sm"', () => {
      const { getByTestId } = render(<Rating size="sm" testID="rating" />);
      expect(getByTestId('rating')).toBeTruthy();
    });

    it('should accept size "md"', () => {
      const { getByTestId } = render(<Rating size="md" testID="rating" />);
      expect(getByTestId('rating')).toBeTruthy();
    });

    it('should accept size "lg"', () => {
      const { getByTestId } = render(<Rating size="lg" testID="rating" />);
      expect(getByTestId('rating')).toBeTruthy();
    });

    it('should accept size "xl"', () => {
      const { getByTestId } = render(<Rating size="xl" testID="rating" />);
      expect(getByTestId('rating')).toBeTruthy();
    });

    it('should accept custom numeric size', () => {
      const { getByTestId } = render(<Rating size={32} testID="rating" />);
      expect(getByTestId('rating')).toBeTruthy();
    });
  });

  describe('Value Control - Uncontrolled', () => {
    it('should use defaultValue', () => {
      const { getByTestId } = render(<Rating defaultValue={3} testID="rating" />);
      const element = getByTestId('rating');
      expect(element.props.accessibilityValue.now).toBe(3);
    });

    it('should default to 0', () => {
      const { getByTestId } = render(<Rating testID="rating" />);
      const element = getByTestId('rating');
      expect(element.props.accessibilityValue.now).toBe(0);
    });
  });

  describe('Value Control - Controlled', () => {
    it('should accept controlled value', () => {
      const { getByTestId } = render(<Rating value={3} testID="rating" />);
      const element = getByTestId('rating');
      expect(element.props.accessibilityValue.now).toBe(3);
    });

    it('should update when value changes', () => {
      const { getByTestId, rerender } = render(<Rating value={2} testID="rating" />);
      let element = getByTestId('rating');
      expect(element.props.accessibilityValue.now).toBe(2);
      
      rerender(<Rating value={4} testID="rating" />);
      element = getByTestId('rating');
      expect(element.props.accessibilityValue.now).toBe(4);
    });
  });

  describe('Count Prop', () => {
    it('should accept count={3}', () => {
      const { getByTestId } = render(<Rating count={3} testID="rating" />);
      const element = getByTestId('rating');
      expect(element.props.accessibilityValue.max).toBe(3);
    });

    it('should accept count={7}', () => {
      const { getByTestId } = render(<Rating count={7} testID="rating" />);
      const element = getByTestId('rating');
      expect(element.props.accessibilityValue.max).toBe(7);
    });

    it('should default to count={5}', () => {
      const { getByTestId } = render(<Rating testID="rating" />);
      const element = getByTestId('rating');
      expect(element.props.accessibilityValue.max).toBe(5);
    });
  });

  describe('Color Props', () => {
    it('should accept color prop', () => {
      const { getByTestId } = render(<Rating color="#ff0000" testID="rating" />);
      expect(getByTestId('rating')).toBeTruthy();
    });

    it('should accept emptyColor prop', () => {
      const { getByTestId } = render(<Rating emptyColor="#cccccc" testID="rating" />);
      expect(getByTestId('rating')).toBeTruthy();
    });

    it('should accept hoverColor prop', () => {
      const { getByTestId } = render(<Rating hoverColor="#ff8800" testID="rating" />);
      expect(getByTestId('rating')).toBeTruthy();
    });

    it('should accept all color props together', () => {
      const { getByTestId } = render(
        <Rating color="#ff0000" emptyColor="#cccccc" hoverColor="#ff8800" testID="rating" />
      );
      expect(getByTestId('rating')).toBeTruthy();
    });
  });

  describe('ReadOnly Mode', () => {
    it('should accept readOnly prop', () => {
      const { getByTestId } = render(<Rating readOnly testID="rating" />);
      const element = getByTestId('rating');
      expect(element.props.accessibilityRole).toBe('text');
    });

    it('should default to interactive mode', () => {
      const { getByTestId } = render(<Rating testID="rating" />);
      const element = getByTestId('rating');
      expect(element.props.accessibilityRole).toBe('adjustable');
    });
  });

  describe('Fractional Ratings', () => {
    it('should accept allowFraction prop', () => {
      const { getByTestId } = render(<Rating allowFraction testID="rating" />);
      expect(getByTestId('rating')).toBeTruthy();
    });

    it('should accept allowHalf prop', () => {
      const { getByTestId } = render(<Rating allowHalf testID="rating" />);
      expect(getByTestId('rating')).toBeTruthy();
    });

    it('should accept precision prop', () => {
      const { getByTestId } = render(<Rating precision={0.5} testID="rating" />);
      expect(getByTestId('rating')).toBeTruthy();
    });

    it('should accept fractional value', () => {
      const { getByTestId } = render(<Rating value={3.5} allowFraction testID="rating" />);
      expect(getByTestId('rating')).toBeTruthy();
    });
  });

  describe('Change Handlers', () => {
    it('should accept onChange callback', () => {
      const onChange = jest.fn();
      const { getByTestId } = render(<Rating onChange={onChange} testID="rating" />);
      expect(getByTestId('rating')).toBeTruthy();
    });

    it('should accept onHover callback', () => {
      const onHover = jest.fn();
      const { getByTestId } = render(<Rating onHover={onHover} testID="rating" />);
      expect(getByTestId('rating')).toBeTruthy();
    });

    it('should accept both callbacks', () => {
      const onChange = jest.fn();
      const onHover = jest.fn();
      const { getByTestId } = render(
        <Rating onChange={onChange} onHover={onHover} testID="rating" />
      );
      expect(getByTestId('rating')).toBeTruthy();
    });
  });

  describe('Label Positioning', () => {
    it('should render with label string', () => {
      const { getByText } = render(<Rating label="Rate this" />);
      expect(getByText('Rate this')).toBeTruthy();
    });

    it('should accept labelPosition="above"', () => {
      const { getByText } = render(<Rating label="Above" labelPosition="above" />);
      expect(getByText('Above')).toBeTruthy();
    });

    it('should accept labelPosition="below"', () => {
      const { getByText } = render(<Rating label="Below" labelPosition="below" />);
      expect(getByText('Below')).toBeTruthy();
    });

    it('should accept labelPosition="left"', () => {
      const { getByText } = render(<Rating label="Left" labelPosition="left" />);
      expect(getByText('Left')).toBeTruthy();
    });

    it('should accept labelPosition="right"', () => {
      const { getByText } = render(<Rating label="Right" labelPosition="right" />);
      expect(getByText('Right')).toBeTruthy();
    });

    it('should accept labelGap', () => {
      const { getByText } = render(<Rating label="With Gap" labelGap="md" />);
      expect(getByText('With Gap')).toBeTruthy();
    });
  });

  describe('Custom Characters', () => {
    it('should accept custom character', () => {
      const { getByTestId } = render(<Rating character="♥" testID="rating" />);
      expect(getByTestId('rating')).toBeTruthy();
    });

    it('should accept custom emptyCharacter', () => {
      const { getByTestId } = render(<Rating emptyCharacter="♡" testID="rating" />);
      expect(getByTestId('rating')).toBeTruthy();
    });

    it('should accept both custom characters', () => {
      const { getByTestId } = render(<Rating character="♥" emptyCharacter="♡" testID="rating" />);
      expect(getByTestId('rating')).toBeTruthy();
    });
  });

  describe('Gap Sizing', () => {
    it('should accept gap as size token', () => {
      const { getByTestId } = render(<Rating gap="sm" testID="rating" />);
      expect(getByTestId('rating')).toBeTruthy();
    });

    it('should accept gap as number', () => {
      const { getByTestId } = render(<Rating gap={8} testID="rating" />);
      expect(getByTestId('rating')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have correct accessibilityRole for interactive', () => {
      const { getByTestId } = render(<Rating testID="rating" />);
      const element = getByTestId('rating');
      expect(element.props.accessibilityRole).toBe('adjustable');
    });

    it('should have correct accessibilityRole for readOnly', () => {
      const { getByTestId } = render(<Rating readOnly testID="rating" />);
      const element = getByTestId('rating');
      expect(element.props.accessibilityRole).toBe('text');
    });

    it('should accept custom accessibilityLabel', () => {
      const { getByTestId } = render(
        <Rating accessibilityLabel="Custom label" testID="rating" />
      );
      const element = getByTestId('rating');
      expect(element.props.accessibilityLabel).toBe('Custom label');
    });

    it('should have default accessibilityLabel', () => {
      const { getByTestId } = render(<Rating testID="rating" />);
      const element = getByTestId('rating');
      expect(element.props.accessibilityLabel).toContain('Rating');
    });

    it('should accept custom accessibilityHint', () => {
      const { getByTestId } = render(
        <Rating accessibilityHint="Custom hint" testID="rating" />
      );
      const element = getByTestId('rating');
      expect(element.props.accessibilityHint).toBe('Custom hint');
    });

    it('should have accessibilityValue', () => {
      const { getByTestId } = render(<Rating value={3} count={5} testID="rating" />);
      const element = getByTestId('rating');
      expect(element.props.accessibilityValue).toEqual({
        min: 0,
        max: 5,
        now: 3,
      });
    });
  });

  describe('Display Name', () => {
    it('should have correct displayName', () => {
      expect((Rating as any).displayName).toBe('Rating');
    });
  });

  describe('Ref Forwarding', () => {
    it('should forward ref to root View', () => {
      const ref = React.createRef<View>();
      render(<Rating ref={ref} />);
      expect(ref.current).toBeTruthy();
    });
  });

  describe('Additional Props', () => {
    it('should pass testID prop', () => {
      const { getByTestId } = render(<Rating testID="custom-rating" />);
      expect(getByTestId('custom-rating')).toBeTruthy();
    });

    it('should pass style prop', () => {
      const customStyle = { backgroundColor: '#f0f0f0' };
      const { getByTestId } = render(<Rating style={customStyle} testID="rating" />);
      const element = getByTestId('rating');
      expect(element.props.style).toContainEqual(customStyle);
    });
  });

  describe('Spacing Props', () => {
    it('should accept margin props', () => {
      const { getByTestId } = render(<Rating m="md" testID="rating" />);
      expect(getByTestId('rating')).toBeTruthy();
    });

    it('should accept padding props', () => {
      const { getByTestId } = render(<Rating p="sm" testID="rating" />);
      expect(getByTestId('rating')).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle count={1}', () => {
      const { getByTestId } = render(<Rating count={1} testID="rating" />);
      expect(getByTestId('rating')).toBeTruthy();
    });

    it('should handle value greater than count', () => {
      const { getByTestId } = render(<Rating value={10} count={5} testID="rating" />);
      expect(getByTestId('rating')).toBeTruthy();
    });

    it('should handle negative value', () => {
      const { getByTestId } = render(<Rating value={-1} testID="rating" />);
      expect(getByTestId('rating')).toBeTruthy();
    });

    it('should handle very small precision', () => {
      const { getByTestId } = render(<Rating precision={0.001} allowFraction testID="rating" />);
      expect(getByTestId('rating')).toBeTruthy();
    });
  });

  describe('TypeScript Type Safety', () => {
    it('should accept all valid props', () => {
      const element = (
        <Rating
          value={3.5}
          defaultValue={2}
          count={5}
          readOnly={false}
          allowFraction={true}
          precision={0.5}
          size="lg"
          color="#ff0000"
          emptyColor="#cccccc"
          hoverColor="#ff8800"
          onChange={(value) => console.log(value)}
          onHover={(value) => console.log(value)}
          character="♥"
          emptyCharacter="♡"
          gap="sm"
          style={{ margin: 10 }}
          testID="rating"
          accessibilityLabel="Rating"
          accessibilityHint="Adjust"
          label="Rate"
          labelPosition="above"
          labelGap="xs"
          m="md"
          p="sm"
        />
      );
      
      const { getByTestId } = render(element);
      expect(getByTestId('rating')).toBeTruthy();
    });
  });

  describe('Combined Scenarios', () => {
    it('should work with readOnly and value', () => {
      const { getByTestId } = render(<Rating value={4} readOnly testID="rating" />);
      const element = getByTestId('rating');
      expect(element.props.accessibilityRole).toBe('text');
      expect(element.props.accessibilityValue.now).toBe(4);
    });

    it('should work with label and custom count', () => {
      const { getByText, getByTestId } = render(
        <Rating label="Custom rating" count={7} testID="rating" />
      );
      expect(getByText('Custom rating')).toBeTruthy();
      const element = getByTestId('rating');
      expect(element.props.accessibilityValue.max).toBe(7);
    });

    it('should work with fractional value and custom size', () => {
      const { getByTestId } = render(
        <Rating value={3.7} allowFraction size={48} testID="rating" />
      );
      expect(getByTestId('rating')).toBeTruthy();
    });

    it('should work with all color props and label', () => {
      const { getByText, getByTestId } = render(
        <Rating
          color="#ff0000"
          emptyColor="#cccccc"
          hoverColor="#ff8800"
          label="Colorful"
          testID="rating"
        />
      );
      expect(getByText('Colorful')).toBeTruthy();
      expect(getByTestId('rating')).toBeTruthy();
    });
  });
});
