import { Button, Column, Input, Text, useDialog } from '@platform-blocks/ui';

export default function Demo() {
  const { openDialog, closeDialog } = useDialog();

  const showBottomSheetDialog = () => {
    const dialogId = openDialog({
      variant: 'bottomsheet',
      title: 'Bottom Sheet with Gestures',
      content: (
        <Column gap="md" p="md">
          <Text>This dialog slides up from the bottom with theme-aware styling.</Text>
          <Column gap="xs">
            <Text size="sm" colorVariant="secondary">
              Drag the handle or surface to move it.
            </Text>
            <Text size="sm" colorVariant="secondary">
              Swipe down to dismiss with velocity thresholds.
            </Text>
            <Text size="sm" colorVariant="secondary">
              Rubber-band resistance keeps the sheet anchored.
            </Text>
          </Column>
          <Input placeholder="Try typing while dragging..." />
          <Button variant="outline" onPress={() => closeDialog(dialogId)}>
            Close programmatically
          </Button>
        </Column>
      )
    });
  };

  return (
    <Button onPress={showBottomSheetDialog}>Open Bottom Sheet</Button>
  );
}
