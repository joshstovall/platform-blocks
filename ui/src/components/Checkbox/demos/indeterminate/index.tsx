import React, { useState } from 'react';
import { View } from 'react-native';
import { Checkbox } from '../..';
import { Text } from '../../../Text';

interface Item { id: number; label: string; }
const items: Item[] = [
  { id: 1, label: 'Email notifications' },
  { id: 2, label: 'SMS alerts' },
  { id: 3, label: 'Push notifications' },
];

export default function CheckboxIndeterminateDemo() {
  const [selected, setSelected] = useState<number[]>([]);
  const allIds = items.map(i => i.id);
  const allChecked = selected.length === items.length;
  const someChecked = selected.length > 0 && !allChecked;

  const toggleAll = () => {
    setSelected(prev => prev.length === items.length ? [] : allIds);
  };

  const toggleOne = (id: number) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <View style={{ gap: 8 }}>
      <Text weight="bold">Indeterminate / Group</Text>
      <Checkbox
        label={`Select all (${selected.length}/${items.length})`}
        checked={allChecked}
        indeterminate={someChecked}
        onChange={toggleAll}
      />
      <View style={{ marginLeft: 16, gap: 4 }}>
        {items.map(item => (
          <Checkbox
            key={item.id}
            label={item.label}
            checked={selected.includes(item.id)}
            onChange={() => toggleOne(item.id)}
          />
        ))}
      </View>
    </View>
  );
}
