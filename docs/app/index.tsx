import { View, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Button,
  Tabs,
  Title,
  Block,
  Space,
} from '@platform-blocks/ui';

import { useBrowserTitle, formatPageTitle } from '../hooks/useBrowserTitle';
import {
  InputPlayground,
  MediaPlayground,
  TypographyPlayground,
  ChartPlayground,
  DataPlayground,
  DatesPlayground,
  TogglePlayground,
  ButtonPlayground,
  SwitchPlayground,
  CheckboxPlayground,
  SkeletonPlayground,
  LayoutPlayground,
} from '../components/playground';
import { SliderPlayground } from 'components/playground/SliderPlayground';
import { PageLayout } from 'components';
import { EverythingPlayground } from 'components/playground/EverythingPlayground';


export default function HomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isSmall = width < 768; // TODO: need a better way to do this type of thing ... useBreakpoint hook?

  // Set browser title
  useBrowserTitle(formatPageTitle('Home'));

  return (
    <PageLayout >
      <Block style={{ width: '100%', marginBottom: 12 }} wrap>
        <Title variant='h1' size={48} weight='bold' afterline
          underlineStroke={4}
          // action={<CodeBlock variant='hacker'>npm install @platform-blocks/ui</CodeBlock>}
          subtitle="A modern React Native component library with theme support and consistent design tokens."
        >PlatformBlocks</Title>
      </Block>
      <Block direction='row' gap="md" wrap>
        {/* <Button title="Get Started" variant="gradient" onPress={() => router.push('/getting-started')} /> */}
        <Button title="100+ Components" variant="gradient" onPress={() => router.push('/components')} />
        <Button title="Get Inspired" variant="secondary" onPress={() => router.push('/examples')} />
      </Block>

      <Space h="lg" />

      <Tabs
        variant='chip'
        color='tertiary'
        items={[
          {
            key: 'all',
            label: 'All',
            content: (
              <View>
                <EverythingPlayground />
              </View>
            )
          }, {
            key: 'actions',
            label: 'Actions',
            content: (
              <View>
                <TogglePlayground />
                <ButtonPlayground />
                <SwitchPlayground />
                <CheckboxPlayground />
                <SkeletonPlayground />
                <SliderPlayground />
              </View>
            )
          },
          {
            key: 'layout',
            label: 'Layout',
            content: <LayoutPlayground />
          },
          {
            key: 'inputs',
            label: 'Inputs',
            content: <InputPlayground />
          }, {
            key: 'typography',
            label: 'Typography',
            content: <TypographyPlayground />
          },
          {
            key: 'media',
            label: 'Media',
            content: <MediaPlayground />
          },
          {
            key: 'data',
            label: 'Data',
            content: <DataPlayground />,
          },
          {
            key: 'dates',
            label: 'Dates',
            content: <DatesPlayground />,
          },
          {
            key: 'charts',
            label: 'Charts',
            content: <ChartPlayground />
          }
        ]}
        scrollable={isSmall}
      />
    </PageLayout>
  );
}
