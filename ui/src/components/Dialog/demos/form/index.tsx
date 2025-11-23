import { Alert } from 'react-native';

import { Button, Column, Input, Row, Text, useDialog } from '@platform-blocks/ui';

export default function Demo() {
  const { openDialog, closeDialog } = useDialog();

  const showFormDialog = () => {
    let formData = { name: '', email: '' };

    const dialogId = openDialog({
      variant: 'modal',
      title: 'Create Account',
      content: (
        <Column gap="md" p="md">
          <Text size="sm" colorVariant="secondary">
            Fill in your details to create an account.
          </Text>

          <Input
            placeholder="Your name"
            label="Name"
            onChangeText={(text) => {
              formData.name = text;
            }}
          />

          <Input
            placeholder="your@email.com"
            label="Email"
            keyboardType="email-address"
            onChangeText={(text) => {
              formData.email = text;
            }}
          />

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
                  if (!formData.name || !formData.email) {
                    Alert.alert('Error', 'Please fill in all fields');
                    return;
                  }

                  Alert.alert('Success', `Account created for ${formData.name}`);
                  closeDialog(dialogId);
                }}
              >
                Create account
              </Button>
            </Column>
          </Row>
        </Column>
      )
    });
  };

  return (
    <Button onPress={showFormDialog}>Open Form Dialog</Button>
  );
}
