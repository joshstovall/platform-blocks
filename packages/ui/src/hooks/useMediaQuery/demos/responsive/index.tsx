import { Block, Column, Row, Text, useMediaQuery } from '@platform-blocks/ui';

export default function Demo() {
  const isCompact = useMediaQuery('(max-width: 640px)');
  const isWide = useMediaQuery('(min-width: 1024px)');

  return (
    <Column gap="md">
      <Text>
        Compact (≤640px):{' '}
        <Text weight="700" c={isCompact ? 'success' : 'dimmed'}>
          {String(isCompact)}
        </Text>
      </Text>
      <Text>
        Wide (≥1024px):{' '}
        <Text weight="700" c={isWide ? 'success' : 'dimmed'}>
          {String(isWide)}
        </Text>
      </Text>

      <Row gap="md" wrap="wrap">
        {Array.from({ length: isCompact ? 1 : isWide ? 4 : 2 }).map((_, i) => (
          <Block key={i} bg="primary" p="md" radius="md" style={{ minWidth: 120 }}>
            <Text style={{ color: '#fff' }}>Card {i + 1}</Text>
          </Block>
        ))}
      </Row>

      <Text size="sm" c="dimmed">
        Resize the viewport (or rotate the device) to see the layout adapt.
      </Text>
    </Column>
  );
}
