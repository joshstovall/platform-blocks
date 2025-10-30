import { Skeleton, Column, Row } from '@platform-blocks/ui';

export default function Demo() {
  return (
    <Column gap={16}>
      <Row gap={16} align="center">
        <Skeleton shape="avatar" size="sm" />
        <Skeleton shape="avatar" size="md" />
        <Skeleton shape="avatar" size="lg" />
        <Skeleton shape="avatar" size="xl" />
      </Row>
      
      <Column gap={8}>
        <Skeleton shape="text" width="100%" />
        <Skeleton shape="text" width="90%" />
        <Skeleton shape="text" width="70%" />
      </Column>
      
      <Row gap={12}>
        <Skeleton shape="button" width={80} />
        <Skeleton shape="button" width={100} />
        <Skeleton shape="button" width={120} />
      </Row>
      
      <Row gap={8}>
        <Skeleton shape="chip" />
        <Skeleton shape="chip" />
        <Skeleton shape="chip" />
      </Row>
      
      <Skeleton shape="rectangle" height={60} />
      <Skeleton shape="card" height={200} />
    </Column>
  );
}
