import { QRCode, Row, Text, Column } from '@platform-blocks/ui';

export default function Demo() {
  return (
    <Column gap={20}>
      
      <Row gap={24} wrap="wrap" justify="center">
        <Column align="center" gap={8}>
          <QRCode 
            value="https://platform-blocks.com/square" 
            size={150} 
            moduleShape="square"
            quietZone={1}
            style={{ borderRadius: 12, overflow: 'hidden' }}
          />
          <Text variant="caption" style={{ color: '#6b7280' }}>Square modules</Text>
        </Column>
        
        <Column align="center" gap={8}>
          <QRCode 
            value="https://platform-blocks.com/rounded" 
            size={150} 
            moduleShape="rounded" 
            cornerRadius={0.4}
            quietZone={1}
            style={{ borderRadius: 12, overflow: 'hidden' }}
          />
          <Text variant="caption" style={{ color: '#6b7280' }}>Rounded modules</Text>
        </Column>
        
        <Column align="center" gap={8}>
          <QRCode 
            value="https://platform-blocks.com/diamond" 
            size={150} 
            moduleShape="diamond"
            quietZone={1}
            style={{ borderRadius: 12, overflow: 'hidden' }} 
          />
          <Text variant="caption" style={{ color: '#6b7280' }}>Diamond modules</Text>
        </Column>
      </Row>
    </Column>
  );
}


