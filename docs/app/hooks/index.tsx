import React from 'react';
import { View } from 'react-native';
import {
  Text,
  Column,
  Badge,
  Divider,
  CodeBlock,
} from '@platform-blocks/ui';
import { PageLayout } from 'components';
import { DocsPageHeader } from '../../components/DocsPageHeader';

interface HookSection {
  name: string;
  description: string;
  badges?: string[];
  example: string;
  note?: string;
}

const HOOK_SECTIONS: HookSection[] = [
  {
    name: 'useHotkeys',
    description: 'Register scoped keyboard shortcuts that activate while the component is mounted. Handlers can optionally return `false` to prevent default browser behaviour.',
    badges: ['keyboard', 'accessibility'],
    example: `import { useHotkeys, Button } from '@platform-blocks/ui';

export function EditorHotkeys() {
  useHotkeys('editor-shortcuts', [
    { combo: 'mod+b', handler: () => document.execCommand('bold') },
    { combo: 'mod+/', handler: () => console.log('Toggle help panel') },
  ]);

  return <Button onPress={() => console.log('Save')}>Save</Button>;
}`,
  },
  {
    name: 'useGlobalHotkeys',
    description: 'Attach application-wide shortcuts (e.g. `Cmd+K`) that stay active regardless of focus. Ideal for opening global UI like the command palette.',
    badges: ['global'],
    example: `import { useGlobalHotkeys } from '@platform-blocks/ui';
import { directSpotlight } from '@platform-blocks/ui/spotlight';

export function SpotlightHotkey() {
  useGlobalHotkeys('spotlight-toggle', ['mod+k', () => directSpotlight.toggle()]);
  return null;
}`,
    note: 'Global handlers automatically clean up on unmount, and you can namespace them to avoid collisions.',
  },
  {
    name: 'useEscapeKey',
    description: 'Listen for the Escape key and run a callback. Useful for closing dialogs, dropdowns, or transient UI.',
    example: `import { useEscapeKey } from '@platform-blocks/ui';

export function Drawer({ onClose }) {
  useEscapeKey(onClose);
  return null;
}`,
  },
  {
    name: 'useToggleColorScheme',
    description: 'Read and toggle between light/dark color schemes provided by the theme.',
    badges: ['theme'],
    example: `import { useToggleColorScheme, Button } from '@platform-blocks/ui';

export function ThemeSwitcher() {
  const { colorScheme, toggle } = useToggleColorScheme();
  return (
    <Button onPress={toggle} variant="outline">
      Switch to {colorScheme === 'dark' ? 'light' : 'dark'} mode
    </Button>
  );
}`,
  },
  {
    name: 'useSpotlightToggle',
    description: 'Convenience hook for opening or closing the Spotlight command palette without importing store utilities.',
    example: `import { useSpotlightToggle, Button } from '@platform-blocks/ui';

export function OpenSpotlightButton() {
  const { open } = useSpotlightToggle();
  return <Button onPress={open} icon="spotlight">Search</Button>;
}`,
  },
  {
    name: 'useClipboard',
    description: 'Provide copy-to-clipboard helpers with built-in status tracking.',
    badges: ['clipboard'],
    example: `import { useClipboard, Button, Text } from '@platform-blocks/ui';

export function InviteLink() {
  const { copy, copied } = useClipboard({ timeout: 1500 });

  return (
    <Button onPress={() => copy('https://app.example.com/invite')}>
      {copied ? 'Copied!' : 'Copy invite link'}
    </Button>
  );
}`,
  },
  {
    name: 'useScrollSpy',
    description: 'Track which heading is currently in view and keep navigation elements in sync.',
    badges: ['navigation'],
    example: `import { useScrollSpy } from '@platform-blocks/ui';

export function TableOfContents({ headings }) {
  const activeId = useScrollSpy({
    targets: headings.map((id) => \`#\${id}\`),
    offset: 80,
  });

  return headings.map((id) => (
    <a
      key={id}
      href={\`#\${id}\`}
      className={activeId === id ? 'is-active' : undefined}
    >
      {id}
    </a>
  ));
}`,
  },
  {
    name: 'useHaptics',
    description: 'Trigger platform haptics and sound feedback from React Native or Expo applications.',
    badges: ['native'],
    example: `import { Button, useHaptics } from '@platform-blocks/ui';

export function ConfirmAction() {
  const { impact, selection } = useHaptics();

  return (
    <Button
      onPress={() => {
        impact('heavy');
        selection();
      }}
    >
      Confirm
    </Button>
  );
}`,
  },
  {
    name: 'useMaskedInput',
    description: 'Create controlled inputs with masking (e.g. phone numbers or postal codes) that update values and cursor positions for you.',
    badges: ['forms'],
    example: `import { TextInput } from 'react-native';
import { useMaskedInput } from '@platform-blocks/ui';

export function PhoneField() {
  const { value, onChangeText } = useMaskedInput({
    mask: '(999) 999-9999',
  });

  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      keyboardType="phone-pad"
      placeholder="(555) 555-5555"
    />
  );
}`,
  },
  {
    name: 'useTitleRegistration',
    description: 'Register headings with the documentation layout so the sticky table of contents stays in sync.',
    example: `import { useTitleRegistration } from '@platform-blocks/ui';

export function GuideSection({ id, title, children }) {
  useTitleRegistration({ id, title });
  return <section id={id}>{children}</section>;
}`,
    note: 'Docs pages typically call this hook inside large section components to populate the right-side TOC automatically.',
  },
];

const HooksPage = () => {
  return (
    <PageLayout>
      <View style={{ maxWidth: 880, width: '100%', alignSelf: 'center' }}>
        <Column gap="lg" mb="xl">
          <DocsPageHeader>Hooks Overview</DocsPageHeader>
          <Text variant="body" colorVariant="secondary">
            Platform Blocks exposes a focused set of React hooks to wire up keyboard shortcuts, theming, clipboard helpers, and other interactive behaviours. Below you will find a quick reference and a minimal example for each hook. We will expand this guide with deeper tutorials soon.
          </Text>
        </Column>

        <Column gap="2xl">
          {HOOK_SECTIONS.map(({ name, description, badges, example, note }) => (
            <Column key={name} gap="md">
              <Column gap="xs">
                <Text variant="h3">{name}</Text>
                <Text variant="body" colorVariant="secondary">
                  {description}
                </Text>
                {badges ? (
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                    {badges.map((badge) => (
                      <Badge key={badge} variant="outline" color="secondary">
                        {badge}
                      </Badge>
                    ))}
                  </View>
                ) : null}
              </Column>
              <CodeBlock language="tsx" spoiler={false}>
                {example.trim()}
              </CodeBlock>
              {note ? (
                <Text variant="body" colorVariant="muted">
                  {note}
                </Text>
              ) : null}
              <Divider />
            </Column>
          ))}
        </Column>

        <Text variant="body" colorVariant="secondary" mt="xl">
          Looking for something else? Reach out on the Platform Blocks Discord and let us know which hooks you would like documented next.
        </Text>
      </View>
    </PageLayout>
  );
};

export default HooksPage;
