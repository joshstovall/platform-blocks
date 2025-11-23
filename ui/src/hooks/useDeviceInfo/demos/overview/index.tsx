import { Card, Column, Text } from '@platform-blocks/ui';
import { useDeviceInfo } from '../..';

type StatProps = {
  label: string;
  value: string;
  secondary?: string | null;
};

function Stat({ label, value, secondary }: StatProps) {
  return (
    <Column gap="xs">
      <Text size="xs" colorVariant="muted">
        {label}
      </Text>
      <Text weight="semibold">{value || '—'}</Text>
      {secondary ? (
        <Text size="xs" colorVariant="secondary">
          {secondary}
        </Text>
      ) : null}
    </Column>
  );
}

export default function Demo() {
  const info = useDeviceInfo({ enableExtendedData: true });
  const { runtime, system, screen, appearance, locale, input, safeArea, helpers, network, meta } = info;

  const deviceLabel = [system.device.brand, system.device.model].filter(Boolean).join(' • ') || 'Unknown device';
  const pointerLabel = input.pointerTypes.length ? input.pointerTypes.join(', ') : 'No pointer';

  return (
    <Column gap="md" fullWidth>
      <Text weight="semibold">Inspect device metadata in one hook</Text>
      <Text size="sm" colorVariant="secondary">
        Platform, locale, screen metrics, accessibility settings, and optional network info stay in sync with subscriptions.
      </Text>

      <Card variant="outline" style={{ padding: 16, gap: 16 }}>
        <Text size="sm" weight="semibold">
          Platform & runtime
        </Text>
        <Column gap="sm">
          <Stat
            label="Operating system"
            value={`${system.os.name ?? 'Unknown'} ${system.os.version ?? ''}`.trim() || 'Unknown'}
            secondary={system.os.buildId ? `Build ${system.os.buildId}` : null}
          />
          <Stat label="Device" value={`${system.device.type} • ${deviceLabel}`} />
          <Stat
            label="Runtime"
            value={runtime.platform === 'browser' ? 'Browser' : 'Native'}
            secondary={runtime.browserName ? `${runtime.browserName} ${runtime.browserVersion ?? ''}`.trim() : runtime.jsEngine}
          />
        </Column>
      </Card>

      <Card variant="outline" style={{ padding: 16, gap: 16 }}>
        <Text size="sm" weight="semibold">
          Screen & appearance
        </Text>
        <Column gap="sm">
          <Stat
            label="Resolution"
            value={`${Math.round(screen.width)} × ${Math.round(screen.height)} @${screen.scale}x`}
            secondary={`Orientation: ${screen.orientation}`}
          />
          <Stat
            label="Safe area"
            value={`${safeArea.top}/${safeArea.right}/${safeArea.bottom}/${safeArea.left}`}
            secondary="Top • Right • Bottom • Left"
          />
          <Stat
            label="Color scheme"
            value={`${appearance.colorScheme} / contrast ${appearance.contrast}`}
            secondary={`Reduced motion: ${appearance.reducedMotion ? 'enabled' : 'disabled'}`}
          />
        </Column>
      </Card>

      <Card variant="outline" style={{ padding: 16, gap: 16 }}>
        <Text size="sm" weight="semibold">
          Locale & input
        </Text>
        <Column gap="sm">
          <Stat
            label="Locale"
            value={`${locale.language}-${locale.region ?? '??'}`.toUpperCase()}
            secondary={`${locale.timeZone} • 24h clock: ${locale.uses24HourClock ? 'yes' : 'no'}`}
          />
          <Stat label="Pointers" value={pointerLabel} secondary={`Touch: ${input.hasTouch ? 'yes' : 'no'} • Mouse: ${input.hasMouse ? 'yes' : 'no'}`} />
          <Stat
            label="Helpers"
            value={helpers.isMobile ? 'Mobile / touch-first' : helpers.isDesktop ? 'Desktop' : 'Unknown'}
            secondary={`Dark mode: ${helpers.isDarkMode ? 'enabled' : 'disabled'} • Landscape: ${helpers.isLandscape ? 'yes' : 'no'}`}
          />
          <Stat
            label="Network"
            value={network?.connectionType ?? 'unknown'}
            secondary={network?.downlink ? `${network.downlink.toFixed(1)} Mbps downlink` : meta.ready ? 'No extra data available' : 'Loading extended data...'}
          />
        </Column>
      </Card>
    </Column>
  );
}
