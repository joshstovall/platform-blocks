import { Loader, Row, Column, Text } from '@platform-blocks/ui';
import { DESIGN_TOKENS } from '../../../../core/design-tokens';

export default function Demo() {
  return (
    <Column gap={DESIGN_TOKENS.spacing.md}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <Row key={size} gap={DESIGN_TOKENS.spacing.md} align="center">
          <Text variant="body" style={{ width: 40, fontSize: DESIGN_TOKENS.typography.fontSize.xs }}>
            {size}:
          </Text>
          <Loader variant="oval" size={size} />
          <Loader variant="bars" size={size} />
          <Loader variant="dots" size={size} />
        </Row>
      ))}
    </Column>
  );
}


