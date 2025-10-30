import { QRCode, Row, Text, Column } from '@platform-blocks/ui';

export default function Demo() {
  return (
    <Column gap={16}>
      <Row gap={24} wrap="wrap" align="center">
        <Column align="center" gap={8}>
          <QRCode
            value="https://platform-blocks.com/logo"
            size={180}
            moduleShape="rounded"
            cornerRadius={0.5}
            logo={{ 
              uri: 'placeholder', 
              size: 56, 
              backgroundColor: '#ffffff', 
              borderRadius: 12
            }}
          />
          <Text variant="caption">Rounded with Logo</Text>
        </Column>
        <Column align="center" gap={8}>
          <QRCode
            value="https://platform-blocks.com/brand"
            size={180}
            moduleShape="square"
            logo={{ 
              uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/2300px-React-icon.svg.png',
              size: 48, 
              backgroundColor: '#ffffff', 
              borderRadius: 4
            }}
          />
          <Text variant="caption">Square with Logo</Text>
        </Column>
      </Row>
    </Column>
  );
}


