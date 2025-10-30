import { ToggleButton, ToggleGroup } from '@platform-blocks/ui';

export default function BasicToggleDemo() {
  return (
    <ToggleGroup>
      <ToggleButton value="left">Left</ToggleButton>
      <ToggleButton value="center">Center</ToggleButton>
      <ToggleButton value="right">Right</ToggleButton>
    </ToggleGroup>
  );
}
