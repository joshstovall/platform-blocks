import { Avatar, AvatarGroup, Column, Text } from '@platform-blocks/ui';

const TEAM = [
  { id: 1, initials: 'SJ', color: '#FF6B6B' },
  { id: 2, initials: 'MC', color: '#4ECDC4' },
  { id: 3, initials: 'ER', color: '#45B7D1' },
  { id: 4, initials: 'DL', color: '#96CEB4' },
  { id: 5, initials: 'KP', color: '#FFEAA7' },
  { id: 6, initials: 'TW', color: '#DDA0DD' },
  { id: 7, initials: 'AB', color: '#FFB6C1' }
];

export default function Demo() {
  return (
    <Column gap="xl">
      <Column gap="xs">
        <Text weight="medium">Simple group</Text>
        <AvatarGroup>
          {TEAM.map(({ id, initials, color }) => (
            <Avatar key={id} fallback={initials} backgroundColor={color} size="md" />
          ))}
        </AvatarGroup>
        <Text variant="small" colorVariant="muted">
          Groups overlap avatars automatically to conserve space.
        </Text>
      </Column>

      <Column gap="xs">
        <Text weight="medium">Overflow handling</Text>
        <AvatarGroup limit={3} size="md">
          {TEAM.map(({ id, initials, color }) => (
            <Avatar key={id} fallback={initials} backgroundColor={color} />
          ))}
        </AvatarGroup>
        <Text variant="small" colorVariant="muted">
          Set `limit` to cap visible avatars and show the remaining count.
        </Text>
      </Column>
    </Column>
  );
}
