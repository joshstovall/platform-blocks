import { View, useWindowDimensions } from 'react-native';
import { Card, Flex, Title, Text, CodeBlock, GradientText, KeyCap, ShimmerText } from 'platform-blocks/components';

const sampleParagraph = 'Lorem ipsum dolor sit amet, consectetur adipiscing elia.';

export function TypographyShowcase() {
  const { width } = useWindowDimensions();
  const isSmall = width < 768;
  return (
    <View>
      <Flex direction={isSmall ? 'column' : 'row'} gap={24} wrap={isSmall ? undefined : 'wrap'}>
        <Card padding={20}>
          <Flex direction="column" gap={8}>
            <Text weight="100">Weight 100 - Thin</Text>
            <Text weight="200">Weight 200 - Extra Light</Text>
            <Text weight="300">Weight 300 - Light</Text>
            <Text weight="400">Weight 400 - Normal (default)</Text>
            <Text weight="500">Weight 500 - Medium</Text>
            <Text weight="600">Weight 600 - Semibold</Text>
            <Text weight="700">Weight 700 - Bold</Text>
            <Text weight="800">Weight 800 - Extra Bold</Text>
            <Text weight="900">Weight 900 - Black</Text>
          </Flex>
        </Card>

        <Card padding={20}>
          <Flex direction="column" gap={16}>
            <Text weight="bold" size="lg" colorVariant="primary">Color Variants</Text>
            <Flex direction="column" gap={8}>
              <Text colorVariant="primary">{sampleParagraph}</Text>
              <Text colorVariant="secondary">{sampleParagraph}</Text>
              <Text colorVariant="muted">{sampleParagraph}</Text>
              <Text colorVariant="success">{sampleParagraph}</Text>
              <Text colorVariant="warning">{sampleParagraph}</Text>
              <Text colorVariant="error">{sampleParagraph}</Text>
              <Text colorVariant="info">{sampleParagraph}</Text>
            </Flex>
          </Flex>
        </Card>


        <Card padding={20}>
          <Flex direction="column" gap={16}>
            <Flex direction="column" gap={16}>
              <Text weight="bold" size="lg" colorVariant="primary">CodeBlock</Text>
              <CodeBlock language="tsx">
                {`<Tabs
  items=[
    { key: 'tab1', label: 'Tab 1', content: <Text>Content 1</Text> },
    { key: 'tab2', label: 'Tab 2', content: <Text>Content 2</Text> }
  ]
  variant="line"
/>`}
              </CodeBlock>
            </Flex>
          </Flex>
        </Card>

        <Card padding={20}>
          <Flex direction="column" gap={16}>
            <Text weight="bold" size="lg" colorVariant="primary">Enhanced Typography</Text>
            <Flex direction="column" gap={12}>
              <GradientText colors={['#22d3ee', '#6366f1']} weight="bold" size="xl">
                GradientText brings motion to headlines
              </GradientText>
              <ShimmerText weight="600" shimmerColor="#34d399">
                ShimmerText highlights loading states gracefully
              </ShimmerText>
              <Flex direction="row" align="center" gap={8} wrap="wrap">
                <Text weight="600">Keyboard shortcut:</Text>
                <KeyCap>⌘</KeyCap>
                <KeyCap>Shift</KeyCap>
                <KeyCap>P</KeyCap>
              </Flex>
            </Flex>
          </Flex>
        </Card>
      </Flex>
    </View>
  );
}

