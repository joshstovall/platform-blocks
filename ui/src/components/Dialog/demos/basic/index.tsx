import { View, Alert } from 'react-native';
import { useDialog, Button, Text } from '@platform-blocks/ui';

export default function Demo() {
  const { openDialog, closeDialog } = useDialog();

  const showBasicDialog = () => {
    const id = openDialog({
      variant: 'modal',
      title: 'Basic Dialog',
      content: (
        <View style={{ padding: 20, gap: 16 }}>
          <Text>This is a basic modal dialog with theme-aware styling.</Text>
          <Text colorVariant="secondary">Works in both light and dark mode.</Text>
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
            <Button
              title="Cancel"
              variant="secondary"
              onPress={() => closeDialog(id)}
              style={{ flex: 1 }}
            />
            <Button
              title="OK"
              onPress={() => {
                Alert.alert('Action', 'OK button pressed!');
                closeDialog(id);
              }}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      )
    });
  };

  return (
    <Button
      title="Open Basic Dialog"
      onPress={showBasicDialog}
    />
  );
}
