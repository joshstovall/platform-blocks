import React from 'react';
import { View, Text, Platform } from 'react-native';
import { useTheme } from '../../core/theme';
import { createInputStyles } from '../Input/styles';
import { InputStyleProps } from '../Input/types';

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
  testID
}) => {
  const theme = useTheme();
  const { getInputStyles } = createInputStyles(theme);
  const styles = getInputStyles({ size, disabled, error } as InputStyleProps);

  if (!label && !description) return null;

  const mb = marginBottom !== undefined ? marginBottom : (description ? 4 : 4);

  return (
    <View style={{ marginBottom: mb }} testID={testID}>
      {label && (
  <Text style={styles.label}>
          {label}
          {required && withAsterisk && (
            <Text style={styles.required} accessibilityLabel="required">{' *'}</Text>
          )}
        </Text>
      )}
      {description && (
        <Text style={{ fontSize: 12, color: theme.text.muted }}>
          {description}
        </Text>
      )}
    </View>
  );
};

export default FieldHeader;
