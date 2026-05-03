import { useState } from 'react';
import { Button, Column, Input, Row, Text, useDebouncedCallback } from '@platform-blocks/ui';

export default function Demo() {
  const [query, setQuery] = useState('');
  const [calls, setCalls] = useState<string[]>([]);

  const search = useDebouncedCallback((next: string) => {
    setCalls((prev) => [...prev, next]);
  }, 300);

  const handleChange = (next: string) => {
    setQuery(next);
    search(next);
  };

  return (
    <Column gap="md">
      <Input
        label="Search"
        placeholder="Type fast…"
        value={query}
        onChangeText={handleChange}
      />
      <Row gap="sm">
        <Button variant="outline" onPress={() => search.cancel()}>
          Cancel pending
        </Button>
        <Button variant="ghost" onPress={() => search.flush()}>
          Flush now
        </Button>
        <Button variant="ghost" onPress={() => setCalls([])}>
          Reset log
        </Button>
      </Row>
      <Text size="sm" c="dimmed">
        Search invocations (debounced 300ms):
      </Text>
      <Column gap="xs">
        {calls.map((c, i) => (
          <Text key={i} ff="monospace" size="sm">{`#${i + 1} → "${c}"`}</Text>
        ))}
      </Column>
    </Column>
  );
}
