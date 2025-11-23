import { useState, type ComponentProps } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Card, Column, Input, LoadingOverlay, Switch, Text } from '@platform-blocks/ui';

type TextFieldConfig = {
  key: string;
} & Pick<ComponentProps<typeof Input>, 'label' | 'placeholder' | 'keyboardType' | 'secureTextEntry'>;

const TEXT_FIELDS: TextFieldConfig[] = [
  { key: 'first-name', label: 'First name', placeholder: 'Jane' },
  { key: 'last-name', label: 'Last name', placeholder: 'Doe' },
  {
    key: 'email',
    label: 'Email',
    placeholder: 'jane@platform-blocks.com',
    keyboardType: 'email-address',
  },
  {
    key: 'password',
    label: 'Password',
    placeholder: '••••••••',
    secureTextEntry: true,
  },
];

export default function Demo() {
  const [visible, setVisible] = useState(false);

  return (
    <Column gap="lg" align="center" style={styles.wrapper}>
      <Column gap="md" style={styles.section}>
        <Card style={styles.card} shadow="lg">
          <LoadingOverlay
            visible={visible}
            overlayProps={{ blur: 12, radius: 'md', backgroundOpacity: 0.4 }}
            loaderProps={{ variant: 'dots', size: 'lg' }}
          />

          <Column gap="lg">
            <Column gap="xs">
              <Text variant="h4" weight="semibold">
                Account details
              </Text>
              <Text variant="p" colorVariant="muted">
                Pause form interaction while requests finish and keep the layout intact.
              </Text>
            </Column>

            <Column gap="md">
              {TEXT_FIELDS.map(({ key, ...field }) => (
                <Input key={key} disabled={visible} {...field} />
              ))}
              <Switch label="Subscribe to product updates" disabled={visible} />
            </Column>
          </Column>
        </Card>

        <Button onPress={() => setVisible((current) => !current)}>
          {visible ? 'Stop loading' : 'Simulate loading'}
        </Button>
      </Column>

      <Text variant="small" colorVariant="muted" align="center">
        LoadingOverlay anchors to a relative container and dims the content while the loader animates.
      </Text>
    </Column>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  section: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
  card: {
    width: '100%',
  },
});
