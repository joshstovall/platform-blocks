import { ViewStyle } from 'react-native';
import { useTheme } from '../../core/theme';

export function useMenuStyles() {
  const theme = useTheme();

  const dropdown: ViewStyle = {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.surface[3] : theme.colors.surface[4],
    borderRadius: parseInt(theme.radii.md),
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
