import React from 'react';
import { render } from '@testing-library/react-native';
import { BrandButton } from '../BrandButton';

const buttonPropsLog: Array<Record<string, any>> = [];
const brandIconPropsLog: Array<Record<string, any>> = [];
const mockShouldHideComponent = jest.fn<boolean, [Record<string, any>, 'light' | 'dark']>(
  (_props, _scheme) => false
);
const mockExtractUniversalProps = jest.fn((props: any) => {
  const { lightHidden, darkHidden, hiddenFrom, visibleFrom, ...rest } = props;
  return {
    universalProps: { lightHidden, darkHidden, hiddenFrom, visibleFrom },
    componentProps: rest,
  };
});

jest.mock('../../Button', () => {
  const React = require('react');
  return {
    Button: (props: any) => {
      const { children, ...rest } = props;
      buttonPropsLog.push(rest);
      return React.createElement(React.Fragment, null, props.startIcon, children, props.endIcon);
    },
  };
});

jest.mock('../../BrandIcon', () => {
  const React = require('react');
  return {
    BrandIcon: (props: any) => {
      brandIconPropsLog.push(props);
      return React.createElement('BrandIcon', props);
    },
  };
});

jest.mock('../../../core/utils/universalSimple', () => ({
  shouldHideComponent: (props: any, scheme: 'light' | 'dark') =>
    mockShouldHideComponent(props, scheme),
  extractUniversalProps: (props: any) => mockExtractUniversalProps(props),
}));

jest.mock('../../../core/theme', () => ({
  useTheme: () => ({
    colorScheme: 'light',
    text: {
      primary: '#111111',
    },
  }),
}));

describe('BrandButton', () => {
  beforeEach(() => {
    buttonPropsLog.length = 0;
    brandIconPropsLog.length = 0;
    mockShouldHideComponent.mockClear();
    mockExtractUniversalProps.mockClear();
  });

  it('renders a plain brand button with a leading BrandIcon by default', () => {
    render(<BrandButton brand="google" title="Continue" />);

    expect(buttonPropsLog).toHaveLength(1);
    const props = buttonPropsLog[0];
    expect(props.variant).toBe('plain');
    expect(props.startIcon).toBeTruthy();
    expect(props.endIcon).toBeUndefined();
    expect(props.style[0]).toMatchObject({ backgroundColor: 'white', borderColor: 'transparent' });
    expect(brandIconPropsLog[0]).toMatchObject({ brand: 'google', size: 'md', variant: 'full' });
  });

  it('maps primary variant to filled and applies brand colors', () => {
    render(<BrandButton brand="google" title="Sign in" variant={'primary' as any} />);

    const props = buttonPropsLog[0];
    expect(props.variant).toBe('filled');
    expect(props.textColor).toBe('#FFFFFF');
    expect(props.style[0]).toMatchObject({ backgroundColor: '#4285F4', borderColor: '#4285F4' });
  });

  it('places the icon on the right when iconPosition is set', () => {
    render(<BrandButton brand="google" title="Continue" iconPosition="right" />);

    const props = buttonPropsLog[0];
    expect(props.startIcon).toBeUndefined();
    expect(props.endIcon).toBeTruthy();
  });

  it('returns null when universal props hide the component', () => {
    mockShouldHideComponent.mockReturnValueOnce(true);
    const { toJSON } = render(<BrandButton brand="google" title="Hidden" lightHidden />);

    expect(toJSON()).toBeNull();
    expect(buttonPropsLog).toHaveLength(0);
    expect(mockShouldHideComponent).toHaveBeenCalledWith(
      expect.objectContaining({ lightHidden: true }),
      'light'
    );
  });

  it('uses a custom icon when provided', () => {
    const customIcon = React.createElement('CustomIcon', { testID: 'custom-icon' });
    render(<BrandButton brand="google" title="Continue" icon={customIcon} />);

    const props = buttonPropsLog[0];
    expect(props.startIcon.props.testID).toBe('custom-icon');
  });

  it('derives outline styles and text color from brand colors', () => {
    render(<BrandButton brand="google" title="Outline" variant="outline" />);

    const props = buttonPropsLog[0];
    expect(props.textColor).toBe('#4285F4');
    expect(props.style[0]).toMatchObject({ backgroundColor: 'transparent', borderColor: '#4285F4' });
  });
});
