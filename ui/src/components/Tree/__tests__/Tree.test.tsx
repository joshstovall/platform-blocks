/**
 * Tree component behavioral tests
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

import { Tree } from '../Tree';
import type { TreeNode } from '../types';

jest.mock('../../../core/theme', () => ({
  useTheme: () => ({
    colorScheme: 'light',
    colors: {
      primary: [
        '#E6F3FF',
        '#CCE7FF',
        '#99CFFF',
        '#66B7FF',
        '#339FFF',
        '#2684FF',
        '#1A5FDB',
        '#12408C',
        '#0B2C61',
        '#071F45'
      ],
      gray: [
        '#F2F2F7',
        '#E5E5EA',
        '#D1D1D6',
        '#C7C7CC',
        '#AEAEB2',
        '#8E8E93',
        '#6D6D70',
        '#48484A',
        '#3A3A3C',
        '#1C1C1E'
      ],
      textPrimary: '#1C1C1E'
    },
    text: {
      primary: '#1C1C1E',
      secondary: '#6D6D70',
      muted: '#AEAEB2',
      disabled: '#C7C7CC'
    }
  })
}));

jest.mock('../../Icon', () => {
  const React = require('react');
  const { View } = require('react-native');

  const MockIcon = ({ name }: { name: string }) =>
    React.createElement(View, { accessibilityLabel: `icon-${name}` });

  return { Icon: MockIcon };
});

jest.mock('../../Checkbox', () => {
  const React = require('react');
  const { Pressable, Text } = require('react-native');

  const MockCheckbox = ({ onChange, checked }: { onChange: () => void; checked: boolean }) => (
    React.createElement(
      Pressable,
      { onPress: onChange, testID: 'tree-checkbox' },
      React.createElement(Text, null, checked ? 'checked' : 'unchecked')
    )
  );

  return { Checkbox: MockCheckbox };
});

const basicTree: TreeNode[] = [
  {
    id: 'root',
    label: 'Root Folder',
    children: [
      {
        id: 'child-1',
        label: 'Child Node'
      }
    ]
  }
];

describe('Tree component', () => {
  it('expands and collapses branches with the disclosure control', () => {
    const { queryByText, getByLabelText } = render(<Tree data={basicTree} />);

    expect(queryByText('Child Node')).toBeNull();
    fireEvent.press(getByLabelText('Expand'));

    expect(queryByText('Child Node')).not.toBeNull();
    expect(getByLabelText('Collapse')).toBeTruthy();

    fireEvent.press(getByLabelText('Collapse'));
    expect(getByLabelText('Expand')).toBeTruthy();
  });

  it('invokes onSelectionChange when a node is pressed in single-selection mode', () => {
    const onSelectionChange = jest.fn();
    const { getByLabelText } = render(
      <Tree data={basicTree} selectionMode="single" onSelectionChange={onSelectionChange} />
    );

    fireEvent.press(getByLabelText('Root Folder'));

    expect(onSelectionChange).toHaveBeenCalledWith(
      ['root'],
      expect.objectContaining({ id: 'root', label: 'Root Folder' })
    );
  });

  it('calls onCheckedChange when a checkbox is toggled', () => {
    const onCheckedChange = jest.fn();
    const checkboxTree: TreeNode[] = [
      {
        id: 'folder',
        label: 'Folder',
        startOpen: true,
        children: [
          {
            id: 'leaf',
            label: 'Leaf'
          }
        ]
      }
    ];

    const { getAllByTestId } = render(
      <Tree data={checkboxTree} checkboxes onCheckedChange={onCheckedChange} />
    );

    const [, leafCheckbox] = getAllByTestId('tree-checkbox');
    fireEvent.press(leafCheckbox);

    expect(onCheckedChange).toHaveBeenCalledWith(
      expect.arrayContaining(['leaf']),
      expect.objectContaining({ id: 'leaf' })
    );
  });
});
