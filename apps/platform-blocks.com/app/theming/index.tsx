import React from 'react';
import { View } from 'react-native';
import {
  Text,
  Title,
  CodeBlock,
  Card,
  Divider,
  Badge,
  Notice,
  Column,
  Row,
  Grid,
  GridItem,
  useTheme,
} from '@platform-blocks/ui';
import { PageLayout } from '../../components/PageLayout';
import { DocsPageHeader } from '../../components/DocsPageHeader';
import { useBrowserTitle, formatPageTitle } from 'hooks/useBrowserTitle';

/* -------------------------------------------------------------------------- */
/*  Small presentational helpers (local to this page)                          */
/* -------------------------------------------------------------------------- */

/** Pick a readable foreground for a solid hex background. */
const readableText = (hex: string): string => {
  const c = hex.replace('#', '');
  if (c.length < 6) return '#1C1C1E';
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  const L = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return L > 0.6 ? '#1C1C1E' : '#FFFFFF';
};

const SwatchBorder = 'rgba(128,128,128,0.25)';

/** A single color chip in a 0–9 palette ramp. */
const Shade: React.FC<{ color: string; index: number; base?: boolean }> = ({ color, index, base }) => (
  <View style={{ flex: 1, minWidth: 34 }}>
    <View
      style={{
        height: 46,
        backgroundColor: color,
        borderRadius: 8,
        borderWidth: base ? 2 : 1,
        borderColor: base ? readableText(color) : SwatchBorder,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ color: readableText(color), fontSize: 11, fontWeight: base ? '800' : '600' }}>
        {index}
      </Text>
    </View>
  </View>
);

/** A named 10-step palette row (name + role + swatches). */
const PaletteRow: React.FC<{ name: string; note: string; shades: string[] }> = ({ name, note, shades }) => (
  <View style={{ marginBottom: 18 }}>
    <Row align="center" gap="sm" style={{ marginBottom: 6, flexWrap: 'wrap' }}>
      <Text variant="strong" style={{ fontFamily: 'monospace' }}>{name}</Text>
      <Text variant="small" colorVariant="secondary">{note}</Text>
    </Row>
    <Row gap="xs">
      {shades.map((c, i) => (
        <Shade key={i} color={c} index={i} base={i === 5} />
      ))}
    </Row>
  </View>
);

/** A semantic token: a color box beside its name + resolved value. */
const TokenSwatch: React.FC<{ name: string; value: string; note?: string }> = ({ name, value, note }) => (
  <View style={{ flexGrow: 1, flexBasis: 240, minWidth: 220 }}>
    <Row align="center" gap="sm">
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 8,
          backgroundColor: value,
          borderWidth: 1,
          borderColor: SwatchBorder,
        }}
      />
      <Column style={{ flex: 1 }}>
        <Text variant="strong" style={{ fontFamily: 'monospace', fontSize: 13 }}>{name}</Text>
        <Text variant="small" colorVariant="secondary" style={{ fontFamily: 'monospace' }}>{value}</Text>
        {note ? <Text variant="small" colorVariant="muted">{note}</Text> : null}
      </Column>
    </Row>
  </View>
);

/** Row of TokenSwatches that wraps responsively (Grid inspects immediate
 *  child props, so we use a plain flex-wrap container here instead). */
const TokenGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>{children}</View>
);

/** Section wrapper with a consistent heading + lead paragraph. */
const Section: React.FC<{ title: string; lead?: string; children: React.ReactNode }> = ({ title, lead, children }) => (
  <Column gap="md" style={{ marginTop: 40 }}>
    <Title order={2} size={28} weight="bold">{title}</Title>
    {lead ? <Text variant="p" colorVariant="secondary">{lead}</Text> : null}
    {children}
  </Column>
);

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

const ThemingPage = () => {
  useBrowserTitle(formatPageTitle('Theming'));
  const theme = useTheme();

  const corePalettes: Array<[string, string, string[]]> = [
    ['primary', 'Brand & primary actions', theme.colors.primary],
    ['secondary', 'Secondary accents', theme.colors.secondary],
    ['tertiary', 'Tertiary accents', theme.colors.tertiary],
    ['success', 'Positive / confirmation', theme.colors.success],
    ['warning', 'Caution', theme.colors.warning],
    ['error', 'Danger / destructive', theme.colors.error],
    ['gray', 'Neutral text & borders', theme.colors.gray],
    ['surface', 'Surfaces & fills', theme.colors.surface],
    ['highlight', 'Highlights & marks', theme.colors.highlight],
  ];

  const extendedKeys = ['pink', 'purple', 'violet', 'indigo', 'cyan', 'sky', 'teal', 'lime', 'amber'] as const;
  const extendedPalettes = extendedKeys
    .map((k) => [k, (theme.colors as Record<string, string[] | undefined>)[k]] as const)
    .filter((entry): entry is readonly [(typeof extendedKeys)[number], string[]] => Array.isArray(entry[1]));

  return (
    <PageLayout>
      <View style={{ maxWidth: 900, alignSelf: 'center', width: '100%' }}>
        {/* ---------------------------------------------------------------- */}
        {/* Header                                                           */}
        {/* ---------------------------------------------------------------- */}
        <Column gap="sm">
          <DocsPageHeader subtitle="One typed object that drives every color, size, and surface in your app.">
            Theming
          </DocsPageHeader>
          <Row gap="xs" style={{ flexWrap: 'wrap' }}>
            <Badge variant="outline" color="primary">Design tokens</Badge>
            <Badge variant="outline" color="secondary">Light & dark</Badge>
            <Badge variant="outline" color="success">Type-safe</Badge>
            <Badge variant="outline" color="tertiary">Cross-platform</Badge>
          </Row>
          <Notice color="primary" variant="light" mt="sm">
            The swatches on this page read from the <Text variant="code">live</Text> theme. Flip the
            light/dark toggle in the header and watch every color below update in place —
            proof that components never hard-code color, they read the theme.
          </Notice>
        </Column>

        {/* ---------------------------------------------------------------- */}
        {/* What is a theme                                                  */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="What is a theme?"
          lead="A theme is a single, strongly-typed object — PlatformBlocksTheme — that holds every design decision your UI depends on. It is the source of truth for the whole design system."
        >
          <Text variant="p" colorVariant="secondary">
            Nothing in Platform Blocks paints a color, sets a font size, or rounds a corner from a
            hard-coded value. Every component reads those decisions from the theme through React
            context. Change the theme and the entire tree re-renders with the new values — no
            per-component edits, no CSS overrides.
          </Text>
          <Text variant="p" colorVariant="secondary">
            The theme is organized into a handful of token groups:
          </Text>
          <Grid columns={12} gap="md">
            {[
              ['colors', '10-step color ramps (primary, gray, success, …)'],
              ['text / backgrounds / states', 'Semantic colors that adapt to light & dark'],
              ['spacing / radii', 'Layout rhythm and corner rounding'],
              ['fontFamily / fontSizes', 'Typography scale'],
              ['shadows / motion', 'Elevation and animation timing'],
              ['breakpoints', 'Responsive thresholds'],
            ].map(([k, v]) => (
              <GridItem key={k} span={{ base: 12, sm: 6, lg: 4 }}>
                <Card variant="outline" p="md" style={{ height: '100%' }}>
                  <Text variant="strong" style={{ fontFamily: 'monospace', fontSize: 13 }}>{k}</Text>
                  <Text variant="small" colorVariant="secondary" mt="xs">{v}</Text>
                </Card>
              </GridItem>
            ))}
          </Grid>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Why                                                              */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Why theme at all?"
          lead="Centralizing design decisions buys you four things that are painful to retrofit later."
        >
          <Grid columns={12} gap="md">
            {[
              ['Consistency', 'Every button, input, and card shares one palette and one spacing rhythm. Drift is impossible when there is one source.'],
              ['Free dark mode', 'Semantic tokens (text, backgrounds) resolve to different values per color scheme. You write the UI once; both modes just work.'],
              ['Rebrand in one place', 'Swap the primary ramp and your product changes color everywhere — no find-and-replace across components.'],
              ['Accessible by default', 'Tokens are tuned for contrast. Because you compose from them instead of guessing hex codes, contrast stays predictable.'],
            ].map(([t, d]) => (
              <GridItem key={t} span={{ base: 12, sm: 6 }}>
                <Card variant="elevated" p="md" style={{ height: '100%' }}>
                  <Text variant="h5" weight="semibold">{t}</Text>
                  <Text variant="p" colorVariant="secondary" mt="xs">{d}</Text>
                </Card>
              </GridItem>
            ))}
          </Grid>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Color system                                                     */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="The color system"
          lead="Every palette is a 10-step ramp indexed 0 (lightest) → 9 (darkest). Index 5 is the base — the color you reach for by default. Lower indices are tints for backgrounds and hovers; higher indices are shades for text and pressed states."
        >
          <CodeBlock language="tsx" title="A palette is just an ordered array" spoiler={false}>
{`colors: {
  primary: [
    '#E6F3FF', // 0  lightest tint  → subtle fills, hover backgrounds
    '#CCE7FF', // 1
    '#99CFFF', // 2
    '#66B7FF', // 3
    '#339FFF', // 4
    '#007AFF', // 5  BASE           → buttons, links, active states
    '#0066CC', // 6
    '#004D99', // 7                 → text on light, pressed states
    '#003366', // 8
    '#001A33', // 9  darkest shade
  ],
}`}
          </CodeBlock>

          <Text variant="p" colorVariant="secondary">
            Reference a shade anywhere with <Text variant="code">theme.colors.primary[5]</Text>.
            Components also accept a palette name via their <Text variant="code">color</Text> prop
            (e.g. <Text variant="code">&lt;Button color="success" /&gt;</Text>) and pick the right
            index automatically.
          </Text>

          <Title order={3} size={20} weight="semibold" mt="md">Core palettes</Title>
          <Text variant="small" colorVariant="secondary">
            These ship with every theme. The ring marks index 5 (the base).
          </Text>
          <Card variant="outline" p="lg" mt="sm">
            {corePalettes.map(([name, note, shades]) => (
              <PaletteRow key={name} name={name} note={note} shades={shades} />
            ))}
          </Card>

          {extendedPalettes.length > 0 && (
            <>
              <Title order={3} size={20} weight="semibold" mt="lg">Extended palettes</Title>
              <Text variant="small" colorVariant="secondary">
                Optional named ramps for charts, tags, and accent work — available on the default theme.
              </Text>
              <Card variant="outline" p="lg" mt="sm">
                {extendedPalettes.map(([name, shades]) => (
                  <PaletteRow key={name} name={name} note="" shades={shades} />
                ))}
              </Card>
            </>
          )}
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Semantic colors                                                  */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Semantic colors"
          lead="Raw palette shades don't know about light vs dark. Semantic tokens do. Reach for these — not raw hex — for text, surfaces, and borders so your UI adapts automatically."
        >
          <Title order={3} size={18} weight="semibold">text</Title>
          <Card variant="outline" p="md" mt="xs">
            <TokenGrid>
              <TokenSwatch name="text.primary" value={theme.text.primary} note="High-contrast body text" />
              <TokenSwatch name="text.secondary" value={theme.text.secondary} note="Supporting text" />
              <TokenSwatch name="text.muted" value={theme.text.muted} note="De-emphasized labels" />
              <TokenSwatch name="text.disabled" value={theme.text.disabled} note="Disabled state" />
              <TokenSwatch name="text.link" value={theme.text.link} note="Links" />
              {theme.text.onPrimary ? (
                <TokenSwatch name="text.onPrimary" value={theme.text.onPrimary} note="Text on primary[5]" />
              ) : null}
            </TokenGrid>
          </Card>

          <Title order={3} size={18} weight="semibold" mt="md">backgrounds</Title>
          <Card variant="outline" p="md" mt="xs">
            <TokenGrid>
              <TokenSwatch name="backgrounds.base" value={theme.backgrounds.base} note="App / page background" />
              <TokenSwatch name="backgrounds.subtle" value={theme.backgrounds.subtle} note="Alternate sections" />
              <TokenSwatch name="backgrounds.surface" value={theme.backgrounds.surface} note="Cards, inputs" />
              <TokenSwatch name="backgrounds.elevated" value={theme.backgrounds.elevated} note="Modals, popovers" />
              <TokenSwatch name="backgrounds.border" value={theme.backgrounds.border} note="Hairlines & dividers" />
            </TokenGrid>
          </Card>

          {theme.states ? (
            <>
              <Title order={3} size={18} weight="semibold" mt="md">states</Title>
              <Card variant="outline" p="md" mt="xs">
                <TokenGrid>
                  {theme.states.focusRing ? <TokenSwatch name="states.focusRing" value={theme.states.focusRing} note="Focus outline" /> : null}
                  {theme.states.textSelection ? <TokenSwatch name="states.textSelection" value={theme.states.textSelection} note="Text selection" /> : null}
                  {theme.states.highlightText ? <TokenSwatch name="states.highlightText" value={theme.states.highlightText} note="Matched text" /> : null}
                  {theme.states.highlightBackground ? <TokenSwatch name="states.highlightBackground" value={theme.states.highlightBackground} note="Match background" /> : null}
                </TokenGrid>
              </Card>
            </>
          ) : null}

          <Notice color="warning" variant="light" mt="md" title="Prefer semantic over raw">
            Use <Text variant="code">theme.text.primary</Text> and{' '}
            <Text variant="code">theme.backgrounds.surface</Text> instead of{' '}
            <Text variant="code">theme.colors.gray[9]</Text>. The semantic token flips to a light
            value in dark mode; the raw shade does not.
          </Notice>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Layout tokens                                                    */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Spacing, radii, type & elevation"
          lead="The non-color half of the theme. These are the same scale keys everywhere — xs → 3xl — so a size prop means the same thing across every component."
        >
          {/* Spacing */}
          <Title order={3} size={18} weight="semibold">spacing</Title>
          <Card variant="outline" p="md" mt="xs">
            <Column gap="sm">
              {(['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] as const).map((k) => {
                const val = theme.spacing[k];
                return (
                  <Row key={k} align="center" gap="md">
                    <Text style={{ width: 40, fontFamily: 'monospace' }} variant="small">{k}</Text>
                    <View style={{ width: parseInt(val, 10), height: 16, borderRadius: 4, backgroundColor: theme.colors.primary[5] }} />
                    <Text variant="small" colorVariant="secondary" style={{ fontFamily: 'monospace' }}>{val}</Text>
                  </Row>
                );
              })}
            </Column>
          </Card>

          {/* Radii */}
          <Title order={3} size={18} weight="semibold" mt="md">radii</Title>
          <Card variant="outline" p="md" mt="xs">
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 20 }}>
              {(['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] as const).map((k) => {
                const val = theme.radii[k];
                return (
                  <View key={k} style={{ alignItems: 'center', gap: 6 }}>
                    <View
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: parseInt(val, 10),
                        backgroundColor: theme.colors.primary[2],
                        borderWidth: 1,
                        borderColor: theme.colors.primary[5],
                      }}
                    />
                    <Text variant="small" style={{ fontFamily: 'monospace' }}>{k}</Text>
                    <Text variant="small" colorVariant="muted" style={{ fontFamily: 'monospace' }}>{val}</Text>
                  </View>
                );
              })}
            </View>
          </Card>

          {/* Font sizes */}
          <Title order={3} size={18} weight="semibold" mt="md">fontSizes</Title>
          <Card variant="outline" p="md" mt="xs">
            <Column gap="xs">
              {(['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] as const).map((k) => (
                <Row key={k} align="baseline" gap="md">
                  <Text style={{ width: 40, fontFamily: 'monospace' }} variant="small" colorVariant="secondary">{k}</Text>
                  <Text style={{ fontSize: parseInt(theme.fontSizes[k], 10) }}>The quick brown fox</Text>
                  <Text variant="small" colorVariant="muted" style={{ fontFamily: 'monospace' }}>{theme.fontSizes[k]}</Text>
                </Row>
              ))}
            </Column>
          </Card>

          {/* Shadows */}
          <Title order={3} size={18} weight="semibold" mt="md">shadows</Title>
          <Card variant="outline" p="lg" mt="xs" style={{ backgroundColor: theme.backgrounds.subtle }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 28 }}>
              {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((k) => (
                <View key={k} style={{ alignItems: 'center', gap: 8 }}>
                  <View
                    style={{
                      width: 72,
                      height: 56,
                      borderRadius: 10,
                      backgroundColor: theme.backgrounds.surface,
                      boxShadow: theme.shadows[k],
                    } as any}
                  />
                  <Text variant="small" style={{ fontFamily: 'monospace' }}>{k}</Text>
                </View>
              ))}
            </View>
          </Card>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Using the theme                                                  */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Wiring it up"
          lead="Wrap your app once in PlatformBlocksProvider. Everything below it can read the theme."
        >
          <CodeBlock language="tsx" title="Provider at the root" spoiler={false}>
{`import { PlatformBlocksProvider } from '@platform-blocks/ui';

export default function App() {
  return (
    // colorSchemeMode: 'auto' follows the OS · 'light' · 'dark'
    <PlatformBlocksProvider colorSchemeMode="auto">
      <YourApp />
    </PlatformBlocksProvider>
  );
}`}
          </CodeBlock>

          <Text variant="p" colorVariant="secondary">
            With no <Text variant="code">theme</Text> prop you get the built-in default theme, and{' '}
            <Text variant="code">colorSchemeMode</Text> swaps between the bundled light and dark
            palettes for you. On web the provider also injects CSS variables and sets the page
            background automatically.
          </Text>

          <Title order={3} size={20} weight="semibold" mt="md">Reading the theme in a component</Title>
          <CodeBlock language="tsx" title="useTheme()" spoiler={false}>
{`import { useTheme } from '@platform-blocks/ui';
import { View } from 'react-native';

function Callout() {
  const theme = useTheme();
  return (
    <View style={{
      backgroundColor: theme.colors.primary[1],
      borderColor: theme.colors.primary[5],
      borderWidth: 1,
    }}>
      {/* ... */}
    </View>
  );
}`}
          </CodeBlock>

          <Notice color="primary" variant="light" title="Performance tip" mt="sm">
            <Text variant="code">useTheme()</Text> returns the whole theme and re-renders on any
            theme change. If a component only needs colors, subscribe to{' '}
            <Text variant="code">useThemeVisuals()</Text>; if it only needs spacing/typography, use{' '}
            <Text variant="code">useThemeLayout()</Text>. Each ignores changes to the other slice.
          </Notice>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Customizing                                                      */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Customizing the theme"
          lead="Use createTheme() to describe only what changes. It returns a partial override; the provider deep-merges it onto the default theme, so unspecified tokens keep their defaults."
        >
          <CodeBlock language="tsx" title="Rebrand with a custom primary ramp" spoiler={false}>
{`import { PlatformBlocksProvider, createTheme } from '@platform-blocks/ui';

const theme = createTheme({
  primaryColor: '#8B5CF6',
  colors: {
    // A full 0–9 ramp keeps tints/shades consistent across components.
    primary: [
      '#F5F3FF', '#EDE9FE', '#DDD6FE', '#C4B5FD', '#A78BFA',
      '#8B5CF6', '#7C3AED', '#6D28D9', '#5B21B6', '#4C1D95',
    ],
  },
});

<PlatformBlocksProvider theme={theme}>
  <YourApp />
</PlatformBlocksProvider>`}
          </CodeBlock>

          <Text variant="p" colorVariant="secondary">
            You can override any token group the same way — <Text variant="code">text</Text>,{' '}
            <Text variant="code">backgrounds</Text>, <Text variant="code">spacing</Text>,{' '}
            <Text variant="code">radii</Text>, <Text variant="code">fontFamily</Text>,{' '}
            <Text variant="code">shadows</Text>, and so on.
          </Text>

          <Notice color="warning" variant="light" title="Custom theme + dark mode" mt="sm">
            Passing a <Text variant="code">theme</Text> object takes over rendering, so the built-in{' '}
            <Text variant="code">colorSchemeMode</Text> auto-swap no longer applies — a partial
            override merges onto the light default. To support both schemes with a custom brand,
            build one theme per mode from <Text variant="code">DEFAULT_THEME</Text> /{' '}
            <Text variant="code">DARK_THEME</Text> and select with{' '}
            <Text variant="code">useThemeMode().actualColorScheme</Text> (next section).
          </Notice>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Light & dark                                                     */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Light & dark mode"
          lead="The current resolved scheme is theme.colorScheme."
        >
          <Row align="center" gap="sm">
            <Text variant="p" colorVariant="secondary">This page is currently rendering in</Text>
            <Badge color={theme.colorScheme === 'dark' ? 'secondary' : 'warning'}>
              {theme.colorScheme}
            </Badge>
            <Text variant="p" colorVariant="secondary">mode.</Text>
          </Row>

          <Text variant="p" colorVariant="secondary">
            For persistence and OS-following, pass a <Text variant="code">themeModeConfig</Text>. The
            provider then tracks a <Text variant="code">'light' | 'dark' | 'auto'</Text> mode, stores
            it, and reflects it on the document element.
          </Text>
          <CodeBlock language="tsx" title="Persisted, OS-aware mode" spoiler={false}>
{`import { PlatformBlocksProvider, type ThemeModeConfig } from '@platform-blocks/ui';

const themeModeConfig: ThemeModeConfig = {
  initialMode: 'auto',            // 'light' | 'dark' | 'auto'
  persistence: {
    get: () => localStorage.getItem('app-theme') as any,
    set: (mode) => localStorage.setItem('app-theme', mode),
  },
  domConfig: {                    // web only — toggles classes/attrs on <html>
    selector: 'html',
    lightClass: 'app-light',
    darkClass: 'app-dark',
    attribute: 'data-theme',
  },
};

<PlatformBlocksProvider themeModeConfig={themeModeConfig}>
  <YourApp />
</PlatformBlocksProvider>`}
          </CodeBlock>

          <Title order={3} size={20} weight="semibold" mt="md">Controlling mode from anywhere</Title>
          <CodeBlock language="tsx" title="useThemeMode()" spoiler={false}>
{`import { useThemeMode } from '@platform-blocks/ui';

function ThemeToggle() {
  const { mode, setMode, cycleMode, actualColorScheme } = useThemeMode();
  // mode: what the user picked ('auto' | 'light' | 'dark')
  // actualColorScheme: the resolved value ('light' | 'dark')
  return (
    <Button onPress={cycleMode}>
      {mode} → {actualColorScheme}
    </Button>
  );
}`}
          </CodeBlock>
          <Text variant="small" colorVariant="muted">
            <Text variant="code">cycleMode()</Text> steps light → dark → auto.{' '}
            <Text variant="code">useThemeMode()</Text> must be used under a provider configured with{' '}
            <Text variant="code">themeModeConfig</Text>.
          </Text>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* CSS variables                                                    */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="CSS variables (web)"
          lead="On web the provider injects the whole theme as CSS custom properties (on by default via withCSSVariables). Use them from plain CSS for elements outside React's control."
        >
          <CodeBlock language="css" title="Real variable names" spoiler={false}>
{`.my-element {
  background: var(--platform-blocks-color-primary-5);
  color: var(--platform-blocks-bg-base);
  padding: var(--platform-blocks-spacing-md);
  border-radius: var(--platform-blocks-radius-md);
  box-shadow: var(--platform-blocks-shadow-md);
}`}
          </CodeBlock>
          <Text variant="p" colorVariant="secondary">The injected families:</Text>
          <Card variant="outline" p="md">
            <Column gap="xs">
              {[
                ['--platform-blocks-color-{name}-{0..9}', 'Every palette shade, e.g. …-color-success-6'],
                ['--platform-blocks-primary-color', 'The primaryColor value'],
                ['--platform-blocks-bg-{base|subtle|surface|elevated}', 'Semantic backgrounds'],
                ['--platform-blocks-border-color', 'backgrounds.border'],
                ['--platform-blocks-font-size-{xs..3xl}', 'Type scale'],
                ['--platform-blocks-spacing-{xs..3xl}', 'Spacing scale'],
                ['--platform-blocks-radius-{xs..3xl}', 'Corner radii'],
                ['--platform-blocks-shadow-{xs..xl}', 'Elevation'],
                ['--platform-blocks-breakpoint-{xs..xl}', 'Responsive thresholds'],
                ['--platform-blocks-color-scheme', "'light' or 'dark'"],
              ].map(([name, note]) => (
                <Row key={name} gap="md" style={{ flexWrap: 'wrap' }} align="baseline">
                  <Text variant="code" style={{ fontSize: 12 }}>{name}</Text>
                  <Text variant="small" colorVariant="secondary">{note}</Text>
                </Row>
              ))}
            </Column>
          </Card>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Extension points                                                 */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Extension points"
          lead="Two buckets exist for app-level data you want to carry on the theme."
        >
          <Grid columns={12} gap="md">
            <GridItem span={{ base: 12, sm: 6 }}>
              <Card variant="outline" p="md" style={{ height: '100%' }}>
                <Text variant="strong" style={{ fontFamily: 'monospace' }}>theme.other</Text>
                <Text variant="small" colorVariant="secondary" mt="xs">
                  A free-form <Text variant="code">Record&lt;string, any&gt;</Text> for your own
                  tokens — z-index scales, custom elevations, brand metadata. The default theme uses
                  it for <Text variant="code">zIndices</Text> and <Text variant="code">elevations</Text>.
                </Text>
              </Card>
            </GridItem>
            <GridItem span={{ base: 12, sm: 6 }}>
              <Card variant="outline" p="md" style={{ height: '100%' }}>
                <Text variant="strong" style={{ fontFamily: 'monospace' }}>theme.components</Text>
                <Text variant="small" colorVariant="secondary" mt="xs">
                  A reserved slot for per-component default props and variants. It is part of the
                  type today but not yet consumed by the built-in components — treat it as
                  forward-looking rather than a wired feature.
                </Text>
              </Card>
            </GridItem>
          </Grid>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Best practices                                                   */}
        {/* ---------------------------------------------------------------- */}
        <Section title="Best practices">
          <Column gap="sm">
            {[
              ['Compose from tokens, not hex', 'Reach for theme.colors.* and the semantic tokens. A stray #hex is a bug that breaks dark mode and rebrands.'],
              ['Semantic for text & surfaces', 'text.* and backgrounds.* adapt across schemes; raw ramp indices do not.'],
              ['Keep the full 0–9 ramp', 'When overriding a palette, supply all ten steps so tints and shades stay coherent.'],
              ['Test both schemes', 'Toggle light and dark before shipping — contrast and elevation read differently in each.'],
              ['Subscribe narrowly', 'Prefer useThemeVisuals / useThemeLayout in hot components to avoid needless re-renders.'],
            ].map(([t, d], i) => (
              <Row key={t} gap="md" align="flex-start">
                <View
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 13,
                    backgroundColor: theme.colors.primary[5],
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ color: theme.text.onPrimary || '#fff', fontSize: 13, fontWeight: '700' }}>
                    {i + 1}
                  </Text>
                </View>
                <Column style={{ flex: 1 }}>
                  <Text variant="strong">{t}</Text>
                  <Text variant="p" colorVariant="secondary">{d}</Text>
                </Column>
              </Row>
            ))}
          </Column>
        </Section>

        {/* ---------------------------------------------------------------- */}
        {/* Live snapshot                                                    */}
        {/* ---------------------------------------------------------------- */}
        <Section
          title="Live theme snapshot"
          lead="The exact values powering this page right now."
        >
          <CodeBlock language="json" title="Active theme (excerpt)" spoiler={true} spoilerMaxHeight={280}>
            {JSON.stringify(
              {
                primaryColor: theme.primaryColor,
                colorScheme: theme.colorScheme,
                fontFamily: theme.fontFamily,
                text: theme.text,
                backgrounds: theme.backgrounds,
                spacing: theme.spacing,
                radii: theme.radii,
              },
              null,
              2,
            )}
          </CodeBlock>
        </Section>

        <Divider my="xl" />
        <Text variant="small" colorVariant="muted" style={{ textAlign: 'center' }}>
          Types live in <Text variant="code">PlatformBlocksTheme</Text> /{' '}
          <Text variant="code">PlatformBlocksThemeOverride</Text> — the authoritative shape for
          everything on this page.
        </Text>
        <View style={{ height: 48 }} />
      </View>
    </PageLayout>
  );
};

export default ThemingPage;
