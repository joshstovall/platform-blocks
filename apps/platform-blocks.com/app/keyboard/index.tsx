import { ScrollView } from 'react-native';
import { PageLayout } from '../../components/PageLayout';
import {
  Notice,
  Block,
  CodeBlock,
  Flex,
  ListGroup,
  ListGroupItem,
  Text,
  Title,
} from '@platform-blocks/ui';
import { DocsPageHeader } from '../../components/DocsPageHeader';
import { useBrowserTitle, formatPageTitle } from 'hooks/useBrowserTitle';

export default function KeyboardManagementScreen() {
  useBrowserTitle(formatPageTitle('Keyboard Management'));

  return (
    <PageLayout>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Flex direction="column" gap="xl" p="lg">
          <DocsPageHeader
            weight="black"
            subtitle="Set up shared keyboard dismissal, refocus, and avoidance patterns across web and native"
          >
            Keyboard Management
          </DocsPageHeader>

          <Block gap="lg" direction="column">
            <Title order={2} size={28} afterline subtitle="Add the provider once at the edge of your UI tree">
              1. Wrap your app with <Text weight="bold">KeyboardManagerProvider</Text>
            </Title>
            <Text variant="p" colorVariant="secondary">
              The provider listens for native keyboard events and exposes helpers to dismiss the keyboard or queue
              deferred focus targets. Place it near the top of your app so every screen can opt in. Set
              <Text weight="semibold"> EXPO_PUBLIC_ENABLE_KEYBOARD_MANAGER=false</Text> to temporarily revert to the
              pre-existing behavior during rollout.
            </Text>
            <CodeBlock language="tsx">
{`import { KeyboardManagerProvider, PlatformBlocksProvider } from '@platform-blocks/ui';

export function App() {
  return (
    <PlatformBlocksProvider>
      <KeyboardManagerProvider>
        <RootNavigation />
      </KeyboardManagerProvider>
    </PlatformBlocksProvider>
  );
}`}
            </CodeBlock>
            <Notice sev="info" title="Expo Router docs app" variant="subtle">
              The docs site now wraps all pages with <Text weight="bold">KeyboardManagerProvider</Text> so components
              like AutoComplete, Select, and DatePicker share the same keyboard state.
            </Notice>
          </Block>

          <Block gap="lg" direction="column">
            <Title order={2} size={28} afterline subtitle="Keep inputs visible when the system keyboard appears">
              2. Use <Text weight="bold">KeyboardAwareLayout</Text> for forms and scroll views
            </Title>
            <Text variant="p" colorVariant="secondary">
              <Text weight="semibold">KeyboardAwareLayout</Text> combines <Text weight="semibold">KeyboardAvoidingView</Text>
              with a ScrollView so screens can automatically pad their content by the current keyboard height. Pass
              <Text weight="semibold">scrollable={false}</Text> when you already manage scrolling yourself.
            </Text>
            <CodeBlock language="tsx">
{`import { KeyboardAwareLayout, Input, Button } from '@platform-blocks/ui';

export function ProfileForm() {
  return (
    <KeyboardAwareLayout contentContainerStyle={{ padding: 24 }}>
      <Input label="Display name" keyboardFocusId="profile-name" />
      <Input label="Headline" mt="md" multiline />
      <Button title="Save" mt="xl" />
    </KeyboardAwareLayout>
  );
}`}
            </CodeBlock>
            <Notice sev="success" title="Docs layout">
              The docs <Text weight="semibold">PageLayout</Text> now renders inside <Text weight="bold">KeyboardAwareLayout</Text>
              so every example inherits keyboard avoidance without additional wiring.
            </Notice>
          </Block>

          <Block gap="lg" direction="column">
            <Title order={2} size={28} afterline subtitle="Restore focus after overlay selections or dismissals">
              3. Opt into deferred refocus with <Text weight="bold">keyboardFocusId</Text>
            </Title>
            <Text variant="p" colorVariant="secondary">
              Components built on <Text weight="semibold">TextInputBase</Text> now accept <Text weight="semibold">keyboardFocusId</Text>.
              When an overlay (like Select or AutoComplete) finishes handling a selection, it can ask the provider to
              refocus that specific field. Provide explicit IDs for deterministic behavior across hot reloads.
            </Text>
            <CodeBlock language="tsx">
{`<Input
  label="Email"
  keyboardFocusId="checkout-email"
  endSection={<EmailStatusIndicator />}
/>`}
            </CodeBlock>
            <ListGroup variant="default" radius="md">
              <ListGroupItem>
                <Text>
                  AutoComplete and Select expose a <Text weight="semibold">refocusAfterSelect</Text> prop. Native defaults dismiss the
                  keyboard after single selection; multi-select keeps the input active for batch entry.
                </Text>
              </ListGroupItem>
              <ListGroupItem>
                <Text>
                  Custom flows can call <Text weight="semibold">keyboardManager.setFocusTarget(id)</Text> to queue refocus on the next
                  animation frame.
                </Text>
              </ListGroupItem>
              <ListGroupItem>
                <Text>
                  NumberInput step buttons now queue their <Text weight="semibold">keyboardFocusId</Text> so the keyboard stays open while
                  adjusting values with increment/decrement controls.
                </Text>
              </ListGroupItem>
            </ListGroup>
          </Block>

          <Block gap="lg" direction="column">
            <Title order={2} size={28} afterline subtitle="Coordinate dismissals when the keyboard should stay closed">
              4. Use <Text weight="bold">handleSelectionComplete</Text> in overlays
            </Title>
            <Text variant="p" colorVariant="secondary">
              The shared helper normalizes dismissal versus refocus logic across components that present suggestion
              lists or menus. Pass the keyboard manager, your focus callbacks, and the desired mode to keep behavior
              consistent between web and native.
            </Text>
            <CodeBlock language="tsx">
{`import { handleSelectionComplete } from '@platform-blocks/ui/core/keyboard/selection';

handleSelectionComplete({
  mode: 'single',
  preferRefocus: props.refocusAfterSelect,
  keyboardManager,
  focusCallbacks: {
    focusPrimary: () => triggerRef.current?.focus?.(),
    blurPrimary: () => triggerRef.current?.blur?.(),
  },
});`}
            </CodeBlock>
            <Text variant="small" colorVariant="secondary">
              The helper automatically uses the provider to dismiss or refocus, so you no longer need to scatter
              <Text weight="semibold">Keyboard.dismiss()</Text> calls through your overlays.
            </Text>
          </Block>

          <Block gap="lg" direction="column">
            <Title order={2} size={28} afterline subtitle="Centralize modal vs overlay heuristics">
              5. Drive UI decisions with <Text weight="bold">useOverlayMode</Text>
            </Title>
            <Text variant="p" colorVariant="secondary">
              Rather than scattering <Text weight="semibold">Platform.OS</Text> checks, the new hook wraps
              <Text weight="semibold">useDeviceInfo</Text> and returns consistent booleans such as
              <Text weight="semibold">shouldUseModal</Text>, <Text weight="semibold">shouldUseOverlay</Text>, and
              <Text weight="semibold">shouldUsePortal</Text>. Components like ColorPicker, Select, AutoComplete, and
              Spotlight now read from this single source of truth so they line up with keyboard management and
              responsive breakpoints automatically.
            </Text>
            <CodeBlock language="tsx">
{`import { useOverlayMode } from '@platform-blocks/ui';

export function ExampleSurface(props) {
  const { shouldUseModal, shouldUseOverlay } = useOverlayMode();

  if (shouldUseModal) {
    return <FullscreenSheet {...props} />;
  }

  if (shouldUseOverlay) {
    return <AnchoredPopover {...props} />;
  }

  return <InlinePanel {...props} />;
}`}
            </CodeBlock>
            <Notice sev="info" title="Override when needed" variant="subtle">
              Pass <Text weight="bold">forceModal</Text> or <Text weight="bold">forceOverlay</Text> when a surface must
              opt out of the heuristics (for example, onboarding flows that always open as fullscreen sheets).
            </Notice>
          </Block>
        </Flex>
      </ScrollView>
    </PageLayout>
  );
}
