import { Loader, Row } from '@platform-blocks/ui';

export default function Demo() {
  return (
    <Row gap="lg" align="center">
      <Loader variant="oval" />
      <Loader variant="bars" />
      <Loader variant="dots" />
    </Row>
  );
}


