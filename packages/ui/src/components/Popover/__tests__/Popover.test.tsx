import React from 'react';
import { Text } from 'react-native';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Popover } from '../Popover';

const StableDropdown = React.memo(Popover.Dropdown as React.ComponentType<any>, () => true);
(Popover as any).Dropdown = StableDropdown;

const palette = ['#111111', '#222222', '#333333', '#444444', '#555555', '#666666', '#777777', '#888888', '#999999', '#aaaaaa'];
const mockTheme = {
  colors: {
    primary: palette,
    gray: palette,
    success: palette,
    warning: palette,
    error: palette,
  },
  text: {
    primary: '#121212',
  },
  backgrounds: {
    surface: '#ffffff',
    border: '#e0e0e0',
  },
  shadows: {
    sm: '0 1px 2px rgba(0,0,0,0.1)',
    md: '0 2px 6px rgba(0,0,0,0.15)',
  },
};

const mockShowOverlay = jest.fn();
const mockHideOverlay = jest.fn();
const mockUpdatePosition = jest.fn();
const mockAnchorRef = { current: null } as React.MutableRefObject<any>;
const mockPopoverRef = { current: null } as React.MutableRefObject<any>;
const mockPositionResult = {
  x: 12,
  y: 24,
  placement: 'bottom',
  maxHeight: 360,
  maxWidth: 280,
  finalWidth: 200,
  finalHeight: 120,
  flipped: false,
  shifted: false,
};

const mockMeasureElement = jest.fn().mockResolvedValue({ x: 0, y: 0, width: 180, height: 40 });

jest.mock('../../../core/theme', () => ({
  useTheme: () => mockTheme,
}));

jest.mock('../../../core/theme/ThemeProvider', () => ({
  PlatformBlocksThemeProvider: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('../../../core/utils/positioning-enhanced', () => ({
  measureElement: (...args: any[]) => mockMeasureElement(...args),
}));

jest.mock('../../../core/hooks/useDropdownPositioning', () => ({
  useDropdownPositioning: jest.fn(() => ({
    position: mockPositionResult,
    anchorRef: mockAnchorRef,
    popoverRef: mockPopoverRef,
    showOverlay: mockShowOverlay,
    hideOverlay: mockHideOverlay,
    updatePosition: mockUpdatePosition,
    isPositioning: false,
  })),
}));

const dropdownContent = <Text>Dropdown content</Text>;

describe('Popover - behavior', () => {
  const renderPopover = (props?: Partial<React.ComponentProps<typeof Popover>>) => render(
    <Popover keepMounted {...props}>
      <Popover.Target>
        <Text>Toggle Popover</Text>
      </Popover.Target>
      <Popover.Dropdown testID="popover-dropdown">
        {dropdownContent}
      </Popover.Dropdown>
    </Popover>
  );

  beforeEach(() => {
    jest.clearAllMocks();
    Object.assign(mockPositionResult, {
      x: 12,
      y: 24,
      placement: 'bottom' as const,
      maxHeight: 360,
      maxWidth: 280,
      finalWidth: 200,
      finalHeight: 120,
      flipped: false,
      shifted: false,
    });
    mockMeasureElement.mockResolvedValue({ x: 0, y: 0, width: 180, height: 40 });
  });

  it('opens the overlay when the target is pressed', async () => {
    const { getByText } = renderPopover();

    fireEvent.press(getByText('Toggle Popover'));

    await waitFor(() => {
      expect(mockShowOverlay).toHaveBeenCalled();
    });

    const overlayElement = mockShowOverlay.mock.calls.at(-1)?.[0];
    expect(overlayElement.props.testID).toBe('popover-dropdown');
  });

  it('closes the overlay when toggled again', async () => {
    const { getByText } = renderPopover();

    fireEvent.press(getByText('Toggle Popover'));
    await waitFor(() => {
      expect(mockShowOverlay).toHaveBeenCalled();
    });

    mockHideOverlay.mockClear();

    fireEvent.press(getByText('Toggle Popover'));

    expect(mockHideOverlay).toHaveBeenCalledTimes(1);
  });

  it('passes an explicit width override to the overlay', async () => {
    const widthOverride = 260;
    const { getByText } = renderPopover({ w: widthOverride });

    fireEvent.press(getByText('Toggle Popover'));

    await waitFor(() => {
      expect(mockShowOverlay).toHaveBeenCalled();
    });

    const overlayOptions = mockShowOverlay.mock.calls.at(-1)?.[1];
    expect(overlayOptions?.width).toBe(widthOverride);
  });

  it('does not open when disabled', async () => {
    const { getByText } = renderPopover({ disabled: true });

    fireEvent.press(getByText('Toggle Popover'));

    await waitFor(() => {
      expect(mockShowOverlay).not.toHaveBeenCalled();
    });
  });
});
