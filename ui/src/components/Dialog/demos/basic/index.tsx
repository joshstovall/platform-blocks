import { Alert } from 'react-native';

import { Button, Column, Row, Text, useDialog } from '@platform-blocks/ui';

export default function Demo() {
  const { openDialog, closeDialog } = useDialog();

  const showBasicDialog = () => {
    const dialogId = openDialog({
      variant: 'modal',
      title: 'Basic Dialog',
      content: (
        <Column gap="md" p="md">
          <Text>This is a basic modal dialog with theme-aware styling.</Text>
          <Text size="sm" colorVariant="secondary">
            Works in both light and dark mode.
          </Text>
          <Row gap="sm" mt="sm">
            <Column grow={1}>
              <Button fullWidth variant="outline" onPress={() => closeDialog(dialogId)}>
                Cancel
              </Button>
            </Column>
            <Column grow={1}>
              <Button
                fullWidth
                onPress={() => {
                  Alert.alert('Action', 'OK button pressed!');
                  closeDialog(dialogId);
                }}
              >
                OK
              </Button>
            </Column>
          </Row>
        </Column>
      )
    });
  };

  return (
    <Button onPress={showBasicDialog}>Open Basic Dialog</Button>
  );
}
