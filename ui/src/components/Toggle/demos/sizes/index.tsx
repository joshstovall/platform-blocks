import { Column, Text, ToggleButton, ToggleGroup } from '@platform-blocks/ui';

const sizes = [
  { label: 'Small', value: 'sm' as const },
  { label: 'Medium', value: 'md' as const },
  { label: 'Large', value: 'lg' as const },
];

export default function Demo() {
  return (
    <Column gap="md">
      <Column gap="xs">
        <Text weight="semibold">Size variants</Text>
        <Text size="xs" colorVariant="secondary">
          Adjust the `size` prop to scale the toggle buttons.
        </Text>
      </Column>

      <Column gap="sm">
        {sizes.map(({ label, value }) => (
          <Column key={value} gap="xs">
            <Text size="sm" weight="semibold">
              {label}
            </Text>
            <ToggleGroup size={value}>
              <ToggleButton value="left">Left</ToggleButton>
              <ToggleButton value="center">Center</ToggleButton>
              <ToggleButton value="right">Right</ToggleButton>
            </ToggleGroup>
          </Column>
        ))}
      </Column>
    </Column>
  );
}
