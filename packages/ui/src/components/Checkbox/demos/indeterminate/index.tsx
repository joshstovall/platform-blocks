import { useState } from 'react';
import { Checkbox, Column, Text } from '@platform-blocks/ui';

const ITEMS = [
  { id: 1, label: 'Email notifications' },
  { id: 2, label: 'SMS alerts' },
  { id: 3, label: 'Push notifications' }
] as const;

export default function Demo() {
  const [selected, setSelected] = useState<number[]>([]);
  const allIds = ITEMS.map((item) => item.id);
  const allChecked = selected.length === ITEMS.length;
  const someChecked = selected.length > 0 && !allChecked;

  const toggleAll = () => {
    setSelected((current) => (current.length === ITEMS.length ? [] : allIds));
  };

  const toggleItem = (id: number) => {
    setSelected((current) =>
      current.includes(id) ? current.filter((itemId) => itemId !== id) : [...current, id]
    );
  };

  return (
    <Column gap="sm">
      <Text weight="medium">Notification preferences</Text>
      <Checkbox
        label={`Select all (${selected.length}/${ITEMS.length})`}
        checked={allChecked}
        indeterminate={someChecked}
        onChange={toggleAll}
      />
      <Column gap="xs" pl="md">
        {ITEMS.map(({ id, label }) => (
          <Checkbox
            key={id}
            label={label}
            checked={selected.includes(id)}
            onChange={() => toggleItem(id)}
          />
        ))}
      </Column>
      <Text variant="small" colorVariant="muted">
        The parent checkbox enters an indeterminate state until every child preference matches.
      </Text>
    </Column>
  );
}
