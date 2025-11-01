import { Flex, Text, Avatar, Indicator, useTheme } from '@platform-blocks/ui';

const statuses = [
  { label: 'Online', color: 'success' },
  { label: 'Idle', color: 'warning' },
  { label: 'Busy', color: 'error' },
  { label: 'Offline', color: 'gray' },
];

function statusColor(theme: any, key: string) {
  switch (key) {
    case 'success':
      return theme.colors.success[5];
    case 'warning':
      return theme.colors.warning[5];
    case 'error':
      return theme.colors.error[5];
    case 'gray':
    default:
      return theme.colors.gray[5];
  }
}

export default function IndicatorStatusesDemo() {
  const theme = useTheme();
  return (
    <Flex direction="column" gap={20} p={16}>
      <Text size="sm" weight="semibold">Presence / Status</Text>
      <Flex direction="row" gap={24} wrap="wrap">
        {statuses.map(s => (
          <Flex key={s.label} direction="column" gap={6} align="center">
            <Flex style={{ position: 'relative' }}>
              <Avatar
                size={56}
                fallback={s.label.charAt(0)}
                src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(s.label)}`}
              />
              <Indicator placement="bottom-right" size={14} color={statusColor(theme, s.color)} />
            </Flex>
            <Text size="xs">{s.label}</Text>
          </Flex>
        ))}
      </Flex>

      <Text size="sm" weight="semibold">Max Count</Text>
      <Flex direction="row" gap={16}>
        {[3, 47, 99, 134, 1005].map(n => {
          const display = n > 99 ? '99+' : String(n);
          return (
            <Flex key={n} align="center" justify="center" style={{ position: 'relative', width: 56, height: 56 }}>
              <Indicator placement="top-right" size={24} offset={4} color={theme.colors.error[5]}>
                <Text size="xs" weight="bold" color="white">{display}</Text>
              </Indicator>
              <Text size="xs">{n}</Text>
            </Flex>
          );
        })}
      </Flex>
    </Flex>
  );
}
