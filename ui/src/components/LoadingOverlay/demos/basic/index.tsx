import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { LoadingOverlay, Button, Flex, Text, Input, Switch } from '@platform-blocks/ui';

export default function BasicLoadingOverlayDemo() {
  const [visible, setVisible] = useState(false);

  return (
    <Flex direction="column" gap="xl" style={styles.wrapper}>
      <View style={styles.formCard}>
        <LoadingOverlay
          visible={visible}
          overlayProps={{ blur: 12, radius: 'lg', backgroundOpacity: 0.4 }}
          loaderProps={{ variant: 'dots', size: 'lg' }}
        />

        <Text variant="h4" mb="md">Account details</Text>
        <Flex direction="column" gap="md">
          <Input label="First name" placeholder="Jane" disabled={visible} />
          <Input label="Last name" placeholder="Doe" disabled={visible} />
          <Input label="Email" placeholder="jane@platformblocks.dev" keyboardType="email-address" disabled={visible} />
          <Input label="Password" placeholder="••••••••" secureTextEntry disabled={visible} />
          <Switch label="Subscribe to product updates" disabled={visible} />
        </Flex>
      </View>

      <Button
        title={visible ? 'Stop loading' : 'Simulate loading'}
        onPress={() => setVisible(current => !current)}
      />
    </Flex>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    padding: 24,
  },
  formCard: {
    position: 'relative',
    borderRadius: 20,
    padding: 24,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
});
