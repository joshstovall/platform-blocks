import { Alert } from 'react-native';

import { Button, Column, Row, Text, useDialog } from '@platform-blocks/ui';

export default function Demo() {
  const { openDialog, closeDialog } = useDialog();

  const showConfirmationDialog = () => {
    const dialogId = openDialog({
      variant: 'modal',
      title: 'Confirm Action',
      content: (
        <Column gap="md" p="md">
          <Text>Are you sure you want to delete this item?</Text>
          <Text size="sm" colorVariant="secondary">
            This action cannot be undone.
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
                variant="filled"
                colorVariant="error.5"
                onPress={() => {
                  Alert.alert('Deleted', 'Item has been deleted');
                  closeDialog(dialogId);
                }}
              >
                Delete
              </Button>
            </Column>
          </Row>
        </Column>
      )
    });
  };

  return (
    <Button onPress={showConfirmationDialog}>Show Confirmation</Button>
  );
}
