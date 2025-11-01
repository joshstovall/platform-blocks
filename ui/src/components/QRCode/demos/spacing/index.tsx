import { View } from 'react-native';
import { QRCode, Column, Text } from '@platform-blocks/ui';

export default function Demo() {
  return (
    <Column gap={24} align="center">
      {/* Default QRCode with significant quiet zone */}
      <View style={{ alignItems: 'center' }}>
        <QRCode
          value="https://platform-blocks.com"
          size={150}
        />
        <Text variant="caption" style={{ marginTop: 8, color: '#6b7280' }}>
          Default (quietZone: 4)
        </Text>
      </View>

      {/* Reduced quiet zone for tighter spacing */}
      <View style={{ alignItems: 'center' }}>
        <QRCode
          value="https://platform-blocks.com"
          size={150}
          quietZone={1}
        />
        <Text variant="caption" style={{ marginTop: 8, color: '#6b7280' }}>
          Minimal padding (quietZone: 1)
        </Text>
      </View>

      {/* No quiet zone for maximum code density */}
      <View style={{ alignItems: 'center' }}>
        <QRCode
          value="https://platform-blocks.com"
          size={150}
          quietZone={0}
        />
        <Text variant="caption" style={{ marginTop: 8, color: '#6b7280' }}>
          No padding (quietZone: 0)
        </Text>
      </View>

      {/* Using spacing props for external margin control */}
      <View style={{ alignItems: 'center' }}>
        <QRCode
          value="https://platform-blocks.com"
          size={150}
          quietZone={0}
          m={16} // 16px margin on all sides
          p={8}  // 8px padding inside the container
          style={{ backgroundColor: '#f3f4f6', borderRadius: 12 }}
        />
        <Text variant="caption" style={{ marginTop: 8, color: '#6b7280' }}>
          Custom container styling + spacing props
        </Text>
      </View>
    </Column>
  );
}
