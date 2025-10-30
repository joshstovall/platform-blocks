import { KeyCap, Row } from '@platform-blocks/ui';

export const code = `
import { KeyCap, Row } from '@platform-blocks/ui';

export default function Demo() {
  return (
    <Row gap={8} wrap="wrap">
      <KeyCap>A</KeyCap>
      <KeyCap>Enter</KeyCap>
      <KeyCap>Space</KeyCap>
      <KeyCap>⌘</KeyCap>
      <KeyCap>Ctrl</KeyCap>
      <KeyCap>⇧</KeyCap>
    </Row>
  );
}
`;

export default function Demo() {
  return (
    <Row gap={8} wrap="wrap">
      <KeyCap>A</KeyCap>
      <KeyCap>Enter</KeyCap>
      <KeyCap>Space</KeyCap>
      <KeyCap>⌘</KeyCap>
      <KeyCap>Ctrl</KeyCap>
      <KeyCap>⇧</KeyCap>
    </Row>
  );
}


