import { Column, Tabs, Text } from '@platform-blocks/ui';

const ITEMS = [
  {
    key: 'home',
    label: 'Home',
    content: (
      <Column gap="xs">
        <Text weight="medium">Welcome back</Text>
        <Text colorVariant="muted">
          Animated transitions ease between dashboard sections and reinforce context shifts.
        </Text>
      </Column>
    )
  },
  {
    key: 'analytics',
    label: 'Analytics',
    content: (
      <Column gap="xs">
        <Text weight="medium">Analytics overview</Text>
        <Text colorVariant="muted">
          Surface key charts and KPIs while the motion guides attention to new content.
        </Text>
      </Column>
    )
  },
  {
    key: 'settings',
    label: 'Settings',
    content: (
      <Column gap="xs">
        <Text weight="medium">Account settings</Text>
        <Text colorVariant="muted">
          Manage notifications, billing, and other preferences without abrupt content swaps.
        </Text>
      </Column>
    )
  }
];

export default function Demo() {
  return (
    <Column gap="sm">
      <Tabs
        variant="line"
        animated
        animationDuration={250}
        items={ITEMS}
      />
      <Text variant="small" colorVariant="muted">
        Enable `animated` to add motion and use `animationDuration` to moderate the easing speed.
      </Text>
    </Column>
  );
}
