import { Button, Text, Column } from '@platform-blocks/ui';
import { Popover } from '../..';

export default function PopoverBasicDemo() {
  return (
    <Popover>
      <Popover.Target>
        <Button size="sm" variant="outline">
          Toggle popover
        </Button>
      </Popover.Target>
      <Popover.Dropdown>
        <Column gap="xs" style={{ padding: 16, maxWidth: 240 }}>
          <Text weight="semibold">Quick actions</Text>
          <Text variant="caption" colorVariant="secondary">
            Use popovers for lightweight flows that need more room than tooltips.
          </Text>
          <Button size="xs" variant="ghost">
            Create new entry
          </Button>
          <Button size="xs" variant="ghost">
            View documentation
          </Button>
        </Column>
      </Popover.Dropdown>
    </Popover>
  );
}
