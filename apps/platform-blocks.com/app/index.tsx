import React, { useState } from 'react';
import { Linking, Platform, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Accordion,
  Avatar,
  AvatarGroup,
  Badge,
  Blockquote,
  Block,
  Breadcrumbs,
  BrandButton,
  Button,
  Card,
  Checkbox,
  Chip,
  CodeBlock,
  ColorPicker,
  ColorSwatch,
  DatePickerInput,
  Divider,
  Flex,
  Grid,
  GridItem,
  Highlight,
  Icon,
  IconButton,
  Indicator,
  Input,
  KeyCap,
  Loader,
  Notice,
  NumberInput,
  Pagination,
  PinInput,
  Progress,
  RadioGroup,
  Rating,
  Ring,
  SegmentedControl,
  Select,
  ShimmerText,
  Skeleton,
  Slider,
  Space,
  Spoiler,
  Stepper,
  Switch,
  Table,
  Tabs,
  Text,
  Timeline,
  Title,
  Tooltip,
  useBreakpoint,
  useTheme,
} from '@platform-blocks/ui';
import { AreaChart, BarChart, PieChart } from '@platform-blocks/charts';

import { useBrowserTitle, formatPageTitle } from '../hooks/useBrowserTitle';
import { PageLayout } from 'components';
import { GITHUB_REPO, DISCORD_INVITE, NPM_PACKAGE } from 'config/urls';

/* ------------------------------------------------------------------ */
/*  Static data                                                       */
/* ------------------------------------------------------------------ */

const COMPONENT_TABS: { key: string; label: string; }[] = [
  { key: 'inputs', label: 'Inputs' },
  { key: 'actions', label: 'Actions' },
  { key: 'feedback', label: 'Feedback' },
  { key: 'navigation', label: 'Navigation' },
  { key: 'display', label: 'Display' },
  { key: 'typography', label: 'Typography' },
  { key: 'data', label: 'Data' },
  { key: 'dates', label: 'Dates' },
];

const CATEGORIES: { label: string; icon: string; count: number; route: string }[] = [
  { label: 'Inputs', icon: 'input', count: 21, route: '/components?category=input' },
  { label: 'Charts', icon: 'chart-bar', count: 25, route: '/charts' },
  { label: 'Display', icon: 'card', count: 10, route: '/components?category=display' },
  { label: 'Typography', icon: 'text', count: 11, route: '/components?category=typography' },
  { label: 'Dates', icon: 'calendar', count: 10, route: '/components?category=dates' },
  { label: 'Navigation', icon: 'menu', count: 10, route: '/components?category=navigation' },
  { label: 'Feedback', icon: 'bell', count: 9, route: '/components?category=feedback' },
  { label: 'Layout', icon: 'grid', count: 8, route: '/components?category=layout' },
  { label: 'Data', icon: 'datatable', count: 8, route: '/components?category=data' },
  { label: 'Media', icon: 'image', count: 4, route: '/components?category=media' },
];

const CHART_TYPES: { name: string; icon: string; slug: string }[] = [
  { name: 'Bar', icon: 'chart-bar', slug: 'BarChart' },
  { name: 'Line', icon: 'chart-line', slug: 'LineChart' },
  { name: 'Area', icon: 'chart-area', slug: 'AreaChart' },
  { name: 'Pie', icon: 'chart-pie', slug: 'PieChart' },
  { name: 'Scatter', icon: 'chart-scatter', slug: 'ScatterChart' },
  { name: 'Heatmap', icon: 'chart-heatmap', slug: 'HeatmapChart' },
  { name: 'Radar', icon: 'chart-line', slug: 'RadarChart' },
  { name: 'Candlestick', icon: 'chart-line', slug: 'CandlestickChart' },
  { name: 'Funnel', icon: 'funnel', slug: 'FunnelChart' },
  { name: 'Sankey', icon: 'chart-line', slug: 'SankeyChart' },
  { name: 'Donut', icon: 'chart-donut', slug: 'DonutChart' },
  { name: 'Gauge', icon: 'speedometer', slug: 'GaugeChart' },
];

const HOOKS: { icon: string; name: string; description: string; route: string }[] = [
  { icon: 'keyboard', name: 'useHotkeys', description: 'Bind keyboard shortcuts to actions', route: '/hooks/useHotkeys' },
  { icon: 'copy', name: 'useClipboard', description: 'Copy text to clipboard with feedback', route: '/hooks/useClipboard' },
  { icon: 'phone', name: 'useHaptics', description: 'Trigger haptic feedback on native devices', route: '/hooks/useHaptics' },
  { icon: 'eye', name: 'useScrollSpy', description: 'Track visible sections for table-of-contents highlighting', route: '/hooks/useScrollSpy' },
  { icon: 'text', name: 'useMaskedInput', description: 'Apply input masks for phone, currency, and other formats', route: '/hooks/useMaskedInput' },
  { icon: 'info', name: 'useDeviceInfo', description: 'Access platform, screen, and device capabilities', route: '/hooks/useDeviceInfo' },
];

const CHART_HOOKS: { icon: string; name: string; description: string }[] = [
  { icon: 'search', name: 'usePanZoom', description: 'Pan and zoom gesture handling for chart interaction' },
  { icon: 'refresh', name: 'useStreamingData', description: 'Handle real-time data feeds with automatic chart updates' },
  { icon: 'sparkles', name: 'useChartAnimation', description: 'Control animation timing and transitions' },
  { icon: 'target', name: 'useNearestPoint', description: 'Find the closest data point for tooltip display' },
];

const FEATURES: { icon: string; title: string; description: string }[] = [
  { icon: 'globe', title: 'Cross-platform', description: 'One codebase for iOS, Android, and Web via React Native and Expo.' },
  { icon: 'sparkles', title: 'Animated', description: 'Smooth transitions powered by react-native-reanimated.' },
  { icon: 'palette', title: 'Themeable', description: 'Light, dark, and custom themes with consistent design tokens.' },
  { icon: 'eye', title: 'Accessible', description: 'Screen reader support, keyboard navigation, and focus management.' },
  { icon: 'tree', title: 'Tree-shakeable', description: 'ESM and CJS builds with no side effects — import only what you use.' },
  { icon: 'chart-bar', title: '25+ chart types', description: 'Full data visualization suite with tooltips, pan & zoom, and streaming.' },
];

/* ------------------------------------------------------------------ */
/*  Code snippets                                                     */
/* ------------------------------------------------------------------ */

const QUICK_START_CODE = `import { PlatformBlocksProvider, Button, Input } from '@platform-blocks/ui';

export default function App() {
  return (
    <PlatformBlocksProvider>
      <Input label="Email" placeholder="you@example.com" />
      <Button title="Sign up" variant="gradient" />
    </PlatformBlocksProvider>
  );
}`;

const THEMING_CODE = `import { PlatformBlocksProvider, createTheme } from '@platform-blocks/ui';

const theme = createTheme({
  primaryColor: 'blue',
  fontFamily: 'Inter',
});

export default function App() {
  return (
    <PlatformBlocksProvider theme={theme} defaultColorScheme="dark">
      <YourApp />
    </PlatformBlocksProvider>
  );
}`;

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function openUrl(url: string) {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    window.open(url, '_blank');
  } else {
    Linking.openURL(url).catch(() => {});
  }
}

/* ------------------------------------------------------------------ */
/*  Section heading helper                                            */
/* ------------------------------------------------------------------ */

function SectionHeader({ title, subtitle, action }: { title: string; subtitle: string; action?: React.ReactNode }) {
  return (
    <Block style={{ width: '100%', marginBottom: 24 }}>
      <Title variant="h2" weight="bold" afterline action={action}>{title}</Title>
      <Text size="md" colorVariant="secondary" style={{ maxWidth: 640 }}>{subtitle}</Text>
    </Block>
  );
}

/* ------------------------------------------------------------------ */
/*  Inline component demos                                            */
/* ------------------------------------------------------------------ */

function InputsDemo() {
  const [framework, setFramework] = useState('rn');
  const [quantity, setQuantity] = useState<number | undefined>(3);
  const [color, setColor] = useState('#6366f1');
  const [plan, setPlan] = useState('pro');
  return (
    <Card p="lg">
      <Block direction="column" gap="md">
        <Input label="Project name" placeholder="my-app" description="The name of your new project" />
        <Select
          label="Framework"
          placeholder="Choose a framework"
          options={[
            { label: 'React Native', value: 'rn' },
            { label: 'Expo', value: 'expo' },
            { label: 'Next.js', value: 'next' },
          ]}
          value={framework}
          onChange={setFramework}
          fullWidth
        />
        <NumberInput label="Quantity" value={quantity} onChange={setQuantity} min={0} max={99} step={1} />
        <RadioGroup
          label="Plan"
          value={plan}
          onChange={setPlan}
          orientation="horizontal"
          options={[
            { label: 'Free', value: 'free' },
            { label: 'Pro', value: 'pro' },
            { label: 'Enterprise', value: 'enterprise' },
          ]}
        />
        <ColorPicker label="Brand color" value={color} onChange={setColor} swatches={['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#3b82f6']} />
        <PinInput length={5} placeholder="○" />
      </Block>
    </Card>
  );
}

function ActionsDemo() {
  const [checked, setChecked] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [volume, setVolume] = useState(60);
  const [view, setView] = useState('grid');
  return (
    <Card p="lg">
      <Block direction="column" gap="md">
        <Block direction="row" gap="sm" wrap>
          <Button title="Primary" variant="filled" />
          <Button title="Secondary" variant="secondary" />
          <Button title="Outline" variant="outline" />
          <Button title="Gradient" variant="gradient" />
        </Block>
        <Block direction="row" gap="sm" wrap>
          <IconButton icon="heart" variant="filled" tooltip="Like" />
          <IconButton icon="bookmark" variant="outline" tooltip="Save" />
          <IconButton icon="share" variant="ghost" tooltip="Share" />
          <IconButton icon="settings" variant="secondary" tooltip="Settings" />
        </Block>
        <SegmentedControl data={['Grid', 'List', 'Board']} value={view} onChange={setView} fullWidth />
        <Divider />
        <Switch label="Enable notifications" checked={notifications} onChange={setNotifications} color="success" />
        <Checkbox label="I agree to the terms" checked={checked} onChange={setChecked} />
        <Slider label="Volume" value={volume} onChange={setVolume} min={0} max={100} fullWidth />
      </Block>
    </Card>
  );
}

function FeedbackDemo() {
  return (
    <Card p="lg">
      <Block direction="column" gap="md">
        <Notice sev="info" title="Update available">A new version of Platform Blocks is ready to install.</Notice>
        <Notice sev="success" title="Changes saved">Your settings have been updated successfully.</Notice>
        <Block direction="column" gap="xs">
          <Text size="sm" weight="medium">Uploading files...</Text>
          <Progress value={68} color="primary" />
        </Block>
        <Block direction="row" gap="lg" align="center">
          <Ring value={72} size={80} thickness={8} label="72%" />
          <Block direction="row" gap="md">
            <Loader variant="dots" size="sm" />
            <Loader variant="bars" size="sm" />
            <Loader variant="oval" size="sm" />
          </Block>
        </Block>
        <Block direction="row" gap="sm">
          <Skeleton w={40} h={40} shape="circle" />
          <Block direction="column" gap="xs" style={{ flex: 1 }}>
            <Skeleton h={14} w="60%" />
            <Skeleton h={10} w="90%" />
          </Block>
        </Block>
      </Block>
    </Card>
  );
}

function NavigationDemo() {
  const [page, setPage] = useState(1);
  const [step, setStep] = useState(1);
  return (
    <Card p="lg">
      <Block direction="column" gap="lg">
        <Breadcrumbs items={[
          { label: 'Home', onPress: () => {} },
          { label: 'Components', onPress: () => {} },
          { label: 'Breadcrumbs' },
        ]} />
        <Stepper active={step} onStepClick={setStep}>
          <Stepper.Step label="Account" />
          <Stepper.Step label="Profile" />
          <Stepper.Step label="Review" />
        </Stepper>
        <Pagination total={5} current={page} onChange={setPage} />
      </Block>
    </Card>
  );
}

function DisplayDemo() {
  return (
    <Card p="lg">
      <Block direction="column" gap="md">
        <Block direction="row" gap="sm" align="center">
          <AvatarGroup>
            <Indicator color="green" placement="bottom-right"><Avatar fallback="A" /></Indicator>
            <Avatar fallback="B" />
            <Avatar fallback="C" />
          </AvatarGroup>
          <Badge color="primary">Pro</Badge>
          <Badge color="success" variant="outline">Active</Badge>
        </Block>
        <Block direction="row" gap="xs" align="center">
          <ColorSwatch color="#6366f1" size={24} />
          <ColorSwatch color="#ec4899" size={24} />
          <ColorSwatch color="#10b981" size={24} />
          <ColorSwatch color="#f59e0b" size={24} />
          <ColorSwatch color="#3b82f6" size={24} />
        </Block>
        <Spoiler maxHeight={44} showLabel="Show more" hideLabel="Show less">
          <Text size="sm" colorVariant="secondary">
            Platform Blocks includes 116+ components for building production-ready applications. Every component is fully customizable with design tokens, supports dark mode out of the box, and follows WAI-ARIA accessibility guidelines. The library is tree-shakeable and supports ESM and CJS builds.
          </Text>
        </Spoiler>
        <Tooltip label="This is a tooltip" withArrow>
          <Button title="Hover me" variant="outline" size="sm" />
        </Tooltip>
        <Accordion items={[
          { key: 'customization', title: 'Is it customizable?', content: <Text size="sm" colorVariant="secondary">Yes — every component supports custom themes, design tokens, and style overrides.</Text> },
          { key: 'accessible', title: 'Is it accessible?', content: <Text size="sm" colorVariant="secondary">All components follow WAI-ARIA guidelines with screen reader and keyboard support.</Text> },
        ]} />
      </Block>
    </Card>
  );
}

function DatesDemo() {
  return (
    <Card p="lg">
      <Block direction="column" gap="md">
        <DatePickerInput label="Start date" placeholder="Pick a start date" />
        <DatePickerInput label="End date" placeholder="Pick an end date" />
      </Block>
    </Card>
  );
}

function TypographyDemo() {
  return (
    <Card p="lg">
      <Block direction="column" gap="md">
        <Title order={3} afterline underlineStroke={3}>Section heading</Title>
        <ShimmerText size="lg" weight="bold" duration={3} repeat>Platform Blocks</ShimmerText>
        <Highlight highlight={['Platform Blocks', 'accessible']} highlightColor="primary">
          Platform Blocks makes it easy to build accessible, production-ready interfaces.
        </Highlight>
        <Blockquote variant="testimonial" author={{ name: 'Sarah Chen', title: 'Engineering Lead' }}>
          Platform Blocks cut our development time in half. The component quality is outstanding.
        </Blockquote>
        <Block direction="row" gap="sm" align="center" wrap>
          <KeyCap>⌘</KeyCap>
          <KeyCap>K</KeyCap>
          <Text size="sm" colorVariant="secondary">to open the command palette</Text>
        </Block>
      </Block>
    </Card>
  );
}

function DataDemo() {
  const [rating, setRating] = useState(3.5);
  return (
    <Card p="lg">
      <Block direction="column" gap="lg">
        <Block direction="row" gap="sm" wrap>
          <Chip variant="filled" color="primary">React Native</Chip>
          <Chip variant="light" color="success">Stable</Chip>
          <Chip variant="outline" color="warning">v0.8.0</Chip>
        </Block>
        <Rating value={rating} onChange={setRating} count={5} size="md" label="Rate this library" />
        <Table
          data={{
            head: ['Component', 'Category', 'Status'],
            body: [
              ['Button', 'Actions', 'Stable'],
              ['DatePicker', 'Dates', 'Stable'],
              ['DataTable', 'Data', 'Beta'],
            ],
          }}
          striped
          highlightOnHover
          withTableBorder
        />
        <Timeline active={1}>
          <Timeline.Item title="v0.8.0 released" timestamp="Mar 2026">
            <Text size="sm" colorVariant="secondary">New chart types and animation system</Text>
          </Timeline.Item>
          <Timeline.Item title="v0.7.0 released" timestamp="Jan 2026">
            <Text size="sm" colorVariant="secondary">DataTable, Timeline, and 15 new components</Text>
          </Timeline.Item>
          <Timeline.Item title="v0.6.0 released" timestamp="Nov 2025">
            <Text size="sm" colorVariant="secondary">Initial public release</Text>
          </Timeline.Item>
        </Timeline>
      </Block>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Inline chart demos                                                */
/* ------------------------------------------------------------------ */

const AREA_DATA = [
  { x: 0, y: 4200, label: 'Jan' },
  { x: 1, y: 5800, label: 'Feb' },
  { x: 2, y: 5100, label: 'Mar' },
  { x: 3, y: 7200, label: 'Apr' },
  { x: 4, y: 6800, label: 'May' },
  { x: 5, y: 9100, label: 'Jun' },
];

const BAR_DATA = [
  { category: 'Q1', value: 42, color: '#3b82f6' },
  { category: 'Q2', value: 58, color: '#8b5cf6' },
  { category: 'Q3', value: 35, color: '#06b6d4' },
  { category: 'Q4', value: 71, color: '#10b981' },
];

const PIE_DATA = [
  { label: 'Mobile', value: 45, color: '#3b82f6' },
  { label: 'Desktop', value: 35, color: '#8b5cf6' },
  { label: 'Tablet', value: 20, color: '#06b6d4' },
];

/* ------------------------------------------------------------------ */
/*  Home screen                                                       */
/* ------------------------------------------------------------------ */

export default function HomeScreen() {
  const router = useRouter();
  const breakpoint = useBreakpoint();
  const theme = useTheme();

  const isMobile = breakpoint === 'base' || breakpoint === 'xs' || breakpoint === 'sm';
  const isTablet = breakpoint === 'md';
  const cols = isMobile ? 1 : isTablet ? 2 : 3;

  useBrowserTitle(formatPageTitle('Home'));

  return (
    <PageLayout>

      {/* ━━ HERO ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <Block style={{ width: '100%', maxWidth: 800, paddingTop: isMobile ? 24 : 48, paddingBottom: isMobile ? 32 : 56 }}>
        <Title variant="h1" size={isMobile ? 36 : 52} weight="bold" afterline underlineStroke={4}
          subtitle="Build cross-platform apps faster than ever — Platform Blocks includes more than 100 customizable components, 25+ chart types, and a hooks library to cover you in any situation"
        >Platform Blocks</Title>
        <Space h="xl" />
        <Block direction="row" gap="md" wrap>
          <Button title="Get Started" variant="gradient" onPress={() => router.push('/getting-started')} />
          <BrandButton title="GitHub" brand="github" variant="outline" onPress={() => openUrl(GITHUB_REPO)} />
        </Block>
      </Block>

      {/* ━━ 116+ COMPONENTS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <Block style={{ width: '100%', paddingVertical: isMobile ? 32 : 56 }}>
        <SectionHeader
          title="116+ components"
          subtitle="Build your next app faster with high-quality, accessible components. Platform Blocks includes everything you need: inputs, date pickers, charts, dialogs, navigation, and more."
          action={<Button title="Browse all" variant="ghost" size="sm" onPress={() => router.push('/components')} />}
        />

        <Tabs
          variant="chip"
          color="primary"
          scrollable={isMobile}
          items={COMPONENT_TABS.map((tab) => ({
            key: tab.key,
            label: tab.label,
            content: tab.key === 'inputs' ? <InputsDemo />
              : tab.key === 'actions' ? <ActionsDemo />
              : tab.key === 'feedback' ? <FeedbackDemo />
              : tab.key === 'navigation' ? <NavigationDemo />
              : tab.key === 'display' ? <DisplayDemo />
              : tab.key === 'typography' ? <TypographyDemo />
              : tab.key === 'data' ? <DataDemo />
              : <DatesDemo />,
          }))}
        />

        <Space h="xl" />

        {/* Category grid */}
        <Grid columns={isMobile ? 2 : isTablet ? 3 : 5} gap="md" style={{ width: '100%' }}>
          {CATEGORIES.map((cat) => (
            <GridItem key={cat.label} span={1}>
              <Pressable onPress={() => router.push(cat.route)}>
                <Card variant="elevated" p="md" style={{ alignItems: 'center' }}>
                  <Icon name={cat.icon} size="md" color={theme.colors.primary[6]} />
                  <Space h="xs" />
                  <Text size="sm" weight="semibold">{cat.label}</Text>
                  <Text size="xs" colorVariant="secondary">{cat.count} components</Text>
                </Card>
              </Pressable>
            </GridItem>
          ))}
        </Grid>
      </Block>

      {/* ━━ DATA VISUALIZATION ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <Block style={{ width: '100%', paddingVertical: isMobile ? 32 : 56 }}>
        <SectionHeader
          title="Data visualization"
          subtitle="25+ chart types with smooth animations, interactive tooltips, pan & zoom, and real-time streaming support — all rendered natively with react-native-svg."
          action={<Button title="Browse all charts" variant="ghost" size="sm" onPress={() => router.push('/charts')} />}
        />

        {/* Live chart demos */}
        <Grid columns={cols} gap="lg" style={{ width: '100%', marginBottom: 32 }}>
          <GridItem span={1}>
            <Card variant="elevated" p="md">
              <Text size="sm" weight="semibold" style={{ marginBottom: 8 }}>Revenue trend</Text>
              <AreaChart width={320} height={180} data={AREA_DATA} xAxis={{ show: true, labelFormatter: (v) => AREA_DATA[v]?.label ?? '' }} yAxis={{ show: true }} />
            </Card>
          </GridItem>
          <GridItem span={1}>
            <Card variant="elevated" p="md">
              <Text size="sm" weight="semibold" style={{ marginBottom: 8 }}>Quarterly results</Text>
              <BarChart
                width={320}
                height={180}
                data={BAR_DATA}
                xAxis={{ show: true }}
                yAxis={{ show: true }}
              />
            </Card>
          </GridItem>
          {!isMobile && (
            <GridItem span={1}>
              <Card variant="elevated" p="md">
                <Text size="sm" weight="semibold" style={{ marginBottom: 8 }}>Traffic sources</Text>
                <PieChart width={320} height={180} data={PIE_DATA} legend={{ show: true }} />
              </Card>
            </GridItem>
          )}
        </Grid>

        {/* Chart type grid */}
        <Grid columns={isMobile ? 3 : isTablet ? 4 : 6} gap="sm" style={{ width: '100%' }}>
          {CHART_TYPES.map((chart) => (
            <GridItem key={chart.slug} span={1}>
              <Pressable onPress={() => router.push(`/charts/${chart.slug}`)}>
                <Card variant="elevated" p="sm" style={{ alignItems: 'center' }}>
                  <Icon name={chart.icon} size="md" color={theme.colors.primary[6]} />
                  <Space h="xs" />
                  <Text size="xs" weight="medium">{chart.name}</Text>
                </Card>
              </Pressable>
            </GridItem>
          ))}
        </Grid>
      </Block>

      {/* ━━ HOOKS LIBRARY ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <Block style={{ width: '100%', paddingVertical: isMobile ? 32 : 56 }}>
        <SectionHeader
          title="Hooks library"
          subtitle="Reusable React hooks for common and complex tasks — keyboard shortcuts, haptics, clipboard, scroll tracking, and more."
          action={<Button title="Browse all hooks" variant="ghost" size="sm" onPress={() => router.push('/hooks')} />}
        />

        <Grid columns={{ base: 1, sm: 2, xl: 3 }} gap="md" style={{ width: '100%' }}>
          {HOOKS.map((hook) => (
            <GridItem key={hook.name} span={1}>
              <Pressable onPress={() => router.push(hook.route)}>
                <Card variant="elevated" p="lg" style={{ height: '100%' }}>
                  <Block direction="row" gap="sm" align="center">
                    <Icon name={hook.icon} size="md" color={theme.colors.primary[6]} />
                    <Text size="md" weight="semibold" color={theme.colors.primary[6]}>{hook.name}</Text>
                  </Block>
                  <Space h="xs" />
                  <Text size="sm" colorVariant="secondary">{hook.description}</Text>
                </Card>
              </Pressable>
            </GridItem>
          ))}
        </Grid>

        <Space h="lg" />
        <Text size="sm" weight="semibold" style={{ marginBottom: 12 }}>Chart hooks</Text>
        <Grid columns={{ base: 1, sm: 2 }} gap="md" style={{ width: '100%' }}>
          {CHART_HOOKS.map((hook) => (
            <GridItem key={hook.name} span={1}>
              <Card variant="elevated" p="md">
                <Block direction="row" gap="sm" align="center">
                  <Icon name={hook.icon} size="sm" color={theme.colors.primary[6]} />
                  <Text size="sm" weight="semibold" color={theme.colors.primary[6]}>{hook.name}</Text>
                </Block>
                <Space h="xs" />
                <Text size="xs" colorVariant="secondary">{hook.description}</Text>
              </Card>
            </GridItem>
          ))}
        </Grid>
      </Block>

      {/* ━━ THEMING & DARK MODE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <Block style={{ width: '100%', paddingVertical: isMobile ? 32 : 56 }}>
        <SectionHeader
          title="Theming & dark mode"
          subtitle="Add dark theme to your application with a few lines of code. All components support dark mode out of the box, and you can create fully custom themes with design tokens."
          action={<Button title="Learn more" variant="ghost" size="sm" onPress={() => router.push('/theming')} />}
        />

        <Grid columns={isMobile ? 1 : 2} gap="lg" style={{ width: '100%' }}>
          <GridItem span={1}>
            <CodeBlock language="tsx">{THEMING_CODE}</CodeBlock>
          </GridItem>
          <GridItem span={1}>
            <Grid columns={1} gap="md" style={{ width: '100%' }}>
              <GridItem span={1}>
                <Card variant="elevated" p="lg">
                  <Block direction="column" gap="sm">
                    <Icon name="palette" size="lg" color={theme.colors.primary[6]} />
                    <Text size="md" weight="semibold">Custom themes</Text>
                    <Text size="sm" colorVariant="secondary">Create themes with custom colors, fonts, spacing, and radius. Apply globally or per-component.</Text>
                  </Block>
                </Card>
              </GridItem>
              <GridItem span={1}>
                <Card variant="elevated" p="lg">
                  <Block direction="column" gap="sm">
                    <Icon name="toggle" size="lg" color={theme.colors.primary[6]} />
                    <Text size="md" weight="semibold">Auto color scheme</Text>
                    <Text size="sm" colorVariant="secondary">Light, dark, and auto modes with system preference detection and persistence.</Text>
                  </Block>
                </Card>
              </GridItem>
            </Grid>
          </GridItem>
        </Grid>
      </Block>

      {/* ━━ WHY PLATFORM BLOCKS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <Block style={{ width: '100%', paddingVertical: isMobile ? 32 : 56 }}>
        <SectionHeader
          title="Why Platform Blocks?"
          subtitle="Everything you need to build production-ready apps on every platform."
        />

        <Grid columns={isMobile ? 1 : isTablet ? 2 : 3} gap="lg" style={{ width: '100%' }}>
          {FEATURES.map((f) => (
            <GridItem key={f.title} span={1}>
              <Card variant="elevated" p="lg" style={{ height: '100%' }}>
                <Block direction="column" gap="sm">
                  <Icon name={f.icon} size="lg" color={theme.colors.primary[6]} />
                  <Text size="md" weight="semibold">{f.title}</Text>
                  <Text size="sm" colorVariant="secondary">{f.description}</Text>
                </Block>
              </Card>
            </GridItem>
          ))}
        </Grid>
      </Block>

      {/* ━━ QUICK START ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <Block style={{ width: '100%', paddingVertical: isMobile ? 32 : 56 }}>
        <SectionHeader
          title="Quick start"
          subtitle="Get up and running in under a minute. Install the package and wrap your app in the provider."
        />

        <CodeBlock language="tsx">{QUICK_START_CODE}</CodeBlock>
      </Block>

      {/* ━━ COMMUNITY ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <Block style={{ width: '100%', paddingVertical: isMobile ? 32 : 56 }}>
        <SectionHeader
          title="Join the community"
          subtitle="Platform Blocks is open-source and growing. Join us on GitHub, Discord, and npm."
        />

        <Grid columns={isMobile ? 1 : 3} gap="lg" style={{ width: '100%' }}>
          <GridItem span={1}>
            <Pressable onPress={() => openUrl(DISCORD_INVITE)}>
              <Card variant="elevated" p="lg" style={{ height: '100%' }}>
                <Block direction="column" gap="sm">
                  <Icon name="chat" size="lg" color={theme.colors.primary[6]} />
                  <Text size="md" weight="semibold">Chat on Discord</Text>
                  <Text size="sm" colorVariant="secondary">Ask questions, share feedback, and explore upcoming features with the community.</Text>
                </Block>
              </Card>
            </Pressable>
          </GridItem>
          <GridItem span={1}>
            <Pressable onPress={() => openUrl(GITHUB_REPO)}>
              <Card variant="elevated" p="lg" style={{ height: '100%' }}>
                <Block direction="column" gap="sm">
                  <Icon name="code" size="lg" color={theme.colors.primary[6]} />
                  <Text size="md" weight="semibold">Contribute on GitHub</Text>
                  <Text size="sm" colorVariant="secondary">Report issues, request features, and contribute code to the project.</Text>
                </Block>
              </Card>
            </Pressable>
          </GridItem>
          <GridItem span={1}>
            <Pressable onPress={() => openUrl(NPM_PACKAGE)}>
              <Card variant="elevated" p="lg" style={{ height: '100%' }}>
                <Block direction="column" gap="sm">
                  <Icon name="package" size="lg" color={theme.colors.primary[6]} />
                  <Text size="md" weight="semibold">Install from npm</Text>
                  <Text size="sm" colorVariant="secondary">Available as @platform-blocks/ui and @platform-blocks/charts on npm.</Text>
                </Block>
              </Card>
            </Pressable>
          </GridItem>
        </Grid>
      </Block>

      {/* ━━ READY TO GET STARTED ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <Block style={{ width: '100%', alignItems: 'center', paddingVertical: isMobile ? 40 : 64 }}>
        <Title variant="h2" size={28} weight="bold" mb={8} style={{ textAlign: 'center' }}>
          Ready to get started?
        </Title>
        <Text size="md" colorVariant="secondary" style={{ textAlign: 'center', marginBottom: 24, maxWidth: 480 }}>
          Start building with Platform Blocks in minutes. Follow the installation guide or explore the example apps.
        </Text>
        <Block direction="row" gap="md" wrap style={{ justifyContent: 'center' }}>
          <Button title="Get Started" variant="gradient" onPress={() => router.push('/getting-started')} />
          <Button title="Installation" variant="secondary" onPress={() => router.push('/installation')} />
          <Button title="Browse Examples" variant="outline" onPress={() => router.push('/examples')} />
        </Block>
        <Space h="lg" />
        <Flex direction="row" gap="sm" align="center">
          <BrandButton title="GitHub" brand="github" variant="ghost" size="sm" onPress={() => openUrl(GITHUB_REPO)} />
          <BrandButton title="Discord" brand="discord" variant="ghost" size="sm" onPress={() => openUrl(DISCORD_INVITE)} />
          <BrandButton title="npm" brand="npm" variant="ghost" size="sm" onPress={() => openUrl(NPM_PACKAGE)} />
        </Flex>
      </Block>

      <Space h="xl" />
    </PageLayout>
  );
}
