import { View, ScrollView } from 'react-native';
import { TableOfContents } from '../../TableOfContents';
import { Text } from '../../../Text';
import { Title } from '../../../Title';
import { TitleRegistryProvider } from '../../../../hooks/useTitleRegistration/contexts';

export default function MobileFriendlyTableOfContentsDemo() {
  return (
    <TitleRegistryProvider>
      <View style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 16 }}>
          {/* TableOfContents - will automatically detect Title components below */}
          <TableOfContents
            mobileMode="auto"
            touchOptimized={true}
            showProgressBar={true}
            floatingButtonLabel="Contents"
            floatingPosition="bottom-right"
            variant="filled"
            color="#2563eb"
            radius="md"
          />

          {/* Sample content sections using Title components */}
          <View style={{ marginTop: 48 }}>
            <Title order={1} underline>
              Introduction
            </Title>
            <Text style={{ marginBottom: 24, lineHeight: 24 }}>
              This is the introduction section. The TableOfContents component now includes 
              mobile-friendly features like floating buttons, collapsible sections, and 
              touch-optimized interactions. It automatically detects Title components 
              in addition to HTML headings.
            </Text>

            <Title order={1} underline>
              Getting Started
            </Title>
            
            <Title order={2} prefix prefixVariant="dot">
              Installation
            </Title>
            <Text style={{ marginBottom: 16, lineHeight: 24 }}>
              Install the component and start using it in your mobile-friendly applications.
              The TableOfContents will automatically detect these Title components.
            </Text>

            <Title order={2} prefix prefixVariant="dot">
              Basic Usage
            </Title>
            <Text style={{ marginBottom: 24, lineHeight: 24 }}>
              The component automatically detects mobile devices and switches to 
              appropriate mobile modes for better user experience.
            </Text>

            <Title order={1} underline>
              Advanced Features
            </Title>
            
            <Title order={2} prefix prefixVariant="bar">
              Customization
            </Title>
            
            <Title order={3}>
              Theming
            </Title>
            <Text style={{ marginBottom: 16, lineHeight: 24 }}>
              Customize colors, variants, and styling to match your app's design system.
            </Text>

            <Title order={3}>
              Animations
            </Title>
            <Text style={{ marginBottom: 16, lineHeight: 24 }}>
              Smooth animations enhance the mobile experience with spring-based transitions.
            </Text>

            <Title order={2} prefix prefixVariant="bar">
              Mobile Optimization
            </Title>
            <Text style={{ marginBottom: 24, lineHeight: 24 }}>
              Features include larger touch targets, floating buttons, modal views, 
              and progress indicators optimized for mobile interaction.
            </Text>

            <Title order={1} underline>
              API Reference
            </Title>
            <Text style={{ marginBottom: 24, lineHeight: 24 }}>
              Complete API documentation with all mobile-specific props and configuration options.
            </Text>

            <Title order={1} underline>
              Troubleshooting
            </Title>
            <Text style={{ marginBottom: 48, lineHeight: 24 }}>
              Common issues and solutions for mobile implementation.
            </Text>
          </View>
        </ScrollView>
      </View>
    </TitleRegistryProvider>
  );
}