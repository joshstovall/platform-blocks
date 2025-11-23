import { Block, Column, Row, Skeleton, useTheme } from '@platform-blocks/ui';

export default function Demo() {
  const theme = useTheme();

  return (
    <Block
      p="lg"
      radius="lg"
      borderWidth={1}
      borderColor={theme.backgrounds.border}
      bg={theme.backgrounds.surface}
    >
      <Column gap="lg">
        <Row gap="md" align="center">
          <Skeleton shape="avatar" size="lg" />
          <Column gap="xs" grow={1}>
            <Skeleton shape="text" width="32%" />
            <Skeleton shape="text" width="48%" />
          </Column>
        </Row>
        <Skeleton shape="rectangle" height={120} />
        <Column gap="xs">
          <Skeleton shape="text" width="100%" />
          <Skeleton shape="text" width="78%" />
        </Column>
        <Row gap="sm" wrap="wrap">
          <Skeleton shape="chip" />
          <Skeleton shape="chip" />
          <Skeleton shape="chip" />
        </Row>
      </Column>
    </Block>
  );
}
