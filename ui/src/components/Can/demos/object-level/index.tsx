import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import {
  CanWithConditions,
  Card,
  Column,
  PermissionProvider,
  Text,
  defineAbility,
  type PermissionRule,
} from '@platform-blocks/ui';

type PostStatus = 'draft' | 'ready' | 'published';

type Post = {
  id: string;
  title: string;
  status: PostStatus;
  authorId: string;
};

type DemoUser = {
  id: string;
  name: string;
};

const CURRENT_USER: DemoUser = {
  id: 'writer-42',
  name: 'Kai Rivera',
};

const POSTS: Post[] = [
  {
    id: 'draft-announcement',
    title: 'Draft: Transit pilot announcement',
    status: 'draft',
    authorId: CURRENT_USER.id,
  },
  {
    id: 'ready-release',
    title: 'Ready: Fall product release notes',
    status: 'ready',
    authorId: CURRENT_USER.id,
  },
  {
    id: 'published-highlight',
    title: 'Published: Community success stories',
    status: 'published',
    authorId: 'team-ops',
  },
];

const abilityRules: PermissionRule[] = defineAbility((builder) => {
  builder.allow('read', 'Post');
  builder.allowIf('edit', 'Post', { authorId: CURRENT_USER.id });
  builder.allowIf('delete', 'Post', { authorId: CURRENT_USER.id, status: 'draft' });
  builder.allowIf('publish', 'Post', { authorId: CURRENT_USER.id, status: 'ready' });
  builder.forbid('archive', 'Post');
}).getRules();

const STATUS_COPY: Record<PostStatus, string> = {
  draft: 'Draft — not yet visible to readers',
  ready: 'Ready for review and publishing',
  published: 'Published — locked against edits',
};

export default function Demo() {
  const rules = useMemo(() => abilityRules, []);

  return (
    <PermissionProvider user={CURRENT_USER} rules={rules}>
      <Column gap="lg" align="stretch" style={styles.wrapper}>
        <Column gap="xs">
          <Text variant="h4" weight="semibold">
            Object-level permissions
          </Text>
          <Text variant="p" colorVariant="muted">
            `CanWithConditions` evaluates each post against rule conditions like ownership and status.
          </Text>
        </Column>

        {POSTS.map((post) => {
          const isOwner = post.authorId === CURRENT_USER.id;

          return (
            <Card key={post.id} variant="subtle" style={styles.card}>
              <Column gap="md">
                <Column gap="xs">
                  <Text variant="h5" weight="semibold">
                    {post.title}
                  </Text>
                  <Text variant="p" colorVariant="muted">
                    {STATUS_COPY[post.status]}
                  </Text>
                  <Text variant="small" colorVariant="muted">
                    {isOwner ? 'You are the author.' : 'Owned by another teammate.'}
                  </Text>
                </Column>

                <CanWithConditions
                  I="edit"
                  this={post}
                  fallback={
                    <Column gap="xs">
                      <Text weight="semibold" colorVariant="error">
                        Editing blocked
                      </Text>
                      <Text variant="p" colorVariant="muted">
                        {isOwner
                          ? 'Published posts are locked to preserve the public record.'
                          : 'You can only edit posts that you authored.'}
                      </Text>
                    </Column>
                  }
                >
                  <Column gap="xs">
                    <Text weight="semibold" colorVariant="success">
                      Editing allowed
                    </Text>
                    <Text variant="p" colorVariant="muted">
                      This post matches your ownership rules, so inline edits are enabled.
                    </Text>
                  </Column>
                </CanWithConditions>

                <CanWithConditions
                  I="delete"
                  this={post}
                  fallback={
                    <Column gap="xs">
                      <Text weight="semibold">
                        Deletion limited
                      </Text>
                      <Text variant="p" colorVariant="muted">
                        Only drafts you created can be deleted. Publish-ready or published posts remain.
                      </Text>
                    </Column>
                  }
                >
                  <Column gap="xs">
                    <Text weight="semibold" colorVariant="warning">
                      Draft can be deleted
                    </Text>
                    <Text variant="p" colorVariant="muted">
                      Remove the draft entirely or start over from a fresh outline.
                    </Text>
                  </Column>
                </CanWithConditions>

                <CanWithConditions
                  I="publish"
                  this={post}
                  fallback={
                    <Column gap="xs">
                      <Text weight="semibold">
                        Waiting on review
                      </Text>
                      <Text variant="p" colorVariant="muted">
                        Publishing unlocks when a post you authored reaches the "ready" stage.
                      </Text>
                    </Column>
                  }
                >
                  <Column gap="xs">
                    <Text weight="semibold" colorVariant="success">
                      Ready to publish
                    </Text>
                    <Text variant="p" colorVariant="muted">
                      Move the post to production and notify subscribers with one click.
                    </Text>
                  </Column>
                </CanWithConditions>
              </Column>
            </Card>
          );
        })}

        <Text variant="small" colorVariant="muted" align="center">
          Conditional checks compare each object to your rules without duplicating permission logic in UI components.
        </Text>
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
