import { Button, Column, Dialog, Row, Text, useDisclosure } from '@platform-blocks/ui';

export default function Demo() {
  const [opened, { open, close, toggle }] = useDisclosure(false, {
    onOpen: () => console.log('opened'),
    onClose: () => console.log('closed'),
  });

  return (
    <Column gap="md">
      <Text>
        State: <Text weight="700">{opened ? 'open' : 'closed'}</Text>
      </Text>

      <Row gap="sm">
        <Button onPress={open}>open</Button>
        <Button variant="outline" onPress={close}>close</Button>
        <Button variant="ghost" onPress={toggle}>toggle</Button>
      </Row>

      <Dialog visible={opened} title="Dialog title" onClose={close}>
        <Column gap="md" p="md">
          <Text>This dialog's open state is managed by useDisclosure.</Text>
          <Button onPress={close}>Close</Button>
        </Column>
      </Dialog>
    </Column>
  );
}
