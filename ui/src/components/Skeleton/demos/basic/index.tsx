import { Skeleton, Column, Row } from '@platform-blocks/ui';

export default function Demo() {
  return (
    <Column gap="lg">
      <Skeleton shape="text" w="60%" />
      <Skeleton shape="text" w="80%" />
      <Skeleton shape="text" w="40%" />
      <Row gap="md" align="center">
        <Skeleton shape="avatar" size="lg" />
        <Column gap="sm" grow={1}>
          <Skeleton shape="text" w="40%" />
          <Skeleton shape="text" w="60%" />
        </Column>
      </Row>
      <Skeleton shape="rectangle" h={120} />
      <Skeleton shape="button" w={120} />
    </Column>
  );
}
