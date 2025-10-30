import { Tabs, Text, Column } from '@platform-blocks/ui';

export default function VariantsTabsDemo() {
  return (
    <Column gap={24}>
      <Column gap={8}>
        <Text variant="subtitle">Line Variant</Text>
        <Tabs
          variant="line"
          items={[
            { key: 'tab1', label: 'Documents', content: <Text>Line variant with clean underline style</Text> },
            { key: 'tab2', label: 'Images', content: <Text>Simple and minimal design</Text> },
            { key: 'tab3', label: 'Videos', content: <Text>Perfect for content navigation</Text> }
          ]}
        />
      </Column>
      
      <Column gap={8}>
        <Text variant="subtitle">Pill Variant</Text>
        <Tabs
          variant="chip"
          items={[
            { key: 'tab1', label: 'Overview', content: <Text>Pill variant with rounded background</Text> },
            { key: 'tab2', label: 'Details', content: <Text>Modern and sleek appearance</Text> },
            { key: 'tab3', label: 'Settings', content: <Text>Great for settings interfaces</Text> }
          ]}
        />
      </Column>

      <Column gap={8}>
        <Text variant="subtitle">Folder Variant</Text>
        <Tabs
          variant="folder"
          items={[
            { key: 'tab1', label: 'Overview', content: <Text>Folder variant with tab-like appearance</Text> },
            { key: 'tab2', label: 'Details', content: <Text>Classic folder tab styling</Text> },
            { key: 'tab3', label: 'Settings', content: <Text>Great for organizing content</Text> }
          ]}
        />
      </Column>
    </Column>
  );
}
