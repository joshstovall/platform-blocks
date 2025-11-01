import { ViewStyle } from 'react-native';
import { useTheme } from '../../core/theme';

export function useMenuStyles() {
  const theme = useTheme();

  const getPaletteColor = (palette: unknown, index: number) => {
    if (Array.isArray(palette)) {
      return palette[index] as string | undefined;
    }
    return undefined;
  };

  const surfacePalette = theme.colors?.surface;
  const grayPalette = theme.colors?.gray;

  const lightSurfaceColor =
    getPaletteColor(surfacePalette, 4) ??
    (typeof theme.backgrounds?.surface === 'string' ? theme.backgrounds.surface : undefined) ??
    (typeof theme.backgrounds?.base === 'string' ? theme.backgrounds.base : undefined) ??
    getPaletteColor(grayPalette, 0) ??
    '#ffffff';

  const darkSurfaceColor =
    getPaletteColor(surfacePalette, 3) ??
    (typeof theme.backgrounds?.elevated === 'string' ? theme.backgrounds.elevated : undefined) ??
    lightSurfaceColor;

  const fallbackRadius = theme.radii?.md ?? theme.radii?.sm ?? '8';
  const parsedRadius = typeof fallbackRadius === 'number'
    ? fallbackRadius
    : parseInt(`${fallbackRadius}`, 10) || 8;

  const dropdown: ViewStyle = {
    backgroundColor: theme.colorScheme === 'dark' ? darkSurfaceColor : lightSurfaceColor,
    borderRadius: parsedRadius,
    // borderWidth: 3, // Temporarily increased for debugging
    // borderColor: '#ff0000', // Temporarily red for debugging
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    elevation: 8,
    minWidth: 180,
    maxWidth: 320,
    overflow: 'hidden',
  };

  const item: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    minHeight: 36,
  };

  const itemPressed: ViewStyle = {
    backgroundColor: theme.colors.gray[1],
  };

  const itemDisabled: ViewStyle = {
    opacity: 0.5,
  };

  const itemDanger: ViewStyle = {
    backgroundColor: theme.colors.error[0],
  };

  const itemDangerPressed: ViewStyle = {
    backgroundColor: theme.colors.error[1],
  };

  const label: ViewStyle = {
    paddingVertical: 6,
    paddingHorizontal: 12,
  };

  const divider: ViewStyle = {
    height: 1,
    // backgroundColor: theme.colors.gray[2],
    // marginVertical: 4,
  };

  const leftSection: ViewStyle = {
    marginRight: 8,
  };

  const rightSection: ViewStyle = {
    marginLeft: 'auto',
    paddingLeft: 12,
  };

  return {
    dropdown,
    item,
    itemPressed,
    itemDisabled,
    itemDanger,
    itemDangerPressed,
    label,
    divider,
    leftSection,
    rightSection,
  };
}
