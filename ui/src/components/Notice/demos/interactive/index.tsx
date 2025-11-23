import type { ComponentProps } from 'react';
import { useEffect, useState } from 'react';
import { Notice, Button, Column, Text } from '@platform-blocks/ui';

type NoticeItem = {
  id: number;
  title: string;
  color: NonNullable<ComponentProps<typeof Notice>['color']>;
  message: string;
};

const INITIAL_ALERTS: NoticeItem[] = [
  {
    id: 1,
    title: 'Profile saved',
    color: 'success',
    message: 'Changes were stored successfully. Dismiss when you are ready.'
  },
  {
    id: 2,
    title: 'Draft warning',
    color: 'warning',
    message: 'Your draft is missing a title. Resolve before publishing.'
  },
  {
    id: 3,
    title: 'Connection issue',
    color: 'error',
    message: 'Retry the action or check the status page for outages.'
  }
];

export default function Demo() {
  const [alerts, setNotices] = useState<NoticeItem[]>(INITIAL_ALERTS);
  const [transientNotice, setTransientNotice] = useState<boolean>(false);

  useEffect(() => {
    if (!transientNotice) {
      return undefined;
    }

    const timeout = setTimeout(() => setTransientNotice(false), 3000);
    return () => clearTimeout(timeout);
  }, [transientNotice]);

  const handleDismiss = (id: number) => {
    setNotices((current) => current.filter((alert) => alert.id !== id));
  };

  const handleShowTransient = () => {
    setTransientNotice(true);
  };

  return (
    <Column gap="lg">
      <Column gap="sm">
        {alerts.map(({ id, title, color, message }) => (
          <Notice
            key={id}
            title={title}
            color={color}
            withCloseButton
            onClose={() => handleDismiss(id)}
          >
            {message}
          </Notice>
        ))}
        {transientNotice ? (
          <Notice color="primary" title="Temporary notice">
            This alert auto-dismisses after three seconds to reduce friction.
          </Notice>
        ) : null}
      </Column>

      <Button
        variant="outline"
        onPress={handleShowTransient}
        disabled={transientNotice}
      >
        Show timed alert
      </Button>

      <Text variant="small" colorVariant="muted">
        Combine `withCloseButton` for manual dismissal and layered state to present ephemeral messaging.
      </Text>
    </Column>
  );
}
