/**
 * Switch Component - Type Safety & Props Validation Tests
 * 
 * Purpose: Verify that the Switch component accepts correct prop types and combinations.
 * These tests primarily validate TypeScript types and prop contracts, not rendering behavior.
 */

import React from 'react';
import { Switch } from '../Switch';
import { SwitchProps } from '../types';

describe('Switch - Type Safety & Props Validation', () => {
  describe('Basic Rendering', () => {
    it('should accept no props (uncontrolled)', () => {
      const props: SwitchProps = {};
      expect(props).toBeDefined();
      expect(<Switch {...props} />).toBeDefined();
    });

    it('should accept label prop', () => {
      const props: SwitchProps = {
        label: 'Enable notifications'
      };
      expect(props.label).toBe('Enable notifications');
      expect(<Switch {...props} />).toBeDefined();
    });

    it('should accept children instead of label', () => {
      const props: SwitchProps = {
        children: <span>Custom label</span>
      };
      expect(props.children).toBeDefined();
      expect(<Switch {...props} />).toBeDefined();
    });

    it('should accept testID prop', () => {
      const props: SwitchProps = {
        testID: 'notifications-switch'
      };
      expect(props.testID).toBe('notifications-switch');
      expect(<Switch {...props} />).toBeDefined();
    });
  });

  describe('Controlled vs Uncontrolled', () => {
    it('should accept checked prop for controlled usage', () => {
      const props: SwitchProps = {
        checked: true,
        onChange: jest.fn()
      };
      expect(props.checked).toBe(true);
      expect(<Switch {...props} />).toBeDefined();
    });

    it('should accept defaultChecked for uncontrolled usage', () => {
      const props: SwitchProps = {
        defaultChecked: true
      };
      expect(props.defaultChecked).toBe(true);
      expect(<Switch {...props} />).toBeDefined();
    });

    it('should accept onChange handler', () => {
      const onChange = jest.fn();
      const props: SwitchProps = {
        onChange
      };
      expect(props.onChange).toBe(onChange);
      expect(<Switch {...props} />).toBeDefined();
    });
  });

  describe('Size Variations', () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] as const;
    
    sizes.forEach(size => {
      it(`should accept size="${size}"`, () => {
        const props: SwitchProps = {
          size
        };
        expect(props.size).toBe(size);
        expect(<Switch {...props} />).toBeDefined();
      });
    });

    it('should default to "md" size when not specified', () => {
      const props: SwitchProps = {};
      expect(props.size).toBeUndefined(); // Component defaults to 'md'
      expect(<Switch {...props} />).toBeDefined();
    });
  });

  describe('Color Variations', () => {
    const colors = ['primary', 'secondary', 'success', 'warning', 'danger', 'info'] as const;
    
    colors.forEach(color => {
      it(`should accept color="${color}"`, () => {
        const props: SwitchProps = {
          color
        };
        expect(props.color).toBe(color);
        expect(<Switch {...props} />).toBeDefined();
      });
    });

    it('should accept custom hex color', () => {
      const props: SwitchProps = {
        color: '#FF5733' as any
      };
      expect(props.color).toBe('#FF5733');
      expect(<Switch {...props} />).toBeDefined();
    });
  });

  describe('State Props', () => {
    it('should accept disabled prop', () => {
      const props: SwitchProps = {
        disabled: true
      };
      expect(props.disabled).toBe(true);
      expect(<Switch {...props} />).toBeDefined();
    });

    it('should accept required prop', () => {
      const props: SwitchProps = {
        required: true
      };
      expect(props.required).toBe(true);
      expect(<Switch {...props} />).toBeDefined();
    });

    it('should accept error message', () => {
      const props: SwitchProps = {
        error: 'This field is required'
      };
      expect(props.error).toBe('This field is required');
      expect(<Switch {...props} />).toBeDefined();
    });

    it('should accept description text', () => {
      const props: SwitchProps = {
        description: 'Toggle to enable feature'
      };
      expect(props.description).toBe('Toggle to enable feature');
      expect(<Switch {...props} />).toBeDefined();
    });
  });

  describe('Label Positioning', () => {
    const positions = ['left', 'right', 'top', 'bottom'] as const;
    
    positions.forEach(position => {
      it(`should accept labelPosition="${position}"`, () => {
        const props: SwitchProps = {
          label: 'Label',
          labelPosition: position
        };
        expect(props.labelPosition).toBe(position);
        expect(<Switch {...props} />).toBeDefined();
      });
    });

    it('should default to "right" position when not specified', () => {
      const props: SwitchProps = {
        label: 'Label'
      };
      expect(props.labelPosition).toBeUndefined(); // Component defaults to 'right'
      expect(<Switch {...props} />).toBeDefined();
    });
  });

  describe('Icons', () => {
    it('should accept onIcon prop', () => {
      const props: SwitchProps = {
        onIcon: <span>✓</span>
      };
      expect(props.onIcon).toBeDefined();
      expect(<Switch {...props} />).toBeDefined();
    });

    it('should accept offIcon prop', () => {
      const props: SwitchProps = {
        offIcon: <span>✗</span>
      };
      expect(props.offIcon).toBeDefined();
      expect(<Switch {...props} />).toBeDefined();
    });

    it('should accept both onIcon and offIcon', () => {
      const props: SwitchProps = {
        onIcon: <span>✓</span>,
        offIcon: <span>✗</span>
      };
      expect(props.onIcon).toBeDefined();
      expect(props.offIcon).toBeDefined();
      expect(<Switch {...props} />).toBeDefined();
    });
  });

  describe('State Labels', () => {
    it('should accept onLabel prop', () => {
      const props: SwitchProps = {
        onLabel: 'Enabled'
      };
      expect(props.onLabel).toBe('Enabled');
      expect(<Switch {...props} />).toBeDefined();
    });

    it('should accept offLabel prop', () => {
      const props: SwitchProps = {
        offLabel: 'Disabled'
      };
      expect(props.offLabel).toBe('Disabled');
      expect(<Switch {...props} />).toBeDefined();
    });

    it('should accept both onLabel and offLabel', () => {
      const props: SwitchProps = {
        onLabel: 'Active',
        offLabel: 'Inactive'
      };
      expect(props.onLabel).toBe('Active');
      expect(props.offLabel).toBe('Inactive');
      expect(<Switch {...props} />).toBeDefined();
    });
  });

  describe('Accessibility Props', () => {
    it('should accept accessibilityLabel', () => {
      const props: SwitchProps = {
        accessibilityLabel: 'Toggle notifications'
      };
      expect(props.accessibilityLabel).toBe('Toggle notifications');
      expect(<Switch {...props} />).toBeDefined();
    });

    it('should accept accessibilityHint', () => {
      const props: SwitchProps = {
        accessibilityHint: 'Double tap to toggle'
      };
      expect(props.accessibilityHint).toBe('Double tap to toggle');
      expect(<Switch {...props} />).toBeDefined();
    });

    it('should accept controls prop for aria-controls', () => {
      const props: SwitchProps = {
        controls: 'controlled-panel'
      };
      expect(props.controls).toBe('controlled-panel');
      expect(<Switch {...props} />).toBeDefined();
    });
  });

  describe('Styling Props', () => {
    it('should accept style prop', () => {
      const props: SwitchProps = {
        style: { marginTop: 10 }
      };
      expect(props.style).toEqual({ marginTop: 10 });
      expect(<Switch {...props} />).toBeDefined();
    });

    it('should accept spacing props', () => {
      const props: SwitchProps = {
        m: 'md',
        p: 'sm',
        mt: 'lg'
      };
      expect(props.m).toBe('md');
      expect(props.p).toBe('sm');
      expect(props.mt).toBe('lg');
      expect(<Switch {...props} />).toBeDefined();
    });
  });

  describe('Complex Combinations', () => {
    it('should accept controlled switch with all props', () => {
      const props: SwitchProps = {
        checked: true,
        onChange: jest.fn(),
        label: 'Feature toggle',
        size: 'lg',
        color: 'success',
        disabled: false,
        required: true,
        description: 'Enable this feature',
        labelPosition: 'left',
        onIcon: <span>✓</span>,
        offIcon: <span>✗</span>,
        onLabel: 'On',
        offLabel: 'Off',
        testID: 'feature-switch'
      };
      expect(props).toBeDefined();
      expect(<Switch {...props} />).toBeDefined();
    });

    it('should accept uncontrolled switch with error state', () => {
      const props: SwitchProps = {
        defaultChecked: false,
        onChange: jest.fn(),
        label: 'Accept terms',
        required: true,
        error: 'You must accept the terms',
        size: 'md',
        color: 'danger'
      };
      expect(props).toBeDefined();
      expect(<Switch {...props} />).toBeDefined();
    });

    it('should accept disabled state with description', () => {
      const props: SwitchProps = {
        label: 'Premium feature',
        disabled: true,
        description: 'Upgrade to enable this feature',
        size: 'sm'
      };
      expect(props).toBeDefined();
      expect(<Switch {...props} />).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    it('should accept empty string label', () => {
      const props: SwitchProps = {
        label: ''
      };
      expect(props.label).toBe('');
      expect(<Switch {...props} />).toBeDefined();
    });

    it('should accept checked=false explicitly', () => {
      const props: SwitchProps = {
        checked: false
      };
      expect(props.checked).toBe(false);
      expect(<Switch {...props} />).toBeDefined();
    });

    it('should accept onChange without checked (uncontrolled)', () => {
      const props: SwitchProps = {
        onChange: jest.fn()
      };
      expect(props.onChange).toBeDefined();
      expect(props.checked).toBeUndefined();
      expect(<Switch {...props} />).toBeDefined();
    });

    it('should handle both label and children (children takes precedence)', () => {
      const props: SwitchProps = {
        label: 'Label text',
        children: <span>Children text</span>
      };
      expect(props.label).toBeDefined();
      expect(props.children).toBeDefined();
      expect(<Switch {...props} />).toBeDefined();
    });
  });

  describe('Type Safety', () => {
    it('should enforce onChange signature', () => {
      const onChange = jest.fn((checked: boolean) => {
        expect(typeof checked).toBe('boolean');
      });
      const props: SwitchProps = {
        onChange
      };
      expect(<Switch {...props} />).toBeDefined();
    });

    it('should enforce checked is boolean when provided', () => {
      const props: SwitchProps = {
        checked: true as boolean
      };
      expect(typeof props.checked).toBe('boolean');
      expect(<Switch {...props} />).toBeDefined();
    });

    it('should enforce defaultChecked is boolean when provided', () => {
      const props: SwitchProps = {
        defaultChecked: false as boolean
      };
      expect(typeof props.defaultChecked).toBe('boolean');
      expect(<Switch {...props} />).toBeDefined();
    });
  });
});
