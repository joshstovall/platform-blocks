import { Button, Text, Row, Column, Card, useToast } from '@platform-blocks/ui';

export default function Demo() {
  const toast = useToast();

  const showSuccessToast = () => {
    toast.show({
      title: 'Success!',
      message: 'Operation completed successfully.',
      color: 'green',
    });
  };

  const showWarningToast = () => {
    toast.warn({
      title: 'Warning',
      message: 'Please check your input.',
    });
  };

  const showErrorToast = () => {
    toast.error({
      title: 'Error',
      message: 'Something went wrong.',
    });
  };

  const showInfoToast = () => {
    toast.info({
      title: 'Info',
      message: 'Here is some information.',
    });
  };

  return (
    <Card>
      <Column gap={16}>
        <Text size="lg" weight="semibold">Toast Variants</Text>
        <Row gap={8} wrap="wrap">
          <Button title="Success" onPress={showSuccessToast} colorVariant="green" />
          <Button title="Warning" onPress={showWarningToast} colorVariant="yellow" />
          <Button title="Error" onPress={showErrorToast} colorVariant="red" />
          <Button title="Info" onPress={showInfoToast} colorVariant="blue" />
        </Row>
      </Column>
    </Card>
  );
}


