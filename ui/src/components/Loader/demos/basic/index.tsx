import { Loader, Row } from '@platform-blocks/ui';

export default function Demo() {
  return (
    <Row gap={24} align="center">
      <Loader variant="oval" />
      <Loader variant="bars" />
      <Loader variant="dots" />
    </Row>
  );
}


