import { View, Alert } from 'react-native';
import { useDialog, Button, Text, Input, Flex } from '@platform-blocks/ui';

export default function Demo() {
  const { openDialog, closeDialog } = useDialog();

  const showFormDialog = () => {
    let formData = { name: '', email: '' };

    const id = openDialog({
      variant: 'modal',
      title: 'Create Account',
      content: (
        <View style={{ padding: 20, gap: 16 }}>
          <Text colorVariant="secondary">Fill in your details to create an account.</Text>
          
          <Input
            placeholder="Your name"
            label="Name"
            onChangeText={(text) => { formData.name = text; }}
          />
          
          <Input
            placeholder="your@email.com"
            label="Email"
            keyboardType="email-address"
            onChangeText={(text) => { formData.email = text; }}
          />
          
          <Flex direction="row" gap={12} style={{ marginTop: 16 }}>
            <Button
              title="Cancel"
              variant="secondary"
              onPress={() => closeDialog(id)}
              style={{ flex: 1 }}
            />
            <Button
              title="Create Account"
              onPress={() => {
                if (!formData.name || !formData.email) {
                  Alert.alert('Error', 'Please fill in all fields');
                  return;
                }
                Alert.alert('Success', `Account created for ${formData.name}`);
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
      title="Open Form Dialog"
      onPress={showFormDialog}
    />
  );
}
