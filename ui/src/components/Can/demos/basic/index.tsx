import { useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import {
  Button,
  Can,
  Cannot,
  Card,
  Column,
  PermissionProvider,
  Row,
  Text,
  defineAbility,
  type PermissionRule,
} from '@platform-blocks/ui';

type RoleKey = 'viewer' | 'editor' | 'admin';

type DemoUser = {
  id: string;
  name: string;
  role: RoleKey;
};

type RoleOption = {
  key: RoleKey;
  label: string;
  summary: string;
  buildRules: (user: DemoUser) => PermissionRule[];
};

const ROLE_OPTIONS: RoleOption[] = [
  {
    key: 'viewer',
    label: 'Viewer',
    summary: 'Reads published content and comments only.',
    buildRules: () =>
      defineAbility((builder) => {
        builder.allow('read', 'Post');
        builder.allow('read', 'Comment');
        builder.forbid('publish', 'Post');
        builder.forbid('manage', 'Billing');
      }).getRules(),
  },
  {
    key: 'editor',
    label: 'Editor',
    summary: 'Creates and publishes posts but not billing settings.',
    buildRules: (user) =>
      defineAbility((builder) => {
        builder.allow('read', 'Post');
        builder.allow('read', 'Comment');
        builder.allow('create', 'Post');
        builder.allow('edit', 'Post');
        builder.allow('manage', 'Comment');
        builder.allow('publish', 'Post');
        builder.forbid('manage', 'Billing');
        builder.allowIf('edit', 'Profile', { ownerId: user.id });
      }).getRules(),
  },
  {
    key: 'admin',
    label: 'Admin',
    summary: 'Manages every surface across the product.',
    buildRules: () =>
      defineAbility((builder) => {
        builder.manage('*');
      }).getRules(),
  },
];

export default function Demo() {
  const [role, setRole] = useState<RoleKey>('viewer');

  const user = useMemo<DemoUser>(
    () => ({ id: 'user-42', name: 'Kai Rivera', role }),
    [role]
  );

  const activeRole = useMemo(
    () => ROLE_OPTIONS.find((option) => option.key === role) ?? ROLE_OPTIONS[0],
    [role]
  );

  const rules = useMemo(() => activeRole.buildRules(user), [activeRole, user]);

  return (
    <PermissionProvider key={`${role}-${user.id}`} user={user} rules={rules}>
      <Column gap="lg" align="stretch" style={styles.wrapper}>
        <Column gap="xs">
          <Text variant="h4" weight="semibold">
            Role-based gating
          </Text>
          <Text variant="p" colorVariant="muted">
            Switch roles to preview how <Text weight="semibold">Can</Text> and <Text weight="semibold">Cannot</Text>{' '}
            respond to the active ability.
          </Text>
        </Column>

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

        <Card variant="subtle" style={styles.card}>
          <Column gap="lg">
            <Column gap="xs">
              <Text variant="h5" weight="semibold">
                Publishing drafts
              </Text>
              <Text variant="p" colorVariant="muted">
                Only editors and admins can approve posts for publication.
              </Text>
            </Column>

            <Can
              style={styles.section}
              I="publish"
              a="Post"
              fallback={
                <Column gap="xs">
                  <Text weight="semibold" colorVariant="error">
                    Publishing restricted
                  </Text>
                  <Text variant="p" colorVariant="muted">
                    Upgrade to the editor or admin role to publish drafts.
                  </Text>
                </Column>
              }
            >
              <Column gap="xs">
                <Text weight="semibold" colorVariant="success">
                  Publishing allowed
                </Text>
                <Text variant="p" colorVariant="muted">
                  You can approve and publish content from the editorial queue.
                </Text>
              </Column>
            </Can>

            <Cannot I="manage" a="Billing" fallback={null} style={styles.section}>
              <Column gap="xs">
                <Text weight="semibold">
                  Billing hidden
                </Text>
                <Text variant="p" colorVariant="muted">
                  Billing controls stay hidden from non-admin roles.
                </Text>
              </Column>
            </Cannot>
          </Column>
        </Card>
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
  section: {
    width: '100%',
  },
});
