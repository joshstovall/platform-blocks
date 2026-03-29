import { useState } from 'react';
import { Button, Card, Column, Input, Popover, Text } from '@platform-blocks/ui';

export default function Demo() {
  const [opened, setOpened] = useState(false);
  const [email, setEmail] = useState('team@example.com');

  return (
    <Column gap="lg">
      <Card p="md">
        <Column gap="md">
          <Button size="xs" variant="ghost" onPress={() => setOpened((value) => !value)}>
            {opened ? 'Close popover' : 'Open popover'}
          </Button>
          <Popover opened={opened} onChange={setOpened} trapFocus>
            <Popover.Target>
              <Button size="sm" variant="outline">
                Invite teammate
              </Button>
            </Popover.Target>
            <Popover.Dropdown>
              <Column gap="sm" p="sm" style={{ width: 260 }}>
                <Text weight="semibold">Invite team member</Text>
                <Input
                  label="Email"
                  placeholder="name@example.com"
                  value={email}
                  onChangeText={setEmail}
                  size="sm"
                  fullWidth
                />
                <Button size="xs" onPress={() => setOpened(false)}>
                  Send invite
                </Button>
              </Column>
            </Popover.Dropdown>
          </Popover>
        </Column>
      </Card>
    </Column>
  );
}
