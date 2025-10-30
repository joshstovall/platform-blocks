import { View } from 'react-native';
import { useDialog, Button, Text, Input } from '@platform-blocks/ui';

export default function Demo() {
  const { openDialog, closeDialog } = useDialog();

  const showBottomSheetDialog = () => {
    const id = openDialog({
      variant: 'bottomsheet',
      title: 'Bottom Sheet with Gestures',
      content: (
        <View style={{ padding: 20, gap: 16 }}>
          <Text>This dialog slides up from the bottom (theme aware).</Text>
          <Text colorVariant="secondary">
            ✨ Gesture features:
          </Text>
          <Text colorVariant="secondary" size="sm">
            • Drag the handle or anywhere on the sheet
          </Text>
          <Text colorVariant="secondary" size="sm">
            • Swipe down to dismiss
          </Text>
          <Text colorVariant="secondary" size="sm">
            • Rubber band effect with smart thresholds
          </Text>
          <Text colorVariant="secondary" size="sm">
            • Velocity-based dismissal
          </Text>
          <Input placeholder="Try typing while dragging..." />
          <Button
            title="Close Programmatically"
            variant="secondary"
            onPress={() => closeDialog(id)}
          />
        </View>
      )
    });
  };

  return (
    <Button
      title="Open Bottom Sheet"
      onPress={showBottomSheetDialog}
    />
  );
}
