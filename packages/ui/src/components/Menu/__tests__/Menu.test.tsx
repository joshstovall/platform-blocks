import React from 'react';
import { Text } from 'react-native';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Menu, MenuDropdown, MenuItem } from '../Menu';

type OverlayCallConfig = Record<string, any>;

const mockTheme = {
  colorScheme: 'light',
  colors: {
    surface: ['#ffffff', '#f8f8f8', '#f0f0f0', '#e0e0e0', '#d0d0d0'],
    gray: ['#fafafa', '#f0f0f0', '#e0e0e0'],
    error: ['#fee', '#fcc', '#faa', '#f88', '#f66', '#f44', '#f22'],
    primary: ['#e6f0ff', '#cce0ff', '#99c2ff', '#66a3ff', '#3385ff', '#0066ff', '#0052cc', '#003d99'],
    success: ['#e6f9f0', '#ccf3e1', '#99e7c3', '#66dca5', '#33d087', '#00c469', '#009853', '#006c3a'],
    warning: ['#fff9e6', '#fff3cc', '#ffe699', '#ffd966', '#ffcc33', '#ffbf00', '#cc9900', '#996b00'],
  },
  backgrounds: {
    surface: '#ffffff',
    base: '#fdfdfd',
    elevated: '#f2f2f2',
  },
  text: {
    primary: '#111111',
    onPrimary: '#ffffff',
    disabled: '#999999',
  },
  radii: {
    sm: 6,
    md: 10,
  },
};

const mockOpenOverlay = jest.fn<string, [OverlayCallConfig]>(() => 'overlay-1');
const mockCloseOverlay = jest.fn();
const mockUpdateOverlay = jest.fn();

const mockMeasureElement = jest.fn().mockResolvedValue({
  x: 20,
  y: 30,
  width: 120,
  height: 40,
});

const mockCalculateOverlay = jest.fn().mockReturnValue({
  x: 24,
  y: 70,
});

jest.mock('../../../core/theme', () => ({
  useTheme: () => mockTheme,
}));

jest.mock('../../../core/providers/OverlayProvider', () => ({
  useOverlay: () => ({
    openOverlay: mockOpenOverlay,
    closeOverlay: mockCloseOverlay,
    updateOverlay: mockUpdateOverlay,
    overlays: [],
  }),
}));

jest.mock('../../../core/utils/positioning-enhanced', () => ({
  measureElement: (...args: any[]) => mockMeasureElement(...args),
  calculateOverlayPositionEnhanced: (...args: any[]) => mockCalculateOverlay(...args),
}));

describe('Menu - behavior', () => {
  let consoleSpy: jest.SpyInstance;

  beforeAll(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderMenu = (extraProps: Partial<React.ComponentProps<typeof Menu>> = {}) => (
    <Menu {...extraProps}>
      <Text>Open Menu</Text>
      <MenuDropdown>
        <MenuItem testID="menu-edit">Edit</MenuItem>
        <MenuItem testID="menu-delete">Delete</MenuItem>
      </MenuDropdown>
    </Menu>
  );

  it('opens an overlay when the trigger is pressed', async () => {
    const { getByText } = render(renderMenu());

    fireEvent.press(getByText('Open Menu'));

    await waitFor(() => {
      expect(mockOpenOverlay).toHaveBeenCalledTimes(1);
    });

    expect(mockMeasureElement).toHaveBeenCalled();
    const firstCall = mockOpenOverlay.mock.calls[0];
    expect(firstCall).toBeDefined();
    const overlayConfig = firstCall![0] as OverlayCallConfig;
    expect(overlayConfig.closeOnClickOutside).toBe(true);
    expect(overlayConfig.content).toBeTruthy();
  });

  it('invokes the item handler and closes the menu', async () => {
    const onDelete = jest.fn();
    const { getByText } = render(
      <Menu>
        <Text>Open Menu</Text>
        <MenuDropdown>
          <MenuItem>Edit</MenuItem>
          <MenuItem onPress={onDelete}>Delete</MenuItem>
        </MenuDropdown>
      </Menu>
    );

    fireEvent.press(getByText('Open Menu'));

    await waitFor(() => {
      expect(mockOpenOverlay).toHaveBeenCalledTimes(1);
    });

    const itemCall = mockOpenOverlay.mock.calls[0];
    expect(itemCall).toBeDefined();
    const overlayConfig = itemCall![0] as OverlayCallConfig;
    expect(overlayConfig.content).toBeTruthy();
    const overlayRender = render(overlayConfig.content);

    fireEvent.press(overlayRender.getByText('Delete'));

    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(mockCloseOverlay).toHaveBeenCalledWith('overlay-1');
  });

  it('does not open when disabled', async () => {
    const { getByText } = render(renderMenu({ disabled: true }));

    fireEvent.press(getByText('Open Menu'));

    await waitFor(() => {
      expect(mockOpenOverlay).not.toHaveBeenCalled();
    });
  });
});
