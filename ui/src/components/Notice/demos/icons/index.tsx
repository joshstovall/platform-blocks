import type { ComponentProps, ReactNode } from 'react';
import { Notice, Column, Icon, Text } from '@platform-blocks/ui';

type Severity = NonNullable<ComponentProps<typeof Notice>['sev']>;

const SEVERITIES: Severity[] = ['info', 'success', 'warning', 'error'];

const STRING_ICON_ALERTS = [
  { key: 'heart', icon: 'heart', color: 'error', title: 'String icon', body: 'Passing a string renders the matching icon automatically.' },
  { key: 'star', icon: 'star', color: 'warning', title: 'Alternate icon', body: 'Use any icon name to align with the brand tone.' }
] as const;

const COMPONENT_ICON_ALERTS: Array<{ key: string; icon: ReactNode; color: ComponentProps<typeof Notice>['color']; title: string; body: string }> = [
  {
    key: 'metrics',
    icon: <Icon name="knobs" />,
    color: 'primary',
    title: 'Custom component',
    body: 'Embed a bespoke icon element for advanced scenarios.'
  },
  {
    key: 'docs',
    icon: <Icon name="paper" />,
    color: 'gray',
    title: 'Documentation',
    body: 'Use neutral colors for guidance or documentation callouts.'
  }
];

const ICON_CONTROL_ALERTS = [
  {
    key: 'hidden',
    icon: false,
    sev: 'warning' as const,
    title: 'Icon hidden',
    body: 'Set icon to false to suppress the severity icon entirely.'
  },
  {
    key: 'fallback',
    icon: null,
    sev: 'error' as const,
    title: 'Default fallback',
    body: 'Null or undefined keeps the severity icon when one is provided.'
  },
  {
    key: 'no-severity',
    icon: undefined,
    color: 'primary' as const,
    title: 'No icon specified',
    body: 'Omit icon and severity to render text-only alerts.'
  }
];

export default function Demo() {
  return (
    <Column gap="xl">
      <Column gap="xs">
        <Text weight="medium">Severity defaults</Text>
        <Column gap="sm">
          {SEVERITIES.map((severity) => (
            <Notice key={severity} sev={severity} title={severity.toUpperCase()}>
              Severity presets automatically choose the matching icon.
            </Notice>
          ))}
        </Column>
        <Text variant="small" colorVariant="muted">
          Provide `sev` to align iconography and color with the status level.
        </Text>
      </Column>

      <Column gap="xs">
        <Text weight="medium">String icon names</Text>
        <Column gap="sm">
          {STRING_ICON_ALERTS.map(({ key, icon, color, title, body }) => (
            <Notice key={key} icon={icon} color={color} title={title}>
              {body}
            </Notice>
          ))}
        </Column>
        <Text variant="small" colorVariant="muted">
          Pass a string to `icon` to render any glyph from the icon set.
        </Text>
      </Column>

      <Column gap="xs">
        <Text weight="medium">Custom icon elements</Text>
        <Column gap="sm">
          {COMPONENT_ICON_ALERTS.map(({ key, icon, color, title, body }) => (
            <Notice key={key} icon={icon} color={color} title={title}>
              {body}
            </Notice>
          ))}
        </Column>
        <Text variant="small" colorVariant="muted">
          Supply a React element when you need bespoke iconography.
        </Text>
      </Column>

      <Column gap="xs">
        <Text weight="medium">Icon control</Text>
        <Column gap="sm">
          {ICON_CONTROL_ALERTS.map(({ key, icon, sev, color, title, body }) => (
            <Notice key={key} icon={icon} sev={sev} color={color} title={title}>
              {body}
            </Notice>
          ))}
        </Column>
        <Text variant="small" colorVariant="muted">
          Toggle the icon behaviour explicitly for more precise layouts.
        </Text>
      </Column>
    </Column>
  );
}
