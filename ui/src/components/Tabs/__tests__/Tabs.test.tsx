import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text, StyleSheet } from 'react-native';

import { Tabs } from '../Tabs';

jest.mock('../../../core/providers/DirectionProvider', () => ({
  useDirection: () => ({
    dir: 'ltr',
    isRTL: false,
    setDirection: jest.fn(),
    toggleDirection: jest.fn(),
  }),
}));

describe('Tabs', () => {
  const createItems = (examplesCount = 6) => ([
    {
      key: 'examples',
      label: `Examples (${examplesCount})`,
      content: <Text>Examples content</Text>,
    },
    {
      key: 'properties',
      label: 'Properties (21)',
      content: <Text>Properties content</Text>,
    },
  ]);

  const emitLayout = (
    node: any,
    layout: { x: number; y: number; width: number; height: number }
  ) => {
    fireEvent(node, 'layout', { nativeEvent: { layout } });
  };

  it('calls onTabChange when a new tab is pressed', () => {
    const onTabChange = jest.fn();
    const { getAllByRole } = render(
      <Tabs items={createItems()} onTabChange={onTabChange} />
    );

    const tabs = getAllByRole('tab');
    fireEvent.press(tabs[1]);

    expect(onTabChange).toHaveBeenCalledWith('properties');
  });

  it('invokes onDisabledTabPress instead of onTabChange for disabled tabs', () => {
    const onTabChange = jest.fn();
    const onDisabled = jest.fn();
    const items = [
      { key: 'examples', label: 'Examples', content: <Text>Examples</Text> },
      { key: 'blocked', label: 'Blocked', disabled: true, content: <Text>Blocked</Text> },
    ];

    const { getAllByRole } = render(
      <Tabs items={items} onTabChange={onTabChange} onDisabledTabPress={onDisabled} />
    );

    const tabs = getAllByRole('tab');
    fireEvent.press(tabs[1]);

    expect(onTabChange).not.toHaveBeenCalled();
    expect(onDisabled).toHaveBeenCalledWith('blocked', expect.objectContaining({ key: 'blocked' }));
  });

  it('recalculates chip indicator position when preceding labels change size', () => {
    const { getAllByRole, getByTestId, rerender } = render(
      <Tabs variant="chip" items={createItems(6)} />
    );

    const measureTabs = (examplesWidth: number, propertiesX: number) => {
      const [examplesTab, propertiesTab] = getAllByRole('tab');
      emitLayout(examplesTab, { x: 0, y: 0, width: examplesWidth, height: 44 });
      emitLayout(propertiesTab, { x: propertiesX, y: 0, width: 160, height: 44 });
      return propertiesTab;
    };

    const propertiesTab = measureTabs(120, 120);
    fireEvent.press(propertiesTab);

    const indicatorBefore = StyleSheet.flatten(getByTestId('tabs-indicator').props.style);
    expect(indicatorBefore.left).toBe(120);

    rerender(<Tabs variant="chip" items={createItems(12)} />);
    measureTabs(150, 150);

    const indicatorAfter = StyleSheet.flatten(getByTestId('tabs-indicator').props.style);
    expect(indicatorAfter.left).toBe(150);
  });
});
