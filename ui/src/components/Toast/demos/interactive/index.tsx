import React from 'react';
import { Button, Text, Column, Card, useToast } from '@platform-blocks/ui';

export default function Demo() {
  const toast = useToast();

  const showActionToast = () => {
    toast.show({
      title: 'File uploaded',
      message: 'Your file has been uploaded successfully.',
    });
  };

  const showPersistentToast = () => {
    toast.show({
      title: 'Important Notice',
      message: 'This toast will not auto-dismiss.',
      color: 'orange',
    });
  };

  const showTimedToast = () => {
    toast.show({
      title: 'Quick Message',
      message: 'This will disappear quickly.',
    });
  };

  return (
    <Card>
      <Column gap={16}>
        <Text size="lg" weight="semibold">Interactive Toasts</Text>
        <Column gap={8}>
          <Button title="Toast with Action" onPress={showActionToast} />
          <Button title="Persistent Toast" onPress={showPersistentToast} />
          <Button title="Quick Toast (2s)" onPress={showTimedToast} />
        </Column>
      </Column>
    </Card>
  );
}


