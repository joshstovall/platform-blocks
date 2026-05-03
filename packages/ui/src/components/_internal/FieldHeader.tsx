import React from 'react';
import { View } from 'react-native';
import { Text, type TextProps } from '../Text';
import { useTheme } from '../../core/theme';
import { createInputStyles } from '../Input/styles';
import { InputStyleProps } from '../Input/types';
import { mergeSlotProps } from '../../core/utils';

export interface FieldHeaderProps {
  label?: React.ReactNode;
  description?: React.ReactNode;
  required?: boolean;
  withAsterisk?: boolean;
  disabled?: boolean;
  error?: boolean;
  size?: InputStyleProps['size'];
  /** Extra spacing below the block (default auto based on presence) */
  marginBottom?: number;
  /** Optional test id */
  testID?: string;
  /** Override props applied to the label Text element */
  labelProps?: Omit<TextProps, 'children'>;
  /** Override props applied to the description Text element */
  descriptionProps?: Omit<TextProps, 'children'>;
}

/**
 * Internal utility component to standardize label + description block across field components.
 * Renders label, required asterisk, and muted description text directly beneath.
 */
export const FieldHeader: React.FC<FieldHeaderProps> = ({
  label,
  description,
  required,
  withAsterisk,
  disabled,
  error,
  size = 'md',
  marginBottom,
  testID,
  labelProps,
  descriptionProps,
}) => {
  const theme = useTheme();
  const { getInputStyles } = createInputStyles(theme);
  const styles = getInputStyles({ size, disabled, error } as InputStyleProps);

  if (!label && !description) return null;

  const hasDescription = Boolean(description);
  const resolvedMarginBottom = (() => {
    if (marginBottom !== undefined) return marginBottom;
    if (!hasDescription && !error) return 0;
    return 4;
  })();

  return (
    <View style={{ marginBottom: resolvedMarginBottom }} testID={testID}>
      {label ? (
        <Text {...mergeSlotProps({ style: styles.label }, labelProps)}>
          {label}
          {required && withAsterisk ? (
            <Text style={styles.required}>{' *'}</Text>
          ) : null}
        </Text>
      ) : null}
      {description ? (
        <Text
          {...mergeSlotProps(
            { style: { fontSize: 12, color: theme.text.muted } },
            descriptionProps
          )}
        >
          {description}
        </Text>
      ) : null}
    </View>
  );
};

export default FieldHeader;
