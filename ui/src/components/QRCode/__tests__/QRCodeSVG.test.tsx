import React from 'react';
import { View } from 'react-native';
import { render } from '@testing-library/react-native';

import { QRCodeSVG } from '../QRCodeSVG';

const mockEncode = jest.fn();
const mockBuildMatrix = jest.fn();
const mockSvgElements: Array<{ name: string; props: any }> = [];

jest.mock('../core/encoder', () => ({
  encode: (...args: any[]) => mockEncode(...args),
}));

jest.mock('../core/buildMatrix', () => ({
  buildMatrix: (...args: any[]) => mockBuildMatrix(...args),
}));

const mockTheme = {
  colors: {
    gray: ['#f5f5f5', '#e5e5e5', '#d5d5d5', '#c5c5c5'],
  },
};

jest.mock('../../../core/theme', () => ({
  useTheme: () => mockTheme,
}));

jest.mock('react-native-svg', () => {
  const React = require('react');
  const { View } = require('react-native');

  const createSvgComponent = (name: string) => {
    const Component = ({ children, ...props }: any) => {
      mockSvgElements.push({ name, props });
      return React.createElement(View, props, children);
    };
    return Component;
  };

  return {
    __esModule: true,
    default: createSvgComponent('Svg'),
    Path: createSvgComponent('Path'),
    Rect: createSvgComponent('Rect'),
    Defs: createSvgComponent('Defs'),
    LinearGradient: createSvgComponent('LinearGradient'),
    Stop: createSvgComponent('Stop'),
    RadialGradient: createSvgComponent('RadialGradient'),
    ClipPath: createSvgComponent('ClipPath'),
  };
});

const buildMatrixWithDataModules = () => {
  // 9x9 matrix with data outside finder patterns
  return Array.from({ length: 9 }, (_, r) => (
    Array.from({ length: 9 }, (_, c) => (r === c || (r === 8 && c === 4) ? 1 : 0))
  ));
};

const getSvgElementsByName = (name: string) => mockSvgElements.filter(el => el.name === name);

describe('QRCodeSVG', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSvgElements.length = 0;
    mockEncode.mockReturnValue({ segments: [] });
    mockBuildMatrix.mockReturnValue(buildMatrixWithDataModules());
  });

  it('renders square modules path with provided color when no gradient is set', () => {
    render(<QRCodeSVG value="hello" size={120} color="#112233" testID="qr" quietZone={0} />);

    const paths = getSvgElementsByName('Path');
    expect(paths.length).toBeGreaterThan(0);
    expect(paths[0].props.fill).toBe('#112233');
  });

  it('applies linear gradient fills when gradient type is linear', () => {
    render(
      <QRCodeSVG
        value="gradient"
        gradient={{ type: 'linear', from: '#000000', to: '#ffffff', rotation: 90 }}
      />
    );

    const gradients = getSvgElementsByName('LinearGradient');
    expect(gradients.length).toBe(1);

    const paths = getSvgElementsByName('Path');
    expect(paths[0].props.fill).toBe('url(#qrGradient)');
  });

  it('applies radial gradients when gradient type is radial', () => {
    render(
      <QRCodeSVG
        value="radial"
        gradient={{ type: 'radial', from: '#ff0000', to: '#00ff00' }}
      />
    );

    const gradients = getSvgElementsByName('RadialGradient');
    expect(gradients.length).toBe(1);

    const paths = getSvgElementsByName('Path');
    expect(paths[0].props.fill).toBe('url(#qrGradient)');
  });

  it('renders additional module paths when moduleShape is diamond', () => {
    render(
      <QRCodeSVG
        value="diamond"
        moduleShape="diamond"
        quietZone={0}
      />
    );

    const paths = getSvgElementsByName('Path');
    expect(paths.length).toBeGreaterThan(1);
  });

  it('renders a custom logo element overlay when provided', () => {
    const { getByTestId } = render(
      <QRCodeSVG
        value="logo"
        logo={{ uri: 'https://example.com/logo.png', element: <View testID="custom-logo" />, size: 32 }}
      />
    );

    expect(getByTestId('custom-logo')).toBeTruthy();
  });

  it('renders fallback error view and notifies onError when encoding fails', () => {
    const onError = jest.fn();

    const { getByText } = render(<QRCodeSVG value=" " onError={onError} />);

    expect(onError).toHaveBeenCalled();
    expect(mockEncode).not.toHaveBeenCalled();
    expect(getByText(/Generation\s+Error/)).toBeTruthy();
    expect(mockSvgElements.length).toBe(0);
  });
});
