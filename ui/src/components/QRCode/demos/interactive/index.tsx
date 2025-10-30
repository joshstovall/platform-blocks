import { useState } from 'react';
import { QRCode, Row, Text, Column, Button, Card, Input } from '@platform-blocks/ui';

export default function Demo() {
  const [qrValue, setQrValue] = useState('https://platform-blocks.com');
  const [qrSize, setQrSize] = useState(180);
  const [errorLevel, setErrorLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [moduleShape, setModuleShape] = useState<'square' | 'rounded' | 'diamond'>('square');
  
  const presets = [
    { label: 'Website', value: 'https://platform-blocks.com' },
    { label: 'Email', value: 'mailto:hello@platform-blocks.com' },
    { label: 'Phone', value: 'tel:+1234567890' },
    { label: 'WiFi', value: 'WIFI:T:WPA;S:MyNetwork;P:MyPassword;;' },
    { label: 'SMS', value: 'sms:+1234567890?body=Hello from QR code!' },
    { label: 'Text', value: 'Hello from Platform Blocks!' },
  ];

  return (
    <Column gap={24}>
      
      <Row gap={24} wrap="wrap">
        <Column gap={16} style={{ minWidth: 250 }}>
       <Input
                value={qrValue}
                onChangeText={setQrValue}
                placeholder="Enter text, URL, email, phone..."
                multiline
                minLines={1}
                maxLines={4}
               />
              <Text variant="caption" style={{ color: '#6b7280' }}>
                Characters: {qrValue.length} • Updates in real-time
              </Text>
          
          
          <Card padding={16}>
            <Column gap={12}>
              <Text variant="body" weight="medium">Settings</Text>
              <Column gap={8}>
                <Text variant="caption" weight="medium">Size</Text>
                <Row gap={8}>
                  {[140, 180, 220].map(size => (
                    <Button
                      key={size}
                      variant={qrSize === size ? 'filled' : 'outline'}
                      size="sm"
                      onPress={() => setQrSize(size)}
                    >
                      {`${size}px`}
                    </Button>
                  ))}
                </Row>
              </Column>
              
              <Column gap={8}>
                <Text variant="caption" weight="medium">Error Correction</Text>
                <Row gap={8}>
                  {(['L', 'M', 'Q', 'H'] as const).map(level => (
                    <Button
                      key={level}
                      variant={errorLevel === level ? 'filled' : 'outline'}
                      size="sm"
                      onPress={() => setErrorLevel(level)}
                    >
                      {level}
                    </Button>
                  ))}
                </Row>
                <Text variant="caption" style={{ color: '#6b7280', fontSize: 11 }}>
                  L=~7% • M=~15% • Q=~25% • H=~30% error recovery
                </Text>
              </Column>
              
              <Column gap={8}>
                <Text variant="caption" weight="medium">Module Shape</Text>
                <Row gap={8}>
                  {(['square', 'rounded', 'diamond'] as const).map(shape => (
                    <Button
                      key={shape}
                      variant={moduleShape === shape ? 'filled' : 'outline'}
                      size="sm"
                      onPress={() => setModuleShape(shape)}
                    >
                      {shape.charAt(0).toUpperCase() + shape.slice(1)}
                    </Button>
                  ))}
                </Row>
                <Text variant="caption" style={{ color: '#6b7280', fontSize: 11 }}>
                  Finder patterns always remain square for scanner compatibility
                </Text>
              </Column>
            </Column>
          </Card>
        </Column>
        
        <Column align="center" gap={12}>
          <QRCode
            value={qrValue || 'Enter text to generate QR code'}
            size={qrSize}
            quietZone={1}
            errorCorrectionLevel={errorLevel}
            moduleShape={moduleShape}
            cornerRadius={moduleShape === 'rounded' ? 0.4 : undefined}
            copyOnPress={{ value: qrValue }}
            style={{
              borderRadius: 12,
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              elevation: 4,
            }}
          />
          <Column gap={4} align="center">
            <Text variant="caption" style={{ 
              maxWidth: Math.max(qrSize, 200), 
              textAlign: 'center', 
              color: '#6b7280',
              lineHeight: 16
            }}>
              {qrValue || 'QR code will appear here'}
            </Text>
            <Text variant="caption" style={{ 
              color: '#9ca3af', 
              fontSize: 11,
              textAlign: 'center'
            }}>
              Tap QR code to copy • {qrSize}×{qrSize}px • {moduleShape} modules • Error level: {errorLevel}
            </Text>
          </Column>
        </Column>
      </Row>
    </Column>
  );
}


