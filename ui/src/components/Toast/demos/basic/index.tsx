import { Button, useToast } from '@platform-blocks/ui'

export default function Demo() {
  const toast = useToast()

  const showBasicToast = () => {
    toast.show({
      title: 'Success!',
      message: 'Your action was completed successfully.',
      actions: [
        { label: 'Action', onPress: () => alert('Action action') }
      ],
      sev: 'success',
      autoHide: 5000,
    });
  };

  return (
    <Button
      title="Show Basic Toast"
      onPress={showBasicToast}
    />
  )
}
