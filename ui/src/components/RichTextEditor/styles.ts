import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '../../core/theme';

export function useRichTextEditorStyles() {
  const theme = useTheme();

  return useMemo(() => StyleSheet.create({
    characterCount: {
      fontSize: 12,
      marginTop: 4,
      textAlign: 'right',
    },
    container: {
      width: '100%',
    },
    disabled: {
      opacity: 0.5,
    },
    editorContainer: {
      backgroundColor: theme.backgrounds.surface,
      borderColor: theme.backgrounds.border,
      borderRadius: parseInt(theme.radii.md, 10),
      borderWidth: 1,
      overflow: 'hidden',
    },
    errorText: {
      fontSize: 12,
      marginTop: 4,
    },
    helperText: {
      fontSize: 12,
      marginTop: 4,
    },
    textInput: {
      fontSize: 16,
      lineHeight: 24,
      padding: parseInt(theme.spacing.md, 10),
    },
    toolButton: {
      alignItems: 'center',
      backgroundColor: 'transparent',
      borderColor: theme.backgrounds.border,
      borderRadius: parseInt(theme.radii.sm, 10),
      borderWidth: 1,
      height: 32,
      justifyContent: 'center',
      width: 32,
    },
    toolSeparator: {
      backgroundColor: theme.backgrounds.border,
      height: 24,
      marginHorizontal: 4,
      width: 1,
    },
    toolbar: {
      backgroundColor: theme.backgrounds.elevated,
      borderBottomColor: theme.backgrounds.border,
      borderBottomWidth: 1,
    },
    toolbarContent: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: 4,
      paddingHorizontal: parseInt(theme.spacing.sm, 10),
      paddingVertical: parseInt(theme.spacing.xs, 10),
    },
  }), [theme]);
}
