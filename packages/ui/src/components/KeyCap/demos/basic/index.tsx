import { Column, KeyCap, Row } from '@platform-blocks/ui';

export default function Demo() {
  return (
    <Column gap="sm" align="flex-start">
      <Row gap="sm" wrap="wrap">
        <KeyCap>A</KeyCap>
        <KeyCap>Enter</KeyCap>
        <KeyCap>Space</KeyCap>
        <KeyCap>⌘</KeyCap>
        <KeyCap>Ctrl</KeyCap>
        <KeyCap>⇧</KeyCap>
      </Row>
    </Column>
  );
}


