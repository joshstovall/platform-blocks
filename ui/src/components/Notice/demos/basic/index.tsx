import type { ComponentProps } from 'react';
import { Notice, Column, Text } from '@platform-blocks/ui';

type NoticeExample = {
  key: string;
  title?: string;
  color?: ComponentProps<typeof Notice>['color'];
  message: string;
};

const ALERTS: NoticeExample[] = [
  {
    key: 'default',
    color: 'secondary',
    message: 'Use alerts to highlight contextual information inline with page content.'
  },
  {
    key: 'info',
    title: 'Information',
    color: 'primary',
    message: 'Share helpful tips or next steps without interrupting the flow.'
  },
  {
    key: 'success',
    title: 'Success',
    color: 'success',
    message: 'Confirm when actions complete successfully so users can continue.'
  },
  {
    key: 'warning',
    title: 'Warning',
    color: 'warning',
    message: 'Draw attention to inputs that need review before progressing.'
  },
  {
    key: 'error',
    title: 'Error',
    color: 'error',
    message: 'Describe blocking errors with guidance on how to resolve them.'
  }
];

export default function Demo() {
  return (
    <Column gap="lg">
      {ALERTS.map(({ key, title, color, message }) => (
        <Notice key={key} title={title} color={color}>
          {message}
        </Notice>
      ))}
      <Text variant="small" colorVariant="muted">
        Notices adapt their color palette to match the tone of the underlying message.
      </Text>
    </Column>
  );
}
