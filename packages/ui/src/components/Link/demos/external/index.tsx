import { Card, Column, Link, Text } from '@platform-blocks/ui';

const references = [
  { href: 'https://reactnative.dev', label: 'React Native documentation', color: 'primary' },
  { href: 'https://expo.dev', label: 'Expo documentation', color: 'secondary' },
  { href: 'mailto:support@example.com', label: 'Email support', color: 'gray' },
];

export default function Demo() {
  return (
    <Column gap="lg">
      <Card p="md">
        <Column gap="md">
          <Text size="sm" colorVariant="secondary">
            Set `external` to ensure the link opens outside the app shell and receives the proper accessibility attributes.
          </Text>
          {references.map((resource) => (
            <Link key={resource.href} href={resource.href} external color={resource.color}>
              {resource.label}
            </Link>
          ))}
        </Column>
      </Card>
    </Column>
  );
}


