import { useState } from 'react';
import { Checkbox, Column, Text } from '@platform-blocks/ui';

const SIZES = [
  { key: 'xs', label: 'Extra small', description: 'Dense tables and compact lists.' },
  { key: 'sm', label: 'Small', description: 'Standard data tables.' },
  { key: 'md', label: 'Medium', description: 'Default for forms and settings.' },
  { key: 'lg', label: 'Large', description: 'Touch-heavy or marketing layouts.' }
] as const;

export default function Demo() {
  const [values, setValues] = useState<Record<string, boolean>>({ xs: false, sm: true, md: true, lg: false });

  const toggle = (size: string) => {
    setValues((current) => ({
      ...current,
      [size]: !current[size]
    }));
  };

  return (
    <Column gap="sm">
      <Text weight="medium">Size tokens</Text>
      <Column gap="xs">
        {SIZES.map(({ key, label, description }) => (
          <Column key={key} gap="xs">
            <Checkbox
              size={key}
              label={label}
              checked={Boolean(values[key])}
              onChange={() => toggle(key)}
            />
            <Text variant="small" colorVariant="muted">
              {description}
            </Text>
          </Column>
        ))}
      </Column>
    </Column>
  );
}
