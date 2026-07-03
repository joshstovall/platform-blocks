import { useState } from 'react';
import { Column, Icon, Switch, Text, useTheme } from '@platform-blocks/ui';

export default function Demo() {
  const theme = useTheme();
  const [wifi, setWifi] = useState<boolean>(true);
  const [available, setAvailable] = useState<boolean>(true);

  return (
    <Column gap="lg">
      <Column gap="xs">
        <Text variant="small" colorVariant="muted">
          Icon on the thumb — swaps with the on/off state
        </Text>
        <Switch
          checked={wifi}
          onChange={setWifi}
          size="xl"
          label="Wi-Fi"
          onIcon={<Icon name="check" size={18} color={theme.colors.primary[3]} stroke={3} />}
          offIcon={<Icon name="close" size={18} color={theme.colors.gray[5]} stroke={3} />}
        />
      </Column>

      <Column gap="xs">
        <Text variant="small" colorVariant="muted">
          Text label on the thumb
        </Text>
        <Switch
          checked={available}
          onChange={setAvailable}
          size="3xl"
          color="success"
          label="Availability"
          onIcon={
            <Text style={{ fontSize: 12, lineHeight: 11, fontWeight: '700', color: theme.colors.success[5] }}>
              ON
            </Text>
          }
          offIcon={
            <Text style={{ fontSize: 12, lineHeight: 11, fontWeight: '700', color: theme.colors.gray[5] }}>
              OFF
            </Text>
          }
        />
      </Column>
    </Column>
  );
}
