import { useState } from 'react';
import { Column, Row, Switch, Text } from '@platform-blocks/ui';

const VARIANTS = [
  { variant: 'filled', hint: 'filled (default) — solid track fills with the active color' },
  { variant: 'outline', hint: 'outline — bordered track with a colored thumb' },
  { variant: 'ios', hint: 'ios — large white thumb in a rounded pill track' },
  { variant: 'android', hint: 'android — Material dot thumb that grows and whitens when on' },
] as const;

export default function Demo() {
  const [on, setOn] = useState<Record<string, boolean>>({
    filled: true,
    outline: true,
    ios: true,
    android: true,
  });

  return (
    <Column gap="lg">
      {VARIANTS.map(({ variant, hint }) => (
        <Column key={variant} gap="xs">
          <Text variant="small" colorVariant="muted">
            {hint}
          </Text>
          <Row gap="lg" wrap="wrap" align="center">
            <Switch
              variant={variant}
              checked={on[variant]}
              onChange={(v) => setOn((prev) => ({ ...prev, [variant]: v }))}
              label="On"
            />
            <Switch variant={variant} checked={false} label="Off" />
            <Switch variant={variant} checked color="success" label="Success" />
          </Row>
        </Column>
      ))}
    </Column>
  );
}
