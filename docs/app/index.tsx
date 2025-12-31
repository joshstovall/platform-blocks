import { View, useWindowDimensions, Platform, Image } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Button,
  Tabs,
  Title,
  Block,
  Space,
  Text,
  Card,
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

      {Platform.OS !== 'web' ? null : (
        <Card style={{ marginTop: 24, padding: 16, alignItems: 'center', maxWidth: 320 }}>
          <Text size="lg" weight="semibold" style={{ marginBottom: 8 }}>Try it on Expo Go</Text>
          <Text size="sm" colorVariant="secondary" style={{ marginBottom: 12, textAlign: 'center' }}>
            Scan this QR code with Expo Go to experience the library on your device
          </Text>
          <Image
            source={{ uri: 'https://qr.expo.dev/eas-update?slug=exp&projectId=7dfc3864-2c55-4c5f-9909-2cc188271f59&groupId=9799817e-06dd-43bd-a67f-47a1fb44b23d&host=u.expo.dev' }}
            style={{ width: 200, height: 200, borderRadius: 8 }}
            resizeMode="contain"
          />
        </Card>
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
