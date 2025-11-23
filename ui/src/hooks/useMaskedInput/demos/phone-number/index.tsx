import { useMemo } from 'react';
import { TextInput as RNTextInput, View } from 'react-native';
import { Card, Column, Text } from '@platform-blocks/ui';
import { useMaskedInput } from '../..';
import { createMask } from '../../utils/mask';

export default function Demo() {
  const mask = useMemo(() => createMask({ mask: '(000) 000-0000', placeholderChar: '_' }), []);
  const {
    value,
    unmaskedValue,
    isComplete,
    handleChangeText,
    handleSelectionChange
  } = useMaskedInput({ mask });

  return (
    <Column gap="md" fullWidth>
      <Text weight="semibold">Format phone numbers as users type</Text>
      <Text size="sm" colorVariant="secondary">
        The hook keeps the cursor in the right place while emitting both masked and raw values.
      </Text>
      <Card variant="outline" style={{ padding: 16, gap: 12, maxWidth: 360 }}>
        <View
          style={{
            borderWidth: 1,
            borderColor: 'var(--pb-color-border-muted, #d1d5db)',
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 10
          }}
        >
          <RNTextInput
            value={value}
            onChangeText={handleChangeText}
            onSelectionChange={event => handleSelectionChange(event.nativeEvent.selection)}
            keyboardType="number-pad"
            placeholder="(555) 555-1234"
            style={{ fontSize: 16 }}
          />
        </View>
        <Column gap="xs">
          <Text size="xs" colorVariant="muted">
            Raw value: {unmaskedValue || '—'}
          </Text>
          <Text size="xs" colorVariant={isComplete ? 'success' : 'muted'}>
            {isComplete ? 'Mask complete' : 'Enter all digits to complete the mask'}
          </Text>
        </Column>
      </Card>
    </Column>
  );
}
