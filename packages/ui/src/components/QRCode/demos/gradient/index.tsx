import { Column, QRCode, Row, Text, useTheme } from '@platform-blocks/ui';

export default function Demo() {
  const theme = useTheme();

  const gradients = [
    {
      label: 'Linear blend',
      value: 'https://platform-blocks.com/linear',
      gradient: {
        from: theme.colors.primary[6],
        to: theme.colors.highlight[5],
        type: 'linear' as const,
        rotation: 45
      },
      moduleShape: 'rounded' as const,
      cornerRadius: 0.4
    },
    {
      label: 'Radial bloom',
      value: 'https://platform-blocks.com/radial',
      gradient: {
        from: theme.colors.success[5],
        to: theme.colors.primary[4],
        type: 'radial' as const
      },
      moduleShape: 'diamond' as const,
      cornerRadius: undefined
    }
  ] as const;

  return (
    <Column gap="lg">
      <Text variant="small" colorVariant="muted">
        Gradient fills
      </Text>
      <Row gap="lg" wrap="wrap" justify="center">
        {gradients.map(({ label, value, gradient, moduleShape, cornerRadius }) => (
          <Column key={label} gap="xs" align="center">
            <QRCode
              value={value}
              size={160}
              gradient={gradient}
              moduleShape={moduleShape}
              cornerRadius={cornerRadius}
              quietZone={2}
            />
            <Text variant="small" colorVariant="muted">
              {label}
            </Text>
          </Column>
        ))}
      </Row>
    </Column>
  );
}


