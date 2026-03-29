import React from 'react';
import { View } from 'react-native';
import {
  Text,
  CodeBlock,
  useTheme,
  Badge,
  Divider,
  Column
} from '@platform-blocks/ui';
import { PageLayout } from 'components';
import { DocsPageHeader } from '../../components/DocsPageHeader';

const ThemingPage = () => {
  const theme = useTheme();

  return (
    <PageLayout>
      <View style={{ maxWidth: 800, alignSelf: 'center', width: '100%' }}>
        {/* Header */}
        <Column mb="xl">
          <DocsPageHeader>Theming Guide</DocsPageHeader>
          <Text variant="p" colorVariant="secondary" mb="md">
            Learn how to customize colors, typography, spacing, and components in the Platform Blocks UI library.
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            <Badge variant="outline" color="primary">Theming</Badge>
            <Badge variant="outline" color="secondary">Customization</Badge>
            <Badge variant="outline" color="tertiary">Design System</Badge>
          </View>
        </Column>

        {/* Quick Start */}

        <Text variant="h3" mb="md">🚀 Quick Start</Text>
        <Text variant="p" mb="md" colorVariant="secondary">
          The simplest way to customize your theme is to override the primary color and color palettes:
        </Text>
        <CodeBlock
          language="tsx"
          title="Basic Theme Customization"
          spoiler={false}
        >
          {`import { PlatformBlocksProvider, createTheme } from '@platform-blocks/ui';

// Create your custom theme
const customTheme = createTheme({
  primaryColor: '#3b82f6', // Custom primary color
  colors: {
    primary: [
      '#eff6ff', '#dbeafe', '#bfdbfe', '#93c5fd', 
      '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8', 
      '#1e40af', '#1e3a8a'
    ],
    success: [
      '#f0fdf4', '#dcfce7', '#bbf7d0', '#86efac',
      '#4ade80', '#22c55e', '#16a34a', '#15803d',
      '#166534', '#14532d'
    ]
  }
});

function App() {
  return (
    <PlatformBlocksProvider theme={customTheme}>
      {/* Your app content */}
    </PlatformBlocksProvider>
  );
}`}
        </CodeBlock>


        {/* Theme Structure */}

        <Text variant="h3" mb="md">🎨 Theme Structure</Text>
        <Text variant="p" mb="md" colorVariant="secondary">
          The theme system is built around these core concepts:
        </Text>

        <Column mb="md">
          <Text variant="h4" mb="sm">Color System</Text>
          <Text variant="p" mb="sm" colorVariant="secondary">
            Colors use a 10-step scale from lightest (0) to darkest (9):
          </Text>
          <CodeBlock language="tsx" spoiler={false}>
            {`colors: {
  primary: [
    '#eff6ff', // 0 - lightest
    '#dbeafe', // 1
    '#bfdbfe', // 2
    '#93c5fd', // 3
    '#60a5fa', // 4
    '#3b82f6', // 5 - main color
    '#2563eb', // 6
    '#1d4ed8', // 7
    '#1e40af', // 8
    '#1e3a8a'  // 9 - darkest
  ]
}`}
          </CodeBlock>
        </Column>

        <Column mb="md">
          <Text variant="h4" mb="sm">Semantic Colors</Text>
          <Text variant="p" mb="sm" colorVariant="secondary">
            Semantic colors adapt automatically to light/dark themes:
          </Text>
          <CodeBlock language="tsx" spoiler={false}>
            {`text: {
  primary: '#1f2937',    // High contrast text
  secondary: '#6b7280',  // Medium contrast text
  muted: '#9ca3af',      // Low contrast text
  disabled: '#d1d5db',   // Very low contrast
  link: '#3b82f6',       // Link color
  onPrimary: '#ffffff'   // Text on primary backgrounds
},
backgrounds: {
  base: '#ffffff',       // Main background
  subtle: '#f9fafb',     // Subtle sections
  surface: '#ffffff',    // Cards, containers
  elevated: '#ffffff',   // Modals, popovers
  border: '#e5e7eb'      // Borders, dividers
}`}
          </CodeBlock>
        </Column>


        {/* Comprehensive Customization */}

        <Text variant="h3" mb="md">⚙️ Comprehensive Customization</Text>
        <Text variant="p" mb="md" colorVariant="secondary">
          For complete control over your design system, you can customize all aspects of the theme:
        </Text>
        <CodeBlock
          language="tsx"
          title="Complete Theme Override"
          spoiler={true}
          spoilerMaxHeight={300}
        >
          {`import { createTheme, PlatformBlocksThemeOverride } from '@platform-blocks/ui';

const myCustomTheme: PlatformBlocksThemeOverride = {
  // Primary branding
  primaryColor: '#8b5cf6',
  
  // Color palettes (10-step scales)
  colors: {
    primary: [
      '#f5f3ff', '#ede9fe', '#ddd6fe', '#c4b5fd',
      '#a78bfa', '#8b5cf6', '#7c3aed', '#6d28d9',
      '#5b21b6', '#4c1d95'
    ],
    // Add custom color palettes
    brand: [
      '#fef7ee', '#fed7aa', '#fdba74', '#fb923c',
      '#f97316', '#ea580c', '#dc2626', '#b91c1c',
      '#991b1b', '#7f1d1d'
    ]
  },
  
  // Semantic text colors
  text: {
    primary: '#1f2937',
    secondary: '#6b7280',
    muted: '#9ca3af',
    disabled: '#d1d5db',
    link: '#8b5cf6',
    onPrimary: '#ffffff'
  },
  
  // Background & surface colors
  backgrounds: {
    base: '#ffffff',
    subtle: '#f9fafb',
    surface: '#ffffff',
    elevated: '#ffffff',
    border: '#e5e7eb'
  },
  
  // Typography
  fontFamily: 'Inter, system-ui, sans-serif',
  fontSizes: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px'
  },
  
  // Spacing
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px'
  },
  
  // Border radius
  radii: {
    xs: '2px',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '20px',
    '3xl': '24px'
  },
  
  // Component customization
  components: {
    Button: {
      defaults: {
        size: 'md',
        variant: 'filled'
      },
      variants: {
        brand: {
          backgroundColor: '#8b5cf6',
          color: '#ffffff'
        }
      }
    }
  }
};

const theme = createTheme(myCustomTheme);`}
        </CodeBlock>


        {/* Dark/Light Themes */}

        <Text variant="h3" mb="md">🌙 Dark & Light Themes</Text>
        <Text variant="p" mb="md" colorVariant="secondary">
          Create custom variants for both light and dark modes:
        </Text>
        <CodeBlock
          language="tsx"
          title="Theme Mode Variants"
          spoiler={false}
        >
          {`import { DEFAULT_THEME, DARK_THEME, mergeTheme } from '@platform-blocks/ui';

// Create custom light theme
const customLightTheme = mergeTheme(DEFAULT_THEME, {
  primaryColor: '#3b82f6',
  colors: {
    primary: [/* your light theme colors */]
  }
});

// Create custom dark theme
const customDarkTheme = mergeTheme(DARK_THEME, {
  primaryColor: '#60a5fa',
  colors: {
    primary: [/* your dark theme colors */]
  }
});

function App() {
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('light');
  const theme = colorScheme === 'dark' ? customDarkTheme : customLightTheme;
  
  return (
    <PlatformBlocksProvider theme={theme} colorSchemeMode={colorScheme}>
      {/* Your app */}
    </PlatformBlocksProvider>
  );
}`}
        </CodeBlock>


        {/* Enhanced Theme Mode */}

        <Text variant="h3" mb="md">🔄 Enhanced Theme Mode Management</Text>
        <Text variant="p" mb="md" colorVariant="secondary">
          Use the enhanced theme mode system for automatic theme switching with persistence:
        </Text>
        <CodeBlock
          language="tsx"
          title="Enhanced Theme Configuration"
          spoiler={false}
        >
          {`import { PlatformBlocksProvider, ThemeModeConfig } from '@platform-blocks/ui';

const themeModeConfig: ThemeModeConfig = {
  initialMode: 'auto', // 'light' | 'dark' | 'auto'
  persistence: {
    // Custom storage
    get: () => localStorage.getItem('my-app-theme') as any,
    set: (mode) => localStorage.setItem('my-app-theme', mode)
  },
  domConfig: {
    selector: 'html',
    lightClass: 'light-mode',
    darkClass: 'dark-mode',
    attribute: 'data-theme'
  }
};

function App() {
  return (
    <PlatformBlocksProvider 
      theme={customTheme}
      themeModeConfig={themeModeConfig}
    >
      {/* Your app */}
    </PlatformBlocksProvider>
  );
}`}
        </CodeBlock>


        {/* Using Theme in Components */}

        <Text variant="h3" mb="md">🎯 Using Theme in Components</Text>
        <Text variant="p" mb="md" colorVariant="secondary">
          Access theme values in your custom components:
        </Text>
        <CodeBlock
          language="tsx"
          title="Theme Hook Usage"
          spoiler={false}
        >
          {`import { useTheme } from '@platform-blocks/ui';

function CustomComponent() {
  const theme = useTheme();
  
  return (
    <View style={{
      backgroundColor: theme.colors.primary[5],
      color: theme.text.onPrimary,
      padding: theme.spacing.md,
      borderRadius: theme.radii.md
    }}>
      <Text>Themed component</Text>
    </View>
  );
}`}
        </CodeBlock>

        <Divider my="md" />

        <Text variant="h4" mb="sm">Theme Mode Hook</Text>
        <Text variant="p" mb="sm" colorVariant="secondary">
          Control theme mode programmatically:
        </Text>
        <CodeBlock language="tsx" spoiler={false}>
          {`import { useThemeMode } from '@platform-blocks/ui';

function ThemeToggle() {
  const { mode, setMode, cycleMode, actualColorScheme } = useThemeMode();
  
  return (
    <Button onPress={cycleMode}>
      Current: {mode} (Resolved: {actualColorScheme})
    </Button>
  );
}`}
        </CodeBlock>


        {/* CSS Variables */}
        <Text variant="h3" mb="md">🎨 CSS Variables (Web)</Text>
        <Text variant="p" mb="md" colorVariant="secondary">
          Enable CSS variables for dynamic theming on web platforms:
        </Text>
        <CodeBlock
          language="tsx"
          title="CSS Variables Setup"
          spoiler={false}
        >
          {`<PlatformBlocksProvider 
  theme={customTheme}
  withCSSVariables
  cssVariablesSelector=":root"
>
  {/* Theme values available as CSS variables */}
</PlatformBlocksProvider>`}
        </CodeBlock>

        <Text variant="p" mb="sm" colorVariant="secondary" mt="md">
          Then use the variables in your CSS:
        </Text>
        <CodeBlock language="css" spoiler={false}>
          {`.my-component {
  background-color: var(--pb-colors-primary-5);
  color: var(--pb-text-primary);
  padding: var(--pb-spacing-md);
  border-radius: var(--pb-radii-md);
  
  /* Smooth theme transitions */
  transition: background-color 0.2s ease, color 0.2s ease;
}`}
        </CodeBlock>

        {/* Best Practices */}
        <Text variant="h3" mb="md">✅ Best Practices</Text>
        <View style={{ gap: 12 }}>
          <View>
            <Text variant="h4" mb="xs">1. Use createTheme for Type Safety</Text>
            <Text variant="p" colorVariant="secondary">
              Always wrap your theme overrides with createTheme() for full TypeScript support.
            </Text>
          </View>

          <View>
            <Text variant="h4" mb="xs">2. Follow the 10-Step Color Scale</Text>
            <Text variant="p" colorVariant="secondary">
              Maintain consistency by using the 10-step color scale pattern (0-9) for all color palettes.
            </Text>
          </View>

          <View>
            <Text variant="h4" mb="xs">3. Define Semantic Colors</Text>
            <Text variant="p" colorVariant="secondary">
              Use semantic colors (text.primary, backgrounds.surface) rather than raw hex values for better adaptability.
            </Text>
          </View>

          <View>
            <Text variant="h4" mb="xs">4. Test Both Light and Dark</Text>
            <Text variant="p" colorVariant="secondary">
              Always test your custom themes in both light and dark modes to ensure good contrast and readability.
            </Text>
          </View>

          <View>
            <Text variant="h4" mb="xs">5. Use Component Tokens</Text>
            <Text variant="p" colorVariant="secondary">
              Leverage component-specific tokens to customize default behavior and create custom variants.
            </Text>
          </View>
        </View>

        {/* Current Theme Preview */}

        <Text variant="h3" mb="md">🔍 Current Theme Preview</Text>
        <Text variant="p" mb="md" colorVariant="secondary">
          Here's a preview of the currently active theme:
        </Text>

        <View style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 8,
          marginBottom: 16
        }}>
          <View style={{
            backgroundColor: theme.colors.primary[5],
            padding: 8,
            borderRadius: 4,
            minWidth: 60,
            alignItems: 'center'
          }}>
            <Text style={{ color: theme.text.onPrimary || '#fff', fontSize: 12 }}>
              Primary
            </Text>
          </View>
          <View style={{
            backgroundColor: theme.colors.secondary[5],
            padding: 8,
            borderRadius: 4,
            minWidth: 60,
            alignItems: 'center'
          }}>
            <Text style={{ color: theme.text.onPrimary || '#fff', fontSize: 12 }}>
              Secondary
            </Text>
          </View>
          <View style={{
            backgroundColor: theme.colors.success[5],
            padding: 8,
            borderRadius: 4,
            minWidth: 60,
            alignItems: 'center'
          }}>
            <Text style={{ color: theme.text.onPrimary || '#fff', fontSize: 12 }}>
              Success
            </Text>
          </View>
          <View style={{
            backgroundColor: theme.colors.warning[5],
            padding: 8,
            borderRadius: 4,
            minWidth: 60,
            alignItems: 'center'
          }}>
            <Text style={{ color: theme.text.onPrimary || '#fff', fontSize: 12 }}>
              Warning
            </Text>
          </View>
          <View style={{
            backgroundColor: theme.colors.error[5],
            padding: 8,
            borderRadius: 4,
            minWidth: 60,
            alignItems: 'center'
          }}>
            <Text style={{ color: theme.text.onPrimary || '#fff', fontSize: 12 }}>
              Error
            </Text>
          </View>
        </View>

        <CodeBlock language="json" title="Current Theme Values" spoiler={true}>
          {JSON.stringify({
            primaryColor: theme.primaryColor,
            colorScheme: theme.colorScheme,
            fontFamily: theme.fontFamily,
            text: theme.text,
            backgrounds: theme.backgrounds
          }, null, 2)}
        </CodeBlock>


        {/* Footer */}
        <Column mt="xl" pt="lg" style={{ borderTopWidth: 1, borderTopColor: theme.backgrounds.border }}>
          <Text variant="p" colorVariant="secondary" style={{ textAlign: 'center' }}>
            Need help with theming? Check out our examples or reach out to the team.
          </Text>
        </Column>
      </View>
    </PageLayout>
  );
};

export default ThemingPage;