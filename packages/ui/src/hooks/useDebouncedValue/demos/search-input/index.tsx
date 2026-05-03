import { useEffect, useState } from 'react';
import { Column, Input, Text, useDebouncedValue } from '@platform-blocks/ui';

export default function Demo() {
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebouncedValue(query, 300);
  const [hits, setHits] = useState<string[]>([]);

  // Effect runs only when debounced value settles, not on every keystroke.
  useEffect(() => {
    if (!debouncedQuery) {
      setHits([]);
      return;
    }
    const all = ['react', 'react native', 'redux', 'rxjs', 'remix', 'rollup'];
    setHits(all.filter((s) => s.includes(debouncedQuery.toLowerCase())));
  }, [debouncedQuery]);

  return (
    <Column gap="md">
      <Input
        label="Search packages"
        placeholder="Type to filter…"
        value={query}
        onChangeText={setQuery}
      />
      <Text size="sm" c="dimmed">
        Live: {query || '(empty)'}
      </Text>
      <Text size="sm" c="dimmed">
        Debounced (300ms): {debouncedQuery || '(empty)'}
      </Text>
      <Column gap="xs">
        {hits.map((h) => (
          <Text key={h}>{h}</Text>
        ))}
      </Column>
    </Column>
  );
}
