import { Avatar, Block, Column, Indicator, Row, Text, useTheme } from '@platform-blocks/ui';

const presenceStatuses = [
  { label: 'Online', palette: 'success' },
  { label: 'Idle', palette: 'warning' },
  { label: 'Busy', palette: 'error' },
  { label: 'Offline', palette: 'gray' },
] as const;

const notificationCounts = [3, 47, 99, 134, 1005];

export default function Demo() {
  const theme = useTheme();

  const resolveColor = (palette: (typeof presenceStatuses)[number]['palette']) => {
    const swatch = (theme.colors as any)[palette];
    return Array.isArray(swatch) ? swatch[5] : swatch;
  };

  return (
    <Column gap="lg">
      <Column gap="xs">
        <Text size="sm" weight="medium">
          Presence indicators
        </Text>

        <Row gap="lg" wrap="wrap">
          {presenceStatuses.map((status) => (
            <Column key={status.label} align="center" gap="xs">
              <Block position="relative">
                <Avatar
                  size={56}
                  fallback={status.label.charAt(0)}
                  src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(status.label)}`}
                />
                <Indicator placement="bottom-right" size={14} color={resolveColor(status.palette)} />
              </Block>
              <Text size="xs" colorVariant="secondary">
                {status.label}
              </Text>
            </Column>
          ))}
        </Row>
      </Column>

      <Column gap="xs">
        <Text size="sm" weight="medium">
          Max count handling
        </Text>

        <Row gap="md" wrap="wrap">
          {notificationCounts.map((count) => {
            const display = count > 99 ? '99+' : `${count}`;
            return (
              <Block key={count} w={72} h={72} position="relative" align="center" justify="center">
                <Indicator placement="top-right" size={24} offset={4} color={theme.colors.error[5]}>
                  <Text size="xs" weight="bold" color="white">
                    {display}
                  </Text>
                </Indicator>
                <Text size="xs" colorVariant="secondary">
                  {count}
                </Text>
              </Block>
            );
          })}
        </Row>
      </Column>
    </Column>
  );
}
