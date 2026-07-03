import { useState } from 'react';
import { Checkbox, Column } from '@platform-blocks/ui';

const SIZES = [
  { key: 'xs', label: 'Extra small' },
  { key: 'sm', label: 'Small' },
  { key: 'md', label: 'Medium' },
  { key: 'lg', label: 'Large' }
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
    <Column>
      {SIZES.map(({ key, label }) => (
        <Checkbox
          key={key}
          size={key}
          label={label}
          checked={Boolean(values[key])}
          onChange={() => toggle(key)}
        />
      ))}
    </Column>
  );
}
