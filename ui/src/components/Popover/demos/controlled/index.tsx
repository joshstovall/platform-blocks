import { useState } from 'react';
import { Button, Text, Input, Column } from '@platform-blocks/ui';
import { Popover, PopoverTarget, PopoverDropdown } from '../..';

export default function PopoverControlledDemo() {
  const [opened, setOpened] = useState(false);
  const [email, setEmail] = useState('team@example.com');

  return (
    <Column gap="md">
  <Button size="xs" variant="ghost" onPress={() => setOpened((value) => !value)}>
        {opened ? 'Close popover' : 'Open popover'}
      </Button>
      <Popover opened={opened} onChange={setOpened} trapFocus>
        <PopoverTarget>
          <Button size="sm" variant="outline">
            Invite teammate
          </Button>
        </PopoverTarget>
        <PopoverDropdown>
          <Column gap="sm" style={{ padding: 16, width: 260 }}>
            <Text weight="semibold">Invite by email</Text>
            <Input
              value={email}
              onChangeText={setEmail}
              placeholder="name@example.com"
            />
            <Button size="xs" onPress={() => setOpened(false)}>
              Send invite
            </Button>
          </Column>
        </PopoverDropdown>
      </Popover>
    </Column>
  );
}
