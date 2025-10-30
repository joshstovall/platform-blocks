import { Avatar, AvatarGroup, Column, Text } from '@platform-blocks/ui';

export default function GroupAvatarDemo() {
  const users = [
    { id: 1, initials: 'SJ', color: '#FF6B6B' },
    { id: 2, initials: 'MC', color: '#4ECDC4' },
    { id: 3, initials: 'ER', color: '#45B7D1' },
    { id: 4, initials: 'DL', color: '#96CEB4' },
    { id: 5, initials: 'KP', color: '#FFEAA7' },
    { id: 6, initials: 'TW', color: '#DDA0DD' },
    { id: 7, initials: 'AB', color: '#FFB6C1' },
  ];

  return (
    <Column gap="2xl">
      <Column gap="sm">
        <Text mb="sm" weight="semibold">
          Basic Avatar Group
        </Text>
        <AvatarGroup>
          {users.map((user) => (
            <Avatar
              key={user.id}
              fallback={user.initials}
              backgroundColor={user.color}
              size="md"
            />
          ))}
        </AvatarGroup>
      </Column>

      <Column gap="sm">
        <Text mb="sm" weight="semibold">
          With Limit (max 3 + overflow)
        </Text>
        <AvatarGroup limit={3} size="md">
          {users.map((user) => (
            <Avatar
              key={user.id}
              fallback={user.initials}
              backgroundColor={user.color}
            />
          ))}
        </AvatarGroup>
      </Column>

    </Column>
  );
}
