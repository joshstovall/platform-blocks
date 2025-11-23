import { Card, Column, Link, Row, Text } from '@platform-blocks/ui';

const sizes = [
  { token: 'xs', label: 'Extra small' },
  { token: 'sm', label: 'Small' },
  { token: 'md', label: 'Medium (default)' },
  { token: 'lg', label: 'Large' },
  { token: 'xl', label: 'Extra large' },
] as const;

export default function Demo() {
  return (
    <Column gap="lg">
      <Card p="md">
        <Column gap="md">
          <Text size="sm" colorVariant="secondary">
            Adjust the `size` prop to match the surrounding typography scale.
          </Text>
          {sizes.map((entry) => (
            <Row key={entry.token} gap="sm" align="center">
              <Text size="xs" colorVariant="secondary">
                {entry.token.toUpperCase()}:
              </Text>
              <Link href="#" size={entry.token} color="primary">
                {entry.label}
              </Link>
            </Row>
          ))}
        </Column>
      </Card>
    </Column>
  );
}


