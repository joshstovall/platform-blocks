import { QRCode, Row, Text, Column } from '@platform-blocks/ui';

export default function Demo() {
  return (
    <Column gap={16}>
      <Text variant="h6">QR Code Gradients</Text>
      <Row gap={24} wrap="wrap" align="center">
        <Column align="center" gap={8}>
          <QRCode
            value="https://platform-blocks.com/linear"
            size={160}
            gradient={{ 
              from: '#4f46e5', 
              to: '#ec4899', 
              type: 'linear', 
              rotation: 45 
            }}
            moduleShape="rounded"
            cornerRadius={0.5}
          />
          <Text variant="caption">Linear Gradient</Text>
        </Column>
        <Column align="center" gap={8}>
          <QRCode
            value="https://platform-blocks.com/radial"
            size={160}
            gradient={{ 
              from: '#06b6d4', 
              to: '#3b82f6', 
              type: 'radial' 
            }}
            moduleShape="diamond"
          />
          <Text variant="caption">Radial Gradient</Text>
        </Column>
      </Row>
    </Column>
  );
}


