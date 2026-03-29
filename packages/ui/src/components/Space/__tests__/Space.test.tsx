import React from 'react';
import { render } from '@testing-library/react-native';
import { Space } from '../Space';
import { getSpacing } from '../../../core/theme/sizes';

const extractStyles = (node: any) => {
  const styleArray = Array.isArray(node.props.style) ? node.props.style : [node.props.style];
  return styleArray.filter(Boolean);
};

describe('Space - behavior', () => {
  it('falls back to the configured size when no explicit dimensions are provided', () => {
    const { getByTestId } = render(<Space testID="space-default" />);
    const [spacerStyle] = extractStyles(getByTestId('space-default'));

    expect(spacerStyle.height).toBe(getSpacing('md'));
    expect(spacerStyle.width).toBeUndefined();
    expect(spacerStyle.flexShrink).toBe(0);
  });

  it('uses the provided size token as the fallback dimension', () => {
    const { getByTestId } = render(<Space size="xl" testID="space-custom-size" />);
    const [spacerStyle] = extractStyles(getByTestId('space-custom-size'));

    expect(spacerStyle.height).toBe(getSpacing('xl'));
  });

  it('resolves width tokens without applying the fallback height', () => {
    const { getByTestId } = render(<Space w="lg" testID="space-width" />);
    const [spacerStyle] = extractStyles(getByTestId('space-width'));

    expect(spacerStyle.width).toBe(getSpacing('lg'));
    expect(spacerStyle.height).toBeUndefined();
  });

  it('supports numeric height values and ignores size fallback', () => {
    const { getByTestId } = render(<Space h={28} size="xl" testID="space-height" />);
    const [spacerStyle] = extractStyles(getByTestId('space-height'));

    expect(spacerStyle.height).toBe(28);
    expect(spacerStyle.width).toBeUndefined();
  });

  it('forwards view props and merges custom styles', () => {
    const customStyle = { backgroundColor: '#cccccc' };
    const { getByTestId } = render(
      <Space
        testID="space-accessibility"
        accessibilityRole="none"
        accessibilityLabel="Gap"
        accessible
        style={customStyle}
      />
    );

    const node = getByTestId('space-accessibility');
    const styles = extractStyles(node);

    expect(styles[1]).toBe(customStyle);
    expect(node.props.accessibilityRole).toBe('none');
    expect(node.props.accessibilityLabel).toBe('Gap');
    expect(node.props.accessible).toBe(true);
  });
});
