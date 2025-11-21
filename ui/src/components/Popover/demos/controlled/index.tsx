import { useState } from 'react';
import { Button, Text, Input, Column, Block } from '@platform-blocks/ui';
import { Popover } from '../..';

export default function PopoverControlledDemo() {
  const [opened, setOpened] = useState(false);
  const [email, setEmail] = useState('team@example.com');

  return (
    <Block gap="md">
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
          <Block gap={0}>
            <Input
              value={email}
              onChangeText={setEmail}
              placeholder="name@example.com"
              label="Email address"
              fullWidth
            />
            <Button size="xs" onPress={() => setOpened(false)}>
              Send invite
            </Button>
          </Block>
        </Popover.Dropdown>
      </Popover>
    </Block>
  );
}
