import type { LoaderProps } from '@platform-blocks/ui';
import { Block, Column, Loader, Row, Text } from '@platform-blocks/ui';

const LOADER_SIZES: Required<LoaderProps>['size'][] = ['xs', 'sm', 'md', 'lg', 'xl'];

export default function Demo() {
  return (
    <Column gap="md">
      {LOADER_SIZES.map((size) => (
        <Row key={size} gap="md" align="center">
          <Block minW={72}>
            <Text variant="small" colorVariant="muted">
              {String(size).toUpperCase()}
            </Text>
          </Block>
          <Loader variant="oval" size={size} />
          <Loader variant="bars" size={size} />
          <Loader variant="dots" size={size} />
        </Row>
      ))}
    </Column>
  );
}


