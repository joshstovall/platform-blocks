import React from 'react';
import { View, ScrollView } from 'react-native';
import { TableOfContents } from '../../TableOfContents';
import { Text } from '../../../Text';
import { Title } from '../../../Title';
import { TitleRegistryProvider } from '../../../../contexts';

export default function MobileFriendlyDemo() {
  // Sample content with headings for demonstration
  const sampleContent = [
    { id: 'introduction', value: 'Introduction', depth: 1 },
    { id: 'getting-started', value: 'Getting Started', depth: 1 },
    { id: 'installation', value: 'Installation', depth: 2 },
    { id: 'basic-usage', value: 'Basic Usage', depth: 2 },
    { id: 'advanced-features', value: 'Advanced Features', depth: 1 },
    { id: 'customization', value: 'Customization', depth: 2 },
    { id: 'theming', value: 'Theming', depth: 3 },
    { id: 'animations', value: 'Animations', depth: 3 },
    { id: 'mobile-optimization', value: 'Mobile Optimization', depth: 2 },
    { id: 'api-reference', value: 'API Reference', depth: 1 },
    { id: 'troubleshooting', value: 'Troubleshooting', depth: 1 },
  ];

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text variant="h2" style={{ marginBottom: 16 }}>
        Mobile-Friendly TableOfContents
      </Text>
      
      <ScrollView style={{ flex: 1 }}>
        <View style={{ marginBottom: 32 }}>
          <Text variant="h3" style={{ marginBottom: 12 }}>
            Floating Mode (Auto on Mobile)
          </Text>
          <TableOfContents
            variant="filled"
            color="#2563eb"
            radius="md"
            initialData={sampleContent}
            mobileMode="auto"
            showProgressBar={true}
            touchOptimized={true}
            floatingPosition="bottom-right"
            floatingButtonLabel="Contents"
          />
        </View>

        <View style={{ marginBottom: 32 }}>
          <Text variant="h3" style={{ marginBottom: 12 }}>
            Collapsible Mode
          </Text>
          <TableOfContents
            variant="outline"
            color="#059669"
            radius="lg"
            initialData={sampleContent}
            mobileMode="collapsible"
            collapsible={true}
            defaultCollapsed={false}
            showProgressBar={true}
            touchOptimized={true}
            p={16}
          />
        </View>

        <View style={{ marginBottom: 32 }}>
          <Text variant="h3" style={{ marginBottom: 12 }}>
            Modal Mode
          </Text>
          <TableOfContents
            variant="ghost"
            color="#dc2626"
            radius="xl"
            initialData={sampleContent}
            mobileMode="modal"
            showFloatingButton={true}
            floatingPosition="top-right"
            floatingButtonLabel="Table of Contents"
            touchOptimized={true}
            swipeToClose={true}
          />
        </View>

        {/* Sample content sections */}
        <View style={{ marginTop: 48 }}>
          <Text variant="h2" style={{ marginBottom: 16 }}>
            Introduction
          </Text>
          <Text style={{ marginBottom: 24, lineHeight: 24 }}>
            This is the introduction section. The TableOfContents component now includes 
            mobile-friendly features like floating buttons, collapsible sections, and 
            touch-optimized interactions.
          </Text>

          <Text variant="h2" style={{ marginBottom: 16 }}>
            Getting Started
          </Text>
          
          <Text variant="h3" style={{ marginBottom: 12 }}>
            Installation
          </Text>
          <Text style={{ marginBottom: 16, lineHeight: 24 }}>
            Install the component and start using it in your mobile-friendly applications.
          </Text>

          <Text variant="h3" style={{ marginBottom: 12 }}>
            Basic Usage
          </Text>
          <Text style={{ marginBottom: 24, lineHeight: 24 }}>
            The component automatically detects mobile devices and switches to 
            appropriate mobile modes for better user experience.
          </Text>

          <Text variant="h2" style={{ marginBottom: 16 }}>
            Advanced Features
          </Text>
          
          <Text variant="h3" style={{ marginBottom: 12 }}>
            Customization
          </Text>
          
          <Text variant="h4" style={{ marginBottom: 8 }}>
            Theming
          </Text>
          <Text style={{ marginBottom: 16, lineHeight: 24 }}>
            Customize colors, variants, and styling to match your app's design system.
          </Text>

          <Text variant="h4" style={{ marginBottom: 8 }}>
            Animations
          </Text>
          <Text style={{ marginBottom: 16, lineHeight: 24 }}>
            Smooth animations enhance the mobile experience with spring-based transitions.
          </Text>

          <Text variant="h3" style={{ marginBottom: 12 }}>
            Mobile Optimization
          </Text>
          <Text style={{ marginBottom: 24, lineHeight: 24 }}>
            Features include larger touch targets, floating buttons, modal views, 
            and progress indicators optimized for mobile interaction.
          </Text>

          <Text variant="h2" style={{ marginBottom: 16 }}>
            API Reference
          </Text>
          <Text style={{ marginBottom: 24, lineHeight: 24 }}>
            Complete API documentation with all mobile-specific props and configuration options.
          </Text>

          <Text variant="h2" style={{ marginBottom: 16 }}>
            Troubleshooting
          </Text>
          <Text style={{ marginBottom: 48, lineHeight: 24 }}>
            Common issues and solutions for mobile implementation.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}