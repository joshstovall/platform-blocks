import { Skeleton, Column, Row } from '@platform-blocks/ui';

export default function Demo() {
  return (
    <Column gap={16}>
      <Skeleton shape="text" width="60%" />
      <Skeleton shape="text" width="80%" />
      <Skeleton shape="text" width="40%" />
      
      <Row gap={12} align="center">
        <Skeleton shape="avatar" size="lg" />
        <Column gap={8} grow={1}>
          <Skeleton shape="text" width="40%" />
          <Skeleton shape="text" width="60%" />
        </Column>
      </Row>
      
      <Skeleton shape="rectangle" height={120} />
      <Skeleton shape="button" width={120} />
    </Column>
  );
}
