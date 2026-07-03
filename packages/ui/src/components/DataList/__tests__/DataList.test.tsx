/**
 * DataList Component - Test Suite
 *
 * Coverage:
 * - Composition rendering (Item / ItemLabel / ItemValue)
 * - `data` prop shorthand
 * - `label`/`value` shorthand on Item
 * - orientation, withDivider, size props
 * - Context guard (Item outside DataList throws)
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { DataList } from '../DataList';

jest.mock('../../../core/theme/ThemeProvider', () => ({
  useTheme: () => ({
    colors: {
      gray: ['#f8f9fa', '#f1f3f5', '#e9ecef', '#dee2e6', '#ced4da', '#adb5bd', '#868e96', '#495057', '#343a40', '#212529'],
      primary: ['#e7f5ff', '#d0ebff', '#a5d8ff', '#74c0fc', '#4dabf7', '#339af0', '#228be6', '#1c7ed6', '#1971c2', '#1864ab'],
    },
    text: { primary: '#212529', secondary: '#495057', muted: '#868e96' },
    backgrounds: { border: '#E5E5EA' },
  }),
}));

describe('DataList', () => {
  it('renders composed label/value pairs', () => {
    const { getByText } = render(
      <DataList>
        <DataList.Item>
          <DataList.ItemLabel>Name</DataList.ItemLabel>
          <DataList.ItemValue>John Doe</DataList.ItemValue>
        </DataList.Item>
      </DataList>
    );
    expect(getByText('Name')).toBeTruthy();
    expect(getByText('John Doe')).toBeTruthy();
  });

  it('renders items from the `data` shorthand', () => {
    const { getByText } = render(
      <DataList
        data={[
          { label: 'Email', value: 'john@example.com' },
          { label: 'Role', value: 'Engineer' },
        ]}
      />
    );
    expect(getByText('Email')).toBeTruthy();
    expect(getByText('john@example.com')).toBeTruthy();
    expect(getByText('Role')).toBeTruthy();
  });

  it('supports label/value shorthand on Item', () => {
    const { getByText } = render(
      <DataList>
        <DataList.Item label="Plan" value="Pro" />
      </DataList>
    );
    expect(getByText('Plan')).toBeTruthy();
    expect(getByText('Pro')).toBeTruthy();
  });

  it('renders vertical orientation with dividers without crashing', () => {
    const { getByText } = render(
      <DataList orientation="vertical" withDivider size="lg">
        <DataList.Item label="A" value="1" />
        <DataList.Item label="B" value="2" />
      </DataList>
    );
    expect(getByText('A')).toBeTruthy();
    expect(getByText('2')).toBeTruthy();
  });

  it('throws when Item is used outside DataList', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() =>
      render(<DataList.Item label="x" value="y" />)
    ).toThrow(/must be used within a DataList/);
    spy.mockRestore();
  });
});
