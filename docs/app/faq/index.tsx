import { Linking } from 'react-native';
import { Text, Accordion, P, Flex, Space } from '@platform-blocks/ui';
import { Icon } from '@platform-blocks/ui';
import { PageWrapper } from 'components/PageWrapper';
import { useBrowserTitle, formatPageTitle } from 'hooks/useBrowserTitle';
import { DocsPageHeader } from '../../components/DocsPageHeader';
import { DISCORD_INVITE, GITHUB_REPO } from 'config/urls';

const FAQ_DATA = [{
  id: 1,
  key: 'what-is',
  icon: <Icon name="star" color="orange" />,
  title: 'What is Platform Blocks?',
  content: <Flex><Text>Platform Blocks is a React Native UI component library designed for building cross-platform applications with a consistent look and feel. It provides a set of customizable, accessible, and themeable components that work seamlessly on iOS, Android, and web platforms.</Text></Flex>
}, {
  id: 1,
  key: 'expo-compatibility',
  title: 'Is Platform Blocks compatible with Expo?',
  content: <P>Yes! Platform Blocks is fully compatible with <Text variant="body" colorVariant="link" onPress={() => Linking.openURL('https://expo.dev')}>Expo</Text> and works out of the box. All components are designed to work in the Expo environment without requiring any native code modifications.</P>
}, {
  id: 2,
  key: 'does-support',
  title: 'Does Platform Blocks support React Native Web?',
  content: <Flex><Text>Absolutely! Platform Blocks is built with React Native Web compatibility in mind. All components work seamlessly across iOS, Android, and web platforms.</Text></Flex>
}, {
  id: 3,
  key: 'can-customize',
  title: 'Can I customize the theme?',
  content: <Flex><Text>Yes, Platform Blocks has a comprehensive theming system. You can customize colors, typography, spacing, and component variants through the theme configuration. See our Theming guide for detailed instructions.</Text></Flex>
}, {
  id: 7,
  key: 'can-use-custom-fonts',
  title: 'Can I use custom fonts?',
  content: <Flex><Text>Yes, you can configure <Text fontFamily='cursive'>custom fonts</Text> through the theme system. Platform Blocks's typography system allows you to specify custom font families for different text variants.</Text></Flex>
}, {
  id: 8,
  key: 'how-report-bugs',
  title: 'How do I report bugs or request features?',
  content: <Flex><Text>You can report bugs and request features on our GitHub repository. We welcome community contributions and feedback to make Platform Blocks better for everyone.</Text></Flex>
}];

export default function FAQScreen() {
  // Update browser title
  useBrowserTitle(formatPageTitle('FAQ'));

  return (
    <PageWrapper>
      <DocsPageHeader
        subtitle="Common questions about Platform Blocks library"
      >
        Frequently Asked Questions
      </DocsPageHeader>
      <Space h={16} />
      <Accordion
        type="multiple"
        variant="separated"
        items={FAQ_DATA}
        defaultExpanded={['what-is']}
      />
    </PageWrapper>
  );
}
