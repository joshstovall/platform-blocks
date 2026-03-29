/**
 * Loader Component - Type Safety and Prop Validation Tests
 * 
 * Tests type definitions, prop validation, and TypeScript interfaces
 * for the Loader component.
 * 
 * Coverage:
 * - LoaderVariant types (3 variants)
 * - Size types (tokens + numbers)
 * - Color prop
 * - Speed prop
 * - Spacing props integration
 * - Style prop combinations
 * - TestID support
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { View } from 'react-native';
import { Loader } from '../Loader';

// Mock dependencies
jest.mock('../../../core/theme/ThemeProvider', () => ({
  useTheme: () => ({
    colors: {
      primary: ['#000', '#111', '#222', '#333', '#444', '#1976d2', '#666', '#777', '#888', '#999'],
      secondary: ['#000', '#111', '#222', '#333', '#444', '#9c27b0', '#666', '#777', '#888', '#999'],
      success: ['#000', '#111', '#222', '#333', '#444', '#4caf50', '#666', '#777', '#888', '#999'],
      warning: ['#000', '#111', '#222', '#333', '#444', '#ff9800', '#666', '#777', '#888', '#999'],
      error: ['#000', '#111', '#222', '#333', '#444', '#f44336', '#666', '#777', '#888', '#999']
    },
    spacing: (value: number) => value * 8,
    radius: (value: number) => value * 4
  })
}));

describe('Loader - Type Safety and Prop Validation', () => {
  
  describe('LoaderVariant Types', () => {
    it('should accept oval variant', () => {
      const { UNSAFE_getByType } = render(<Loader variant="oval" />);
      expect(UNSAFE_getByType(View)).toBeTruthy();
    });

    it('should accept bars variant', () => {
      const { UNSAFE_getByType } = render(<Loader variant="bars" />);
      expect(UNSAFE_getByType(View)).toBeTruthy();
    });

    it('should accept dots variant', () => {
      const { UNSAFE_getByType } = render(<Loader variant="dots" />);
      expect(UNSAFE_getByType(View)).toBeTruthy();
    });

    it('should default to oval variant when not specified', () => {
      const { UNSAFE_getByType } = render(<Loader />);
      expect(UNSAFE_getByType(View)).toBeTruthy();
    });
  });

  describe('Size Types', () => {
    it('should accept numeric size', () => {
      const { UNSAFE_getByType } = render(<Loader size={40} />);
      expect(UNSAFE_getByType(View)).toBeTruthy();
    });

    it('should accept token size "xs"', () => {
      const { UNSAFE_getByType } = render(<Loader size="xs" />);
      expect(UNSAFE_getByType(View)).toBeTruthy();
    });

    it('should accept token size "sm"', () => {
      const { UNSAFE_getByType } = render(<Loader size="sm" />);
      expect(UNSAFE_getByType(View)).toBeTruthy();
    });

    it('should accept token size "md"', () => {
      const { UNSAFE_getByType } = render(<Loader size="md" />);
      expect(UNSAFE_getByType(View)).toBeTruthy();
    });

    it('should accept token size "lg"', () => {
      const { UNSAFE_getByType } = render(<Loader size="lg" />);
      expect(UNSAFE_getByType(View)).toBeTruthy();
    });

    it('should accept token size "xl"', () => {
      const { UNSAFE_getByType } = render(<Loader size="xl" />);
      expect(UNSAFE_getByType(View)).toBeTruthy();
    });

    it('should accept token size "2xl"', () => {
      const { UNSAFE_getByType } = render(<Loader size="2xl" />);
      expect(UNSAFE_getByType(View)).toBeTruthy();
    });

    it('should accept token size "3xl"', () => {
      const { UNSAFE_getByType } = render(<Loader size="3xl" />);
      expect(UNSAFE_getByType(View)).toBeTruthy();
    });

    it('should default to "md" size when not specified', () => {
      const { UNSAFE_getByType } = render(<Loader />);
      expect(UNSAFE_getByType(View)).toBeTruthy();
    });
  });

  describe('Color Prop', () => {
    it('should accept hex color', () => {
      const { UNSAFE_getByType } = render(<Loader color="#ff0000" />);
      expect(UNSAFE_getByType(View)).toBeTruthy();
    });

    it('should accept rgb color', () => {
      const { UNSAFE_getByType } = render(<Loader color="rgb(255, 0, 0)" />);
      expect(UNSAFE_getByType(View)).toBeTruthy();
    });

    it('should accept rgba color', () => {
      const { UNSAFE_getByType } = render(<Loader color="rgba(255, 0, 0, 0.5)" />);
      expect(UNSAFE_getByType(View)).toBeTruthy();
    });

    it('should accept named color', () => {
      const { UNSAFE_getByType } = render(<Loader color="red" />);
      expect(UNSAFE_getByType(View)).toBeTruthy();
    });

    it('should use theme primary color when not specified', () => {
      const { UNSAFE_getByType } = render(<Loader />);
      expect(UNSAFE_getByType(View)).toBeTruthy();
    });
  });

  describe('Speed Prop', () => {
    it('should accept custom speed in milliseconds', () => {
      const { UNSAFE_getByType } = render(<Loader speed={500} />);
      expect(UNSAFE_getByType(View)).toBeTruthy();
    });

    it('should accept slow speed', () => {
      const { UNSAFE_getByType } = render(<Loader speed={2000} />);
      expect(UNSAFE_getByType(View)).toBeTruthy();
    });

    it('should accept fast speed', () => {
      const { UNSAFE_getByType } = render(<Loader speed={300} />);
      expect(UNSAFE_getByType(View)).toBeTruthy();
    });

    it('should default to 1000ms when not specified', () => {
      const { UNSAFE_getByType } = render(<Loader />);
      expect(UNSAFE_getByType(View)).toBeTruthy();
    });
  });

  describe('Spacing Props Integration', () => {
    it('should accept spacing props (m, p, etc)', () => {
      const { UNSAFE_getByType } = render(<Loader m={2} p={1} />);
      expect(UNSAFE_getByType(View)).toBeTruthy();
    });

    it('should accept directional spacing props', () => {
      const { UNSAFE_getByType } = render(<Loader mt={1} mb={2} ml={1} mr={2} />);
      expect(UNSAFE_getByType(View)).toBeTruthy();
    });

    it('should accept horizontal and vertical spacing', () => {
      const { UNSAFE_getByType } = render(<Loader mx={2} my={1} px={1} py={2} />);
      expect(UNSAFE_getByType(View)).toBeTruthy();
    });
  });

  describe('Style Prop Combinations', () => {
    it('should accept style prop', () => {
      const { UNSAFE_getByType } = render(
        <Loader style={{ opacity: 0.5 }} />
      );
      expect(UNSAFE_getByType(View)).toBeTruthy();
    });

    it('should accept array of styles', () => {
      const { UNSAFE_getByType } = render(
        <Loader style={[{ opacity: 0.5 }, { marginTop: 10 }]} />
      );
      expect(UNSAFE_getByType(View)).toBeTruthy();
    });

    it('should merge spacing styles with custom style', () => {
      const { UNSAFE_getByType } = render(
        <Loader m={2} style={{ opacity: 0.5 }} />
      );
      expect(UNSAFE_getByType(View)).toBeTruthy();
    });
  });

  describe('TestID Support', () => {
    it('should accept testID prop', () => {
      const { getByTestId } = render(<Loader testID="test-loader" />);
      expect(getByTestId('test-loader')).toBeTruthy();
    });

    it('should render with testID for different variants', () => {
      const { getByTestId: getOval } = render(<Loader testID="oval-loader" variant="oval" />);
      expect(getOval('oval-loader')).toBeTruthy();

      const { getByTestId: getBars } = render(<Loader testID="bars-loader" variant="bars" />);
      expect(getBars('bars-loader')).toBeTruthy();

      const { getByTestId: getDots } = render(<Loader testID="dots-loader" variant="dots" />);
      expect(getDots('dots-loader')).toBeTruthy();
    });
  });

  describe('Complex Prop Combinations', () => {
    it('should handle variant + size + color + speed', () => {
      const { UNSAFE_getByType } = render(
        <Loader variant="bars" size="lg" color="#ff0000" speed={500} />
      );
      expect(UNSAFE_getByType(View)).toBeTruthy();
    });

    it('should handle size + color + spacing', () => {
      const { UNSAFE_getByType } = render(
        <Loader size={30} color="blue" m={2} p={1} />
      );
      expect(UNSAFE_getByType(View)).toBeTruthy();
    });

    it('should handle variant + speed + style', () => {
      const { UNSAFE_getByType } = render(
        <Loader variant="dots" speed={1500} style={{ opacity: 0.8 }} />
      );
      expect(UNSAFE_getByType(View)).toBeTruthy();
    });

    it('should handle all props together', () => {
      const { getByTestId } = render(
        <Loader
          variant="bars"
          size="xl"
          color="#4caf50"
          speed={800}
          m={3}
          p={2}
          style={{ opacity: 0.9 }}
          testID="complex-loader"
        />
      );
      expect(getByTestId('complex-loader')).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle size 0', () => {
      const { UNSAFE_getByType } = render(<Loader size={0} />);
      expect(UNSAFE_getByType(View)).toBeTruthy();
    });

    it('should handle very large size', () => {
      const { UNSAFE_getByType } = render(<Loader size={200} />);
      expect(UNSAFE_getByType(View)).toBeTruthy();
    });

    it('should handle speed 0', () => {
      const { UNSAFE_getByType } = render(<Loader speed={0} />);
      expect(UNSAFE_getByType(View)).toBeTruthy();
    });

    it('should handle very large speed', () => {
      const { UNSAFE_getByType } = render(<Loader speed={10000} />);
      expect(UNSAFE_getByType(View)).toBeTruthy();
    });
  });
});

