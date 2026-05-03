import { Accordion, Column, Text } from '@platform-blocks/ui';

const items = [
  {
    key: 'install',
    title: 'Install the package',
    content: <Text size="sm">Run `npm install @platform-blocks/ui` in your workspace.</Text>,
  },
  {
    key: 'provider',
    title: 'Wrap your app in providers',
    content: <Text size="sm">Add ThemeProvider, ToastProvider, and DialogProvider at the root.</Text>,
  },
  {
    key: 'compose',
    title: 'Compose your first screen',
    content: <Text size="sm">Drop in fields, buttons, and feedback components from the library.</Text>,
  },
];

export default function Demo() {
  return (
    <Column gap="lg">
      <Text weight="semibold">titleProps</Text>

      <Column gap="sm">
        <Text size="sm" colorVariant="muted">Default</Text>
        <Accordion items={items} />
      </Column>

      <Column gap="sm">
        <Text size="sm" colorVariant="muted">
          Uppercase tracked headers
        </Text>
        <Accordion
          items={items}
          titleProps={{
            uppercase: true,
            tracking: 1,
            weight: '700',
            size: 'sm',
            colorVariant: 'muted',
          }}
        />
      </Column>

      <Column gap="sm">
        <Text size="sm" colorVariant="muted">
          Serif headline (ff shorthand)
        </Text>
        <Accordion
          items={items}
          titleProps={{ ff: 'Georgia, serif', size: 'lg' }}
        />
      </Column>
    </Column>
  );
}
