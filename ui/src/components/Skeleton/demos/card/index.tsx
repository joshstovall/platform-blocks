import { Skeleton, Column, Row, Card } from '@platform-blocks/ui';

export default function Demo() {
  return (
    <Card variant="outline" p={16}>
      <Row gap={12} mb={16}>
        <Skeleton shape="avatar" size="lg" />
        <Column gap={6} grow={1}>
          <Skeleton shape="text" width="30%" />
          <Skeleton shape="text" width="50%" />
        </Column>
      </Row>
      
      <Skeleton shape="rectangle" height={120} mb={12} />
      
      <Skeleton shape="text" width="100%" mb={6} />
      <Skeleton shape="text" width="80%" mb={12} />
      
      <Row gap={8}>
        <Skeleton shape="chip" />
        <Skeleton shape="chip" />
        <Skeleton shape="chip" />
      </Row>
    </Card>
  );
}
