import { Link, Row, Text, Column } from '@platform-blocks/ui';

export default function Demo() {
  return (
    <Column gap={12}>
      <Row gap={8} align="center">
        <Text variant="caption">XS:</Text>
        <Link href="#" size="xs" color="primary">
          Extra small link
        </Link>
      </Row>
      
      <Row gap={8} align="center">
        <Text variant="caption">SM:</Text>
        <Link href="#" size="sm" color="primary">
          Small link
        </Link>
      </Row>
      
      <Row gap={8} align="center">
        <Text variant="caption">MD:</Text>
        <Link href="#" size="md" color="primary">
          Medium link
        </Link>
      </Row>
      
      <Row gap={8} align="center">
        <Text variant="caption">LG:</Text>
        <Link href="#" size="lg" color="primary">
          Large link (default)
        </Link>
      </Row>
      
      <Row gap={8} align="center">
        <Text variant="caption">XL:</Text>
        <Link href="#" size="xl" color="primary">
          Extra large link
        </Link>
      </Row>
    </Column>
  );
}


