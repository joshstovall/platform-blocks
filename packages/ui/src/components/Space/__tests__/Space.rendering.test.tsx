import React from 'react';
import { render } from '@testing-library/react-native';
import { Space } from '../Space';

describe('Space - rendering', () => {
  it('matches snapshot for the default spacer', () => {
    const tree = render(<Space testID="space-default" />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('matches snapshot for a horizontal spacer with custom styling', () => {
    const tree = render(
      <Space
        w="lg"
        style={{ backgroundColor: '#f0f0f0', borderRadius: 4 }}
        testID="space-horizontal"
      />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
