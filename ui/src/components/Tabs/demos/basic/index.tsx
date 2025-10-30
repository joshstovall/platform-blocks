import { Tabs, Text } from '@platform-blocks/ui';

export default function BasicTabsDemo() {
  return (
    <Tabs
      items={[{
        key: 'tab1',
        label: 'Tab 1',
        content: <Text>Content for Tab 1</Text>
      }, {
        key: 'tab2',
        label: 'Tab 2',
        content: <Text>Content for Tab 2</Text>
      }, {
        key: 'tab3',
        label: 'Tab 3',
        content: <Text>Content for Tab 3</Text>
      }]}
    />
  );
}
