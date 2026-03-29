import { Avatar, Column, Row, Text } from '@platform-blocks/ui';

const STATUS_AVATARS = [
  {
    key: 'online',
    label: 'Josh',
    description: 'Online',
    size: 'sm' as const,
    src: 'https://randomuser.me/api/portraits/men/1.jpg'
  },
  {
    key: 'available',
    label: 'Alice',
    description: 'Available',
    size: 'md' as const,
    src: 'https://randomuser.me/api/portraits/women/1.jpg'
  },
  {
    key: 'focus',
    label: 'Mike',
    description: 'Focus time',
    size: 'lg' as const,
    src: 'https://randomuser.me/api/portraits/men/2.jpg',
    indicatorColor: 'warning' as const
  },
  {
    key: 'offline',
    label: 'Tori',
    description: 'Last active 5m ago',
    size: 'xl' as const,
    src: 'https://randomuser.me/api/portraits/women/2.jpg',
    online: false
  }
];

export default function Demo() {
  return (
    <Column gap="md">
      <Row gap="lg" wrap="wrap">
        {STATUS_AVATARS.map(({ key, indicatorColor, online = true, ...avatar }) => (
          <Avatar
              key={key}
              {...avatar}
              fallback={avatar.label.slice(0, 2).toUpperCase()}
              online={online}
              indicatorColor={indicatorColor}
            />
        ))}
      </Row>
      <Text variant="small" colorVariant="muted" align="center">
        Set `online` to control the presence indicator and adjust `indicatorColor` for custom states.
      </Text>
    </Column>
  );
}
