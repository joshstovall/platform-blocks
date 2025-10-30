import { Flex, Tabs, Text } from '@platform-blocks/ui';

const demoItems = [
  {
    key: 'tab1',
    label: 'Tab 1',
    content: <Text>Content for Tab 1</Text>,
  },
  {
    key: 'tab2',
    label: 'Tab 2',
    content: <Text>Content for Tab 2</Text>,
  },
  {
    key: 'tab3',
    label: 'Tab 3',
    content: <Text>Content for Tab 3</Text>,
  },
];

export default function OrientationTabsDemo() {
  return (
    <Flex direction="column" gap={24}>
      <Tabs orientation="horizontal" items={demoItems} />
      <Tabs orientation="vertical" items={demoItems} />
    </Flex>
  );
}
