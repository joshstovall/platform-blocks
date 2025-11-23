import { Skeleton, Column, Row } from '@platform-blocks/ui';

export default function Demo() {
  return (
    <Column gap="lg">
      <Row gap="lg" align="center" wrap="wrap">
        <Skeleton shape="avatar" size="sm" />
        <Skeleton shape="avatar" size="md" />
        <Skeleton shape="avatar" size="lg" />
        <Skeleton shape="avatar" size="xl" />
      </Row>
      <Column gap="sm">
        <Skeleton shape="text" width="100%" />
        <Skeleton shape="text" width="90%" />
        <Skeleton shape="text" width="70%" />
      </Column>
      <Row gap="md" wrap="wrap">
        <Skeleton shape="button" width={80} />
        <Skeleton shape="button" width={100} />
        <Skeleton shape="button" width={120} />
      </Row>
      <Row gap="sm" wrap="wrap">
        <Skeleton shape="chip" />
        <Skeleton shape="chip" />
        <Skeleton shape="chip" />
      </Row>
      <Skeleton shape="rectangle" height={60} />
      <Skeleton shape="card" height={200} />
    </Column>
  );
}
