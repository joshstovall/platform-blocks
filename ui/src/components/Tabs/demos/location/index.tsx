import { Tabs, Text, Flex } from '@platform-blocks/ui';

export default function LocationTabsDemo() {
  return (
    <Flex direction="column" gap={32}>
      {/* Horizontal Tabs - Start vs End */}
      <Flex direction="column" gap={16}>
        <Text variant="h5" weight="semibold">Horizontal Tabs Location</Text>
        
        <Flex direction="column" gap={12}>
          <Text variant="body" weight="medium">Start Position (Top - Default)</Text>
          <Tabs
            variant="line"
            location="start"
            items={[
              {
                key: 'tab1',
                label: 'Home',
                content: <Text>Content with tabs at the top (start position)</Text>
              },
              {
                key: 'tab2',
                label: 'Settings',
                content: <Text>Settings content with tabs at the top</Text>
              },
              {
                key: 'tab3',
                label: 'Profile',
                content: <Text>Profile content with tabs at the top</Text>
              }
            ]}
          />
        </Flex>

        <Flex direction="column" gap={12}>
          <Text variant="body" weight="medium">End Position (Bottom)</Text>
          <Tabs
            variant="line"
            location="end"
            items={[
              {
                key: 'tab1',
                label: 'Home',
                content: <Text>Content with tabs at the bottom (end position)</Text>
              },
              {
                key: 'tab2',
                label: 'Settings',
                content: <Text>Settings content with tabs at the bottom</Text>
              },
              {
                key: 'tab3',
                label: 'Profile',
                content: <Text>Profile content with tabs at the bottom</Text>
              }
            ]}
          />
        </Flex>
      </Flex>
    </Flex>
  );
}
