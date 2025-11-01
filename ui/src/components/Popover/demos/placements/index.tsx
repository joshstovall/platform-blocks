import { Button, Text, Flex } from '@platform-blocks/ui';
import { Popover, PopoverTarget, PopoverDropdown } from '../..';

type PlacementOption = {
  label: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end' | 'left-start' | 'left-end' | 'right-start' | 'right-end';
};

const OPTIONS: PlacementOption[] = [
  { label: 'Top', position: 'top' },
  { label: 'Top start', position: 'top-start' },
  { label: 'Top end', position: 'top-end' },
  { label: 'Right', position: 'right' },
  { label: 'Right start', position: 'right-start' },
  { label: 'Right end', position: 'right-end' },
  { label: 'Bottom', position: 'bottom' },
  { label: 'Bottom start', position: 'bottom-start' },
  { label: 'Bottom end', position: 'bottom-end' },
  { label: 'Left', position: 'left' },
  { label: 'Left start', position: 'left-start' },
  { label: 'Left end', position: 'left-end' },
];

export default function PopoverPlacementsDemo() {
  return (
    <Flex wrap="wrap" gap="md" style={{ maxWidth: 520 }}>
      {OPTIONS.map(({ label, position }) => (
        <Popover key={position} position={position} withArrow>
          <PopoverTarget>
            <Button size="xs" variant="outline">
              {label}
            </Button>
          </PopoverTarget>
          <PopoverDropdown>
            <Text style={{ padding: 12 }}>Placement: {position}</Text>
          </PopoverDropdown>
        </Popover>
      ))}
    </Flex>
  );
}
