import { Column, KeyCap, Row } from '@platform-blocks/ui';

export default function Demo() {
  return (
    <Column gap="sm" align="flex-start">
      <Row gap="sm" align="center" wrap="wrap">
        <KeyCap size="xs">XS</KeyCap>
        <KeyCap size="sm">SM</KeyCap>
        <KeyCap size="md">MD</KeyCap>
        <KeyCap size="lg">LG</KeyCap>
        <KeyCap size="xl">XL</KeyCap>
      </Row>
    </Column>
  );
}


