import { useState } from 'react';
import { Block, Button, Column, Input, QRCode, Row, Text } from '@platform-blocks/ui';

const PRESETS = [
  { label: 'Docs', value: 'https://platform-blocks.com' },
  { label: 'Support', value: 'mailto:support@platform-blocks.com' },
  { label: 'SMS', value: 'sms:+1234567890?body=Go Blocks!' }
] as const;

const SIZES = [144, 168, 192] as const;
const ERROR_LEVELS = ['L', 'M', 'Q', 'H'] as const;
const MODULE_SHAPES = ['square', 'rounded', 'diamond'] as const;

export default function Demo() {
  const [value, setValue] = useState<string>(PRESETS[0].value);
  const [size, setSize] = useState<(typeof SIZES)[number]>(SIZES[1]);
  const [errorLevel, setErrorLevel] = useState<(typeof ERROR_LEVELS)[number]>('M');
  const [moduleShape, setModuleShape] = useState<(typeof MODULE_SHAPES)[number]>('square');

  return (
    <Column gap="lg">
      <Column gap="sm">
        <Text variant="small" colorVariant="muted">
          Source content
        </Text>
        <Input
          value={value}
          onChangeText={setValue}
          placeholder="Enter text, URL, or contact info"
          multiline
          minLines={1}
          maxLines={3}
        />
        <Row gap="xs" wrap="wrap">
          {PRESETS.map(({ label, value: preset }) => (
            <Button
              key={label}
              size="xs"
              variant={value === preset ? 'filled' : 'outline'}
              onPress={() => setValue(preset)}
            >
              {label}
            </Button>
          ))}
        </Row>
        <Text variant="small" colorVariant="muted">
          {value.length} characters
        </Text>
      </Column>
      <Row gap="lg" wrap="wrap" align="flex-start">
        <Block maxW={320} w="full">
          <Column gap="md">
            <Column gap="xs">
              <Text variant="small" colorVariant="muted">
                Size
              </Text>
              <Row gap="xs" wrap="wrap">
                {SIZES.map((option) => (
                  <Button
                    key={option}
                    size="xs"
                    variant={size === option ? 'filled' : 'outline'}
                    onPress={() => setSize(option)}
                  >
                    {option}px
                  </Button>
                ))}
              </Row>
            </Column>
            <Column gap="xs">
              <Text variant="small" colorVariant="muted">
                Error correction
              </Text>
              <Row gap="xs" wrap="wrap">
                {ERROR_LEVELS.map((level) => (
                  <Button
                    key={level}
                    size="xs"
                    variant={errorLevel === level ? 'filled' : 'outline'}
                    onPress={() => setErrorLevel(level)}
                  >
                    {level}
                  </Button>
                ))}
              </Row>
              <Text variant="small" colorVariant="muted">
                L≈7% • M≈15% • Q≈25% • H≈30% recovery
              </Text>
            </Column>
            <Column gap="xs">
              <Text variant="small" colorVariant="muted">
                Module shape
              </Text>
              <Row gap="xs" wrap="wrap">
                {MODULE_SHAPES.map((shape) => (
                  <Button
                    key={shape}
                    size="xs"
                    variant={moduleShape === shape ? 'filled' : 'outline'}
                    onPress={() => setModuleShape(shape)}
                  >
                    {shape.charAt(0).toUpperCase() + shape.slice(1)}
                  </Button>
                ))}
              </Row>
            </Column>
          </Column>
        </Block>
        <Column gap="xs" align="center">
          <QRCode
            value={value || 'Platform Blocks'}
            size={size}
            quietZone={2}
            errorCorrectionLevel={errorLevel}
            moduleShape={moduleShape}
            cornerRadius={moduleShape === 'rounded' ? 0.4 : undefined}
            copyOnPress={{ value }}
          />
          <Text variant="small" colorVariant="muted" style={{ textAlign: 'center' }}>
            {size}px • Level {errorLevel} • {moduleShape} modules
          </Text>
        </Column>
      </Row>
    </Column>
  );
}


