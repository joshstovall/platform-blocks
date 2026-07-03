import { Button, Column, Row, Text, useToast } from '@platform-blocks/ui';

type ToastVariant = 'filled' | 'outline' | 'light';

export default function Demo() {
  const toast = useToast();

  const showVariant = (variant: ToastVariant) => {
    toast.success({
      variant,
      title: `${variant.charAt(0).toUpperCase()}${variant.slice(1)} toast`,
      message: 'The request completed correctly.',
    });
  };

  return (
    <Column gap="sm">
      <Text size="xs" colorVariant="secondary">
        The variant prop controls the surface style: filled uses a solid color
        with auto-contrast text, outline adds a full border, and light uses a
        subtle surface with a colored left accent.
      </Text>
      <Row gap="xs" wrap="wrap">
        <Button onPress={() => showVariant('filled')} colorVariant="success.5">
          Filled
        </Button>
        <Button onPress={() => showVariant('outline')} variant="outline">
          Outline
        </Button>
        <Button onPress={() => showVariant('light')} variant="light">
          Light
        </Button>
      </Row>
    </Column>
  );
}
