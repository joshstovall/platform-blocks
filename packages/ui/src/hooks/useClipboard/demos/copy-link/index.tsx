import { useState } from 'react';
import { Badge, Button, Card, Column, Input, Text } from '@platform-blocks/ui';
import { useClipboard } from '../..';

const INVITE_URL = 'https://app.example.com/invite/engineering';

export default function Demo() {
  const { copy, copied, unsupported, lastValue } = useClipboard({ timeout: 1500 });
  const [value, setValue] = useState(INVITE_URL);

  return (
    <Column gap="md" fullWidth>
      <Text weight="semibold">Copy invite links with status feedback</Text>
      <Text size="sm" colorVariant="secondary">
        The hook normalises clipboard access across platforms and resets the copied state automatically.
      </Text>
      <Card variant="outline" style={{ padding: 16, gap: 12, maxWidth: 460 }}>
        <Input
          value={value}
          onChangeText={setValue}
          label="Invite URL"
          textInputProps={{ autoCapitalize: 'none' }}
        />
        <Button onPress={() => copy(value)} disabled={unsupported}>
          {copied ? 'Copied!' : 'Copy link'}
        </Button>
        <Column gap="xs">
          <Text size="xs" colorVariant="muted">
            {unsupported
              ? 'Clipboard access is not available in this environment.'
              : 'The status resets automatically after 1.5 seconds.'}
          </Text>
          {lastValue ? (
            <Badge variant="subtle" color="primary">{lastValue}</Badge>
          ) : null}
        </Column>
      </Card>
    </Column>
  );
}
