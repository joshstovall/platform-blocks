import { Flex, Card, Text, Column } from '@platform-blocks/ui';

export default function AlignFlexDemo() {
  return (
    <Column gap={16}>
      {[
        { label: 'Start', value: 'flex-start' },
        { label: 'Center', value: 'center' },
        { label: 'End', value: 'flex-end' },
        { label: 'Stretch', value: 'stretch' },
        { label: 'Baseline', value: 'baseline' }
      ].map(({ label, value }) => (
        <Column key={value} gap={4}>
          <Text variant="span" size="sm" colorVariant="muted">align=&quot;{value}&quot;</Text>
          <Card variant="outline" p="sm">
            {value === 'baseline' ? (
              <Flex direction="row" align={value as any} gap="sm" h={80}>
                {/* Use Text of varying sizes directly to demonstrate baseline alignment */}
                <Text variant="h3" style={{ backgroundColor: '#eee', paddingHorizontal: 8 }}>Aa</Text>
                <Text variant="p" style={{ backgroundColor: '#eee', paddingHorizontal: 8 }}>Bb</Text>
                <Text variant="small" style={{ backgroundColor: '#eee', paddingHorizontal: 8 }}>Cc</Text>
              </Flex>
            ) : value === 'stretch' ? (
              <Flex direction="row" align={value as any} gap="sm" h={80}>
                {/* No fixed heights so children stretch to the container's cross-size */}
                <Card p="xs" style={{ minWidth: 32 }}><Text variant="small">1</Text></Card>
                <Card p="xs" style={{ minWidth: 32 }}><Text variant="small">2</Text></Card>
                <Card p="xs" style={{ minWidth: 32 }}><Text variant="small">3</Text></Card>
              </Flex>
            ) : (
              <Flex direction="row" align={value as any} gap="sm" h={80}>
                {/* Different heights to showcase flex-start/center/flex-end */}
                <Card p="xs" h={40}><Text variant="small">A</Text></Card>
                <Card p="xs" h={60}><Text variant="small">B</Text></Card>
                <Card p="xs" h={30}><Text variant="small">C</Text></Card>
              </Flex>
            )}
          </Card>
        </Column>
      ))}
    </Column>
  );
}
