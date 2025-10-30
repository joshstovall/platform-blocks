import { View, Alert } from 'react-native';
import { useDialog, Button, Text, Flex, useTheme } from '@platform-blocks/ui';

export default function Demo() {
  const { openDialog, closeDialog } = useDialog();
  const theme = useTheme();

  const showConfirmationDialog = () => {
    const id = openDialog({
      variant: 'modal',
      title: 'Confirm Action',
      content: (
        <View style={{ padding: 20, gap: 16 }}>
          <Text>Are you sure you want to delete this item?</Text>
          <Text colorVariant="secondary" style={{ fontSize: 14 }}>
            This action cannot be undone.
          </Text>
          
          <Flex direction="row" gap={12} style={{ marginTop: 16 }}>
            <Button
              title="Cancel"
              variant="secondary"
              onPress={() => closeDialog(id)}
              style={{ flex: 1 }}
            />
            <Button
              title="Delete"
              variant="filled"
              colorVariant={theme.colors.error?.[5] || '#dc3545'}
              onPress={() => {
                Alert.alert('Deleted', 'Item has been deleted');
                closeDialog(id);
              }}
              style={{ flex: 1 }}
            />
          </Flex>
        </View>
      )
    });
  };

  return (
    <Button
      title="Show Confirmation"
      onPress={showConfirmationDialog}
    />
  );
}
