import { KeyCap, Row, Text, Column } from '@platform-blocks/ui';

export default function Demo() {
  return (
    <Column gap={16}>
      <Text variant="h6">KeyCap Sizes</Text>
      <Row gap={8} align="center" wrap="wrap">
        <KeyCap size="xs">XS</KeyCap>
        <KeyCap size="sm">SM</KeyCap>
        <KeyCap size="md">MD</KeyCap>
        <KeyCap size="lg">LG</KeyCap>
        <KeyCap size="xl">XL</KeyCap>
      </Row>
    </Column>
  );
}


