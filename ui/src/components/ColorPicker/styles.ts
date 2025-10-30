import { ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../core/theme';

export function useColorPickerStyles() {
  const theme = useTheme();

  const container: ViewStyle = {
    width: '100%',
  };

  const label: TextStyle = {
    fontSize: parseInt(theme.fontSizes.sm),
    fontWeight: '500',
    color: theme.text.primary,
    marginBottom: 4,
  };

  const wrapper: ViewStyle = {
    position: 'relative',
  };

  const input: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.gray[3],
    borderRadius: parseInt(theme.radii.md),
    backgroundColor: theme.backgrounds.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 36,
  };

  const inputFocused: ViewStyle = {
    borderColor: theme.colors.primary[5],
    boxShadow: `0 0 4px ${theme.colors.primary[5]}40`,
    elevation: 2,
  };

  const inputDisabled: ViewStyle = {
    backgroundColor: theme.colors.gray[1],
    opacity: 0.6,
  };

  const inputError: ViewStyle = {
    borderColor: theme.colors.error[5],
  };

  const preview: ViewStyle = {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: theme.colors.gray[3],
    marginRight: 8,
  };

  const textInput: TextStyle = {
    flex: 1,
    fontSize: parseInt(theme.fontSizes.sm),
    color: theme.text.primary,
    fontFamily: 'monospace',
    height: 20,
  };

  const dropdownIcon: TextStyle = {
    fontSize: parseInt(theme.fontSizes.md),
    color: theme.text.secondary,
    marginLeft: 8,
  };

  const clearButton: ViewStyle = {
    padding: 4,
    borderRadius: 6,
  };

  const clearButtonPressed: ViewStyle = {
    backgroundColor: theme.colors.gray[2],
  };

  const dropdownTrigger: ViewStyle = {
    padding: 4,
    borderRadius: parseInt(theme.radii.sm),
  };

  const dropdownTriggerPressed: ViewStyle = {
    backgroundColor: theme.colors.gray[2],
  };

  const dropdown: ViewStyle = {
    backgroundColor: theme.backgrounds.elevated,
    borderRadius: parseInt(theme.radii.md),
    borderWidth: 1,
    borderColor: theme.colors.gray[3],
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    elevation: 8,
    padding: 16,
    minWidth: 320,
    // Removed positioning styles - now handled by useDropdownPositioning
  };

  const colorPalette: ViewStyle = {
    // marginBottom: 16,
    // width:400,
    // height:300,
  };

  const paletteTitle: TextStyle = {
    fontSize: parseInt(theme.fontSizes.sm),
    fontWeight: '600',
    color: theme.text.primary,
    marginBottom: 8,
  };

  const swatchGrid: ViewStyle = {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  };

  const swatch: ViewStyle = {
    width: 32,
    height: 32,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'transparent',
  };

  const swatchSelected: ViewStyle = {
    borderColor: theme.colors.success[5],
    borderWidth: 2,
  };

  const customSection: ViewStyle = {
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray[2],
    paddingTop: 16,
  };

  const hexInput: ViewStyle = {
    borderWidth: 1,
    borderColor: theme.colors.gray[3],
    borderRadius: parseInt(theme.radii.sm),
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: theme.backgrounds.surface,
  };

  const hexInputText: TextStyle = {
    fontSize: parseInt(theme.fontSizes.sm),
    fontFamily: 'monospace',
    color: theme.text.primary,
  };

  const error: TextStyle = {
    fontSize: parseInt(theme.fontSizes.xs),
    color: theme.colors.error[6],
    marginTop: 4,
  };

  const description: TextStyle = {
    fontSize: parseInt(theme.fontSizes.xs),
    color: theme.text.secondary,
    marginTop: 4,
  };

  const buttonRow: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 16,
  };

  const button: ViewStyle = {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: parseInt(theme.radii.sm),
    borderWidth: 1,
  };

  const primaryButton: ViewStyle = {
    backgroundColor: theme.colors.primary[5],
    borderColor: theme.colors.primary[5],
  };

  const secondaryButton: ViewStyle = {
    backgroundColor: 'transparent',
    borderColor: theme.colors.gray[3],
  };

  const buttonText: TextStyle = {
    fontSize: parseInt(theme.fontSizes.sm),
    fontWeight: '500',
  };

  const primaryButtonText: TextStyle = {
    color: '#ffffff',
  };

  const secondaryButtonText: TextStyle = {
    color: theme.text.primary,
  };

  return {
    container,
    label,
    wrapper,
    input,
    inputFocused,
    inputDisabled,
    inputError,
    preview,
    textInput,
    dropdownIcon,
    clearButton,
    clearButtonPressed,
    dropdownTrigger,
    dropdownTriggerPressed,
    dropdown,
    colorPalette,
    paletteTitle,
    swatchGrid,
    swatch,
    swatchSelected,
    customSection,
    hexInput,
    hexInputText,
    error,
    description,
    buttonRow,
    button,
    primaryButton,
    secondaryButton,
    buttonText,
    primaryButtonText,
    secondaryButtonText,
  };
}
