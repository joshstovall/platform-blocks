import { ColorPicker, Card, Text, Column, Button } from '@platform-blocks/ui';

export default function Demo() {
  return (
    <Column gap={16}>
      <Card p={16} variant="outline">
        <Text size="sm" weight="semibold" mb={8}>Uncontrolled with Default Value</Text>
        <ColorPicker
          defaultValue="#FF6B6B"
          onChange={(color) => console.log('Color changed:', color)}
          label="Choose a color"
          placeholder="Select your favorite color"
        />
      </Card>

      <Card p={16} variant="outline">
        <Text size="sm" weight="semibold" mb={8}>Uncontrolled without Default Value</Text>
        <ColorPicker
          onChange={(color) => console.log('Color changed:', color)}
          label="Choose a color"
          placeholder="No color selected"
        />
      </Card>

      <Card p={16} variant="outline">
        <Text size="sm" weight="semibold" mb={8}>Uncontrolled with Custom Swatches</Text>
        <ColorPicker
          defaultValue="#4ECDC4"
          onChange={(color) => console.log('Color changed:', color)}
          label="Blue/Green palette"
          swatches={[
            '#E3F2FD', '#BBDEFB', '#90CAF9', '#64B5F6', '#42A5F5',
            '#2196F3', '#1E88E5', '#1976D2', '#1565C0', '#0D47A1',
            '#E8F5E8', '#C8E6C9', '#A5D6A7', '#81C784', '#66BB6A',
            '#4CAF50', '#43A047', '#388E3C', '#2E7D32', '#1B5E20',
          ]}
        />
      </Card>

      <Card p={16} variant="outline">
        <Text size="sm" weight="semibold" mb={8}>Uncontrolled - No Swatches</Text>
        <ColorPicker
          defaultValue="#9C27B0"
          onChange={(color) => console.log('Color changed:', color)}
          label="Color wheel only"
          withSwatches={false}
        />
      </Card>
    </Column>
  );
}