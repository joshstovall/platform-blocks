import { Flex, Card, Text, Column } from '@platform-blocks/ui';

export default function JustifyFlexDemo() {
  return (
    <Column gap={16} align="stretch">
      {[
        { label: 'Start', value: 'flex-start' },
        { label: 'Center', value: 'center' },
        { label: 'End', value: 'flex-end' },
        { label: 'Between', value: 'space-between' },
        { label: 'Around', value: 'space-around' },
        { label: 'Evenly', value: 'space-evenly' }
      ].map(({ label, value }) => (
        <Column key={value} gap={4} align="stretch">
          <Text variant="span" size="sm" colorVariant="muted">justify="{value}"</Text>
          <Card variant="outline" padding={0} style={{ alignSelf: 'stretch', width: '100%' }}>
            <Flex
              direction="row"
              justify={value as any}
              minHeight={60}
              style={{
                // Give the row a large track to clearly expose free space
                width: 600,
                maxWidth: '100%',
                backgroundColor: '#f6f7f9',
                borderWidth: 1,
                borderStyle: 'dashed',
                borderColor: '#e1e5ee',
                borderRadius: 4
              }}
            >
              {/* Small fixed squares with no shrink so free space is obvious */}
              <Card padding={0} style={{ width: 40, height: 40, flexShrink: 0, alignItems: 'center', justifyContent: 'center' }}>
                <Text variant="caption">A</Text>
              </Card>
              <Card padding={0} style={{ width: 40, height: 40, flexShrink: 0, alignItems: 'center', justifyContent: 'center' }}>
                <Text variant="caption">B</Text>
              </Card>
              <Card padding={0} style={{ width: 40, height: 40, flexShrink: 0, alignItems: 'center', justifyContent: 'center' }}>
                <Text variant="caption">C</Text>
              </Card>
            </Flex>
            <Text variant="caption" colorVariant="muted" style={{ marginTop: 6 }}>
              Notice where the extra space sits (left, right, between, around, evenly).
            </Text>
          </Card>
        </Column>
      ))}
    </Column>
  );
}
