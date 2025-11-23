import { useCallback, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import {
  Button,
  Card,
  Column,
  PermissionGate,
  PermissionProvider,
  Row,
  Text,
  defineAbility,
  type PermissionRule,
} from '@platform-blocks/ui';

type RoleKey = 'viewer' | 'analyst' | 'manager';

type DemoUser = {
  id: string;
  name: string;
  role: RoleKey;
};

type RoleOption = {
  key: RoleKey;
  label: string;
  summary: string;
  buildRules: () => PermissionRule[];
};

const ROLE_OPTIONS: RoleOption[] = [
  {
    key: 'viewer',
    label: 'Viewer',
    summary: 'Reads dashboards but cannot export or manage settings.',
    buildRules: () =>
      defineAbility((builder) => {
        builder.allow('view', 'Analytics');
        builder.allow('view', 'Reports');
        builder.forbid('export', 'Analytics');
        builder.forbid('manage', 'Analytics');
      }).getRules(),
  },
  {
    key: 'analyst',
    label: 'Analyst',
    summary: 'Views dashboards and exports datasets for further analysis.',
    buildRules: () =>
      defineAbility((builder) => {
        builder.allow('view', 'Analytics');
        builder.allow('export', 'Analytics');
        builder.allow('view', 'Revenue');
        builder.forbid('manage', 'Billing');
      }).getRules(),
  },
  {
    key: 'manager',
    label: 'Manager',
    summary: 'Full control of analytics, exports, and billing settings.',
    buildRules: () =>
      defineAbility((builder) => {
        builder.manage('Analytics');
        builder.manage('Revenue');
        builder.manage('Billing');
      }).getRules(),
  },
];

const REQUIRED_PERMISSIONS = [
  { action: 'view', subject: 'Analytics' },
  { action: 'export', subject: 'Analytics' },
];

const formatTime = (date: Date): string =>
  `${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

export default function Demo() {
  const [role, setRole] = useState<RoleKey>('viewer');
  const [lastDeniedAt, setLastDeniedAt] = useState<string | null>(null);

  const user = useMemo<DemoUser>(
    () => ({ id: 'user-analytics', name: 'Morgan Ellis', role }),
    [role]
  );

  const activeRole = useMemo(
    () => ROLE_OPTIONS.find((option) => option.key === role) ?? ROLE_OPTIONS[0],
    [role]
  );

  const rules = useMemo(() => activeRole.buildRules(), [activeRole]);

  const handleUnauthorized = useCallback(() => {
    setLastDeniedAt(formatTime(new Date()));
  }, []);

  return (
    <PermissionProvider key={`${role}-${user.id}`} user={user} rules={rules}>
      <Column gap="lg" align="stretch" style={styles.wrapper}>
        <Column gap="sm">
          <Row gap="sm" wrap="wrap">
            {ROLE_OPTIONS.map(({ key, label }) => (
              <Button
                key={key}
                variant={key === role ? 'filled' : 'outline'}
                onPress={() => setRole(key)}
              >
                {label}
              </Button>
            ))}
          </Row>
          <Text variant="small" colorVariant="muted">
            {activeRole.summary}
          </Text>
        </Column>

        <PermissionGate
          permissions={REQUIRED_PERMISSIONS}
          onUnauthorized={handleUnauthorized}
          fallback={
            <Card variant="subtle" style={styles.card}>
              <Column gap="md">
                <Column gap="xs">
                  <Text weight="semibold">
                    Access limited
                  </Text>
                  <Text variant="p" colorVariant="muted">
                    The analytics workspace needs both view and export permissions.
                  </Text>
                </Column>
                <Text variant="small" colorVariant="muted">
                  Last check: {lastDeniedAt ?? 'No recent attempts'}
                </Text>
              </Column>
            </Card>
          }
        >
          <Card style={styles.card}>
            <Column gap="md">
              <Column gap="xs">
                <Text variant="h5" weight="semibold">
                  Growth analytics workspace
                </Text>
                <Text variant="p" colorVariant="muted">
                  Slice cohorts, export CSV snapshots, and manage scheduled send-outs.
                </Text>
              </Column>
              <Column gap="xs">
                <Text weight="semibold">Granted permissions</Text>
                <Text variant="p" colorVariant="muted">
                  • view → Analytics
                </Text>
                <Text variant="p" colorVariant="muted">
                  • export → Analytics
                </Text>
              </Column>
            </Column>
          </Card>
        </PermissionGate>
      </Column>
    </PermissionProvider>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  card: {
    width: '100%',
  },
});
