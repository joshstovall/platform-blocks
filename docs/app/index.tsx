import { View, useWindowDimensions, Platform, Image as RNImage } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Button,
  Tabs,
  Title,
  Block,
  Space,
  Card,
  Text,
  Column,
} from '@platform-blocks/ui';

import { useBrowserTitle, formatPageTitle } from '../hooks/useBrowserTitle';
import {
  InputShowcase,
  MediaShowcase,
  TypographyShowcase,
  ChartShowcase,
  DataShowcase,
  DatesShowcase,
  ToggleShowcase,
  ButtonShowcase,
  SwitchShowcase,
  CheckboxShowcase,
  SkeletonShowcase,
  LayoutShowcase,
} from '../components/showcase';
import { SliderPlayground as SliderShowcase } from 'components/showcase/SliderShowcase';
import { PageLayout } from 'components';
import { EverythingPlayground as EverythingShowcase } from 'components/showcase/EverythingShowcase';

const EXPO_PROJECT_URL = 'https://expo.dev/@joshstovall/platform-blocks-docs';
const QR_CODE_URL = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(EXPO_PROJECT_URL)}`;


export default function HomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isSmall = width < 768; // TODO: need a better way to do this type of thing ... useBreakpoint hook?

  // Set browser title
  useBrowserTitle(formatPageTitle('Home'));

  return (
    <PageLayout >
      <Block style={{ width: '100%', marginBottom: 12 }} wrap>
        <Title variant="h1" size={48} weight="bold" afterline
          underlineStroke={4}
          // action={<CodeBlock variant='hacker'>npm install @platform-blocks/ui</CodeBlock>}
          subtitle="A modern React Native component library with theme support and consistent design tokens."
        >Platform Blocks</Title>
      </Block>
      <Block direction="row" gap="md" wrap>
        {/* <Button title="Get Started" variant="gradient" onPress={() => router.push('/getting-started')} /> */}
        <Button title="100+ Components" variant="gradient" onPress={() => router.push('/components')} />
        <Button title="Get Inspired" variant="secondary" onPress={() => router.push('/examples')} />
      </Block>

      {Platform.OS === 'web' && (
        <>
          <Space h="lg" />
          <Card variant="outline" padding="md" style={{ alignSelf: 'flex-start' }}>
            <Block direction="row" gap="md" align="center">
              <RNImage
                source={{ uri: QR_CODE_URL }}
                style={{ width: 120, height: 120, borderRadius: 8 }}
                accessibilityLabel="Scan to open in Expo Go"
              />
              <Column gap="xs">
                <Text weight="semibold">Try it on your device</Text>
                <Text size="sm" colorVariant="secondary">
                  Scan with Expo Go to preview{'\n'}on iOS or Android
                </Text>
              </Column>
            </Block>
          </Card>
        </>
      )}

      <Space h="lg" />

      <Tabs
        variant="chip"
        color="tertiary"
        items={[
          {
            key: 'overview',
            label: 'Overview',
            content: (
              <View>
                <EverythingShowcase />
              </View>
            )
          }, {
            key: 'actions',
            label: 'Actions',
            content: (
              <View>
                <ToggleShowcase />
                <ButtonShowcase />
                <SwitchShowcase />
                <CheckboxShowcase />
                <SkeletonShowcase />
                <SliderShowcase />
              </View>
            )
          },
          {
            key: 'layout',
            label: 'Layout',
            content: <LayoutShowcase />
          },
          {
            key: 'inputs',
            label: 'Inputs',
            content: <InputShowcase />
          }, {
            key: 'typography',
            label: 'Typography',
            content: <TypographyShowcase />
          },
          {
            key: 'media',
            label: 'Media',
            content: <MediaShowcase />
          },
          {
            key: 'data',
            label: 'Data',
            content: <DataShowcase />,
          },
          {
            key: 'dates',
            label: 'Dates',
            content: <DatesShowcase />,
          },
          {
            key: 'charts',
            label: 'Charts',
            content: <ChartShowcase />
          }
        ]}
        scrollable={isSmall}
      />
    </PageLayout>
  );
}
