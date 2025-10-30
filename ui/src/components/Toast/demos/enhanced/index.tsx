import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { Toast, ToastProvider, useToast } from '../../';
import { Button } from '../../../Button';
import { Text } from '../../../Text';

function EnhancedToastDemo() {
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const showSwipeableToast = () => {
    toast.show({
      title: 'Swipe Me!',
      children: 'Try swiping this toast left or right to dismiss it',
      sev: 'info',
      swipeConfig: {
        enabled: true,
        threshold: 150,
        direction: 'horizontal',
      },
      onSwipeDismiss: () => {
        console.log('Toast dismissed via swipe!');
      },
      persistent: true,
    });
  };

  const showAnimatedToast = () => {
    toast.show({
      title: 'Bouncy Animation',
      children: 'This toast uses a spring animation',
      sev: 'success',
      animationConfig: {
        type: 'bounce',
        springConfig: {
          damping: 10,
          stiffness: 100,
        }
      }
    });
  };

  const showScaleToast = () => {
    toast.show({
      title: 'Scale Animation',
      children: 'This toast scales in and includes swipe effects',
      sev: 'warning',
      animationConfig: {
        type: 'scale',
        duration: 500,
      },
      swipeConfig: {
        enabled: true,
        direction: 'both',
      }
    });
  };

  const showToastWithActions = () => {
    toast.show({
      title: 'Action Toast',
      children: 'This toast has action buttons',
      sev: 'info',
      actions: [
        {
          label: 'Retry',
          onPress: () => {
            toast.success('Retrying...');
          }
        },
        {
          label: 'Cancel',
          onPress: () => {
            toast.error('Cancelled');
          }
        }
      ],
      persistent: true,
    });
  };

  const showBatchToasts = () => {
    toast.batch([
      {
        title: 'Batch 1',
        children: 'First toast in batch',
        sev: 'info',
        groupId: 'batch-demo',
      },
      {
        title: 'Batch 2', 
        children: 'Second toast in batch',
        sev: 'success',
        groupId: 'batch-demo',
      },
      {
        title: 'Batch 3',
        children: 'Third toast in batch',
        sev: 'warning',
        groupId: 'batch-demo',
      }
    ]);
  };

  const hideBatchToasts = () => {
    toast.hideGroup('batch-demo');
  };

  const showPromiseToast = async () => {
    setLoading(true);
    
    const mockApiCall = () => new Promise((resolve, reject) => {
      setTimeout(() => {
        Math.random() > 0.5 ? resolve('Success!') : reject(new Error('Failed!'));
      }, 2000);
    });

    try {
      await toast.promise(mockApiCall(), {
        pending: 'Loading data...',
        success: (data) => `Operation completed: ${data}`,
        error: (error) => `Operation failed: ${error.message}`,
      });
    } catch (error) {
      // Error already handled by toast.promise
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <Text variant="h3" style={{ marginBottom: 16 }}>
        Enhanced Toast Features
      </Text>

      <View style={{ gap: 12 }}>
        <Button onPress={showSwipeableToast}>
          Swipe to Dismiss Toast
        </Button>

        <Button onPress={showAnimatedToast} variant="outline">
          Bounce Animation
        </Button>

        <Button onPress={showScaleToast} variant="outline">
          Scale Animation + Swipe
        </Button>

        <Button onPress={showToastWithActions} variant="outline">
          Toast with Actions
        </Button>

        <Button onPress={showBatchToasts} variant="outline">
          Show Batch Toasts
        </Button>

        <Button onPress={hideBatchToasts} variant="outline">
          Hide Batch Toasts
        </Button>

        <Button 
          onPress={showPromiseToast} 
          variant="outline"
          loading={loading}
        >
          Promise Integration
        </Button>

        <View style={{ marginTop: 20 }}>
          <Text variant="body" style={{ marginBottom: 8 }}>
            Tap-to-Dismiss Example:
          </Text>
          <Toast
            visible={true}
            title="Tap Me!"
            sev="info"
            dismissOnTap={true}
            onClose={() => console.log('Tapped!')}
            position="bottom"
          >
            This toast can be dismissed by tapping
          </Toast>
        </View>
      </View>
    </ScrollView>
  );
}

export default function EnhancedToastDemoWrapper() {
  return (
    <ToastProvider
      defaultPosition="top-center"
      limit={3}
      queueOptions={{
        maxVisible: 3,
        stackDirection: 'down',
        spacing: 12,
        priority: 'fifo',
        allowDuplicates: false,
      }}
    >
      <EnhancedToastDemo />
    </ToastProvider>
  );
}