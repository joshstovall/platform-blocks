import { Button, Column, useToast } from '@platform-blocks/ui';

export default function Demo() {
  const toast = useToast();

  return (
    <Column gap="sm" align="flex-start">
      <Button onPress={() => toast.success('Launch command sent')}>Launch mission</Button>
      <Button variant="secondary" onPress={() => toast.info('Sequence aborted')}>Abort</Button>
    </Column>
  );
}
