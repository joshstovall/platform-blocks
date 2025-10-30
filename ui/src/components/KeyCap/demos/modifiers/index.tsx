import { KeyCap, Row, Text, Column } from '@platform-blocks/ui';

export default function Demo() {
  return (
    <Column gap={16}>
      <Text variant="h6">Keyboard Shortcuts</Text>
      <Column gap={8}>
        <Row gap={4} align="center">
          <Text>Copy: </Text>
          <KeyCap keyCode="C" modifiers={['cmd']} size="sm">⌘</KeyCap>
          <Text>+</Text>
          <KeyCap keyCode="C" modifiers={['cmd']} size="sm">C</KeyCap>
        </Row>
        
        <Row gap={4} align="center">
          <Text>Save: </Text>
          <KeyCap keyCode="S" modifiers={['cmd']} size="sm">⌘</KeyCap>
          <Text>+</Text>
          <KeyCap keyCode="S" modifiers={['cmd']} size="sm">S</KeyCap>
        </Row>
        
        <Row gap={4} align="center">
          <Text>Undo: </Text>
          <KeyCap keyCode="Z" modifiers={['cmd']} size="sm">⌘</KeyCap>
          <Text>+</Text>
          <KeyCap keyCode="Z" modifiers={['cmd']} size="sm">Z</KeyCap>
        </Row>
      </Column>
    </Column>
  );
}


