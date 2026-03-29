import type { AppStoreButtonProps } from '@platform-blocks/ui';
import { AppStoreButton, Column, Row, Text } from '@platform-blocks/ui';

type ButtonSize = NonNullable<AppStoreButtonProps['size']>;

const sizeSections: { label: string; token: ButtonSize }[] = [
  { label: 'Small', token: 'sm' },
  { label: 'Medium (default)', token: 'md' },
  { label: 'Large', token: 'lg' },
  { label: 'Extra large', token: 'xl' },
];

export default function Demo() {
  return (
    <Column gap="lg">
      {sizeSections.map(({ label, token }) => (
        <Column key={token} gap="xs">
          <Text size="sm" weight="medium">
            {label}
          </Text>

          <Row gap="md">
            <AppStoreButton store="app-store" size={token} />
            <AppStoreButton store="google-play" size={token} />
          </Row>
        </Column>
      ))}
    </Column>
  );
}