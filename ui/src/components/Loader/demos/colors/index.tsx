import { Loader, Row, Column, Text } from '@platform-blocks/ui';
import { DESIGN_TOKENS } from '../../../../core/design-tokens';

export default function Demo() {
  const colors = [
    { name: 'Primary', color: '#3B82F6' },
    { name: 'Success', color: '#10B981' },
    { name: 'Warning', color: '#F59E0B' },
    { name: 'Error', color: '#EF4444' },
  ];

  return (
    <Column gap={DESIGN_TOKENS.spacing.md}>
      {colors.map(({ name, color }) => (
        <Row key={name} gap={DESIGN_TOKENS.spacing.md} align="center">
          <Text variant="small" align="right" style={{ width: 80 }}>
            {name}:
          </Text>
          <Loader variant="oval" color={color} />
          <Loader variant="bars" color={color} />
          <Loader variant="dots" color={color} />
        </Row>
      ))}
    </Column>
  );
}
