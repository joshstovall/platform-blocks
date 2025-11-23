import type { IndicatorProps } from '@platform-blocks/ui';
import { Block, Column, Indicator, Row, Text } from '@platform-blocks/ui';

const tokenSizes: IndicatorProps['size'][] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'];
const countSizes: IndicatorProps['size'][] = ['xs', 'sm', 'md', 'lg', 'xl'];

export default function Demo() {
  return (
    <Column gap="lg">
      <Column gap="xs">
        <Text size="sm" weight="medium">
          Size tokens
        </Text>

        <Row gap="lg" wrap="wrap">
          {tokenSizes.map((size) => (
            <Column key={size} align="center" gap="xs">
              <Text size="xs" colorVariant="secondary" uppercase>
                {size}
              </Text>
              <Block
                w={72}
                h={72}
                radius="lg"
                bg="#f5f5f7"
                position="relative"
                align="center"
                justify="center"
              >
                <Text size="xs" colorVariant="secondary">
                  Item
                </Text>
                <Indicator placement="top-right" size={size} color="#6366F1" offset={4} />
              </Block>
            </Column>
          ))}
        </Row>
      </Column>

      <Column gap="xs">
        <Text size="sm" weight="medium">
          Indicators with content
        </Text>

        <Row gap="lg" wrap="wrap">
          {countSizes.map((size, index) => (
            <Column key={size} align="center" gap="xs">
              <Text size="xs" colorVariant="secondary">
                {size}
              </Text>
              <Block
                w={88}
                h={64}
                radius="lg"
                bg="#eef2ff"
                position="relative"
                align="center"
                justify="center"
              >
                <Text size="xs" colorVariant="secondary">
                  Inbox
                </Text>
                <Indicator placement="top-right" size={size} color="#0ea5e9" offset={6}>
                  <Text size="xs" weight="bold" color="white">
                    {index === 0 ? '1' : index === 1 ? '5' : index === 2 ? '12' : index === 3 ? '72' : '99+'}
                  </Text>
                </Indicator>
              </Block>
            </Column>
          ))}
        </Row>
      </Column>

      <Column gap="xs">
        <Text size="sm" weight="medium">
          Numeric values
        </Text>

        <Row gap="md" align="center">
          <Block
            w={72}
            h={72}
            radius="lg"
            bg="#f5f5f7"
            position="relative"
            align="center"
            justify="center"
          >
            <Text size="xs" colorVariant="secondary">
              Custom
            </Text>
            <Indicator placement="top-right" size={24} color="#ef4444" offset={4} />
          </Block>
          <Text size="xs" colorVariant="secondary">
            size={24}
          </Text>
        </Row>
      </Column>
    </Column>
  );
}