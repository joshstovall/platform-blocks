import { Button, Column, Text, useDialog } from '@platform-blocks/ui';

export default function Demo() {
  const { openDialog, closeDialog } = useDialog();

  const open = (titleProps: any) => {
    const id = openDialog({
      variant: 'modal',
      title: 'Welcome aboard',
      titleProps,
      content: (
        <Column gap="md" p="md">
          <Text>Dialog title styled via `titleProps`.</Text>
          <Button onPress={() => closeDialog(id)}>Close</Button>
        </Column>
      ),
    });
  };

  return (
    <Column gap="sm">
      <Button onPress={() => open(undefined)}>Default</Button>
      <Button
        onPress={() =>
          open({
            uppercase: true,
            tracking: 1.5,
            weight: '700',
            size: 'sm',
          })
        }
      >
        Uppercase tracked
      </Button>
      <Button
        onPress={() =>
          open({
            ff: 'Georgia, serif',
            size: 'xl',
            weight: '600',
          })
        }
      >
        Serif headline
      </Button>
      <Button
        onPress={() =>
          open({
            colorVariant: 'primary',
            weight: '700',
            ff: 'monospace',
          })
        }
      >
        Brand-coloured monospace
      </Button>
    </Column>
  );
}
