import {
  Column,
  Row,
  Text,
  AutoComplete,
  Card,
  useTheme,
  Block,
} from '@platform-blocks/ui';

export default function HighlightColorsDemo() {
  const theme = useTheme();
  
  const sampleData = [
    { label: 'Apple', value: 'apple', description: 'A red or green fruit' },
    { label: 'Banana', value: 'banana', description: 'A yellow curved fruit' },
    { label: 'Cherry', value: 'cherry', description: 'A small red fruit' },
    { label: 'Date', value: 'date', description: 'A sweet brown fruit' },
    { label: 'Elderberry', value: 'elderberry', description: 'A dark purple berry' },
    { label: 'Fig', value: 'fig', description: 'A purple or green fruit' },
    { label: 'Grape', value: 'grape', description: 'Small round fruits in bunches' },
    { label: 'Honeydew', value: 'honeydew', description: 'A sweet green melon' }
  ];

  const highlightColors = theme.colors.highlight || [];
  const highlightStates = theme.states;

  return (
    <Column gap="2xl" p="xl" maxWidth={800}>
      <Text size="lg" weight="bold">Highlight Theme Colors Demo</Text>
      
      {/* AutoComplete with Highlighting */}
      <Card p="xl">
        <Column gap="lg">
          <Text size="md" weight="semibold">AutoComplete with Text Highlighting</Text>
          <Text size="sm" colorVariant="muted">
            Type "a" or "e" to see matching text highlighted in the suggestions
          </Text>
          <AutoComplete
            label="Search fruits"
            placeholder="Type to search fruits..."
            data={sampleData}
            highlightMatches={true}
            onSelect={(item) => console.log('Selected:', item)}
            w={300}
          />
        </Column>
      </Card>

      {/* Text Selection Demo */}
      <Card p="xl">
        <Column gap="lg">
          <Text size="md" weight="semibold">Text Selection Highlighting</Text>
          <Text size="sm" colorVariant="muted">
            Try selecting text below to see the custom highlight color
          </Text>
          <Text size="md" lineHeight={22}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
            quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            Try selecting this text to see the custom highlight color in action!
          </Text>
        </Column>
      </Card>

      {/* Color Palette Demo */}
      <Card p="xl">
        <Column gap="lg">
          <Text size="md" weight="semibold">Highlight Color Palette</Text>
          <Row gap="sm" wrap="wrap">
            {highlightColors.map((color, index) => (
              <Column key={index} align="center" gap="xs">
                <Block
                  w={40}
                  h={40}
                  radius="md"
                  bg={color}
                  borderWidth={1}
                  borderColor={theme.backgrounds.border}
                />
                <Text size="xs" colorVariant="muted">{index}</Text>
              </Column>
            ))}
          </Row>
        </Column>
      </Card>

      {/* Semantic Highlight States */}
      <Card p="xl">
        <Column gap="lg">
          <Text size="md" weight="semibold">Semantic Highlight States</Text>
          <Column gap="md">
            {highlightStates?.textSelection && (
              <Row align="center" gap="md">
                <Block
                  w={24}
                  h={24}
                  radius="sm"
                  bg={highlightStates.textSelection}
                  borderWidth={1}
                  borderColor={theme.backgrounds.border}
                />
                <Column gap="xs">
                  <Text size="sm" weight="medium">Text Selection</Text>
                  <Text size="xs" colorVariant="muted" fontFamily="monospace">
                    {highlightStates.textSelection}
                  </Text>
                </Column>
              </Row>
            )}
            
            {highlightStates?.highlightBackground && (
              <Row align="center" gap="md">
                <Block
                  w={24}
                  h={24}
                  radius="sm"
                  bg={highlightStates.highlightBackground}
                  borderWidth={1}
                  borderColor={theme.backgrounds.border}
                />
                <Column gap="xs">
                  <Text size="sm" weight="medium">Highlight Background</Text>
                  <Text size="xs" colorVariant="muted" fontFamily="monospace">
                    {highlightStates.highlightBackground}
                  </Text>
                </Column>
              </Row>
            )}
            
            {highlightStates?.highlightText && (
              <Row align="center" gap="md">
                <Block
                  w={24}
                  h={24}
                  radius="sm"
                  bg={highlightStates.highlightText}
                  borderWidth={1}
                  borderColor={theme.backgrounds.border}
                />
                <Column gap="xs">
                  <Text size="sm" weight="medium">Highlight Text</Text>
                  <Text size="xs" colorVariant="muted" fontFamily="monospace">
                    {highlightStates.highlightText}
                  </Text>
                </Column>
              </Row>
            )}
          </Column>
        </Column>
      </Card>

      {/* CSS Variables Demo */}
      <Card p="xl">
        <Column gap="lg">
          <Text size="md" weight="semibold">CSS Variables (Web Only)</Text>
          <Text size="sm" colorVariant="muted">
            These CSS variables are available for use in custom styles:
          </Text>
          <Column gap="sm">
            <Text size="xs" fontFamily="monospace">--platform-blocks-text-selection</Text>
            <Text size="xs" fontFamily="monospace">--platform-blocks-highlight-text</Text>
            <Text size="xs" fontFamily="monospace">--platform-blocks-highlight-background</Text>
            <Text size="xs" fontFamily="monospace">--platform-blocks-color-highlight-0 through --platform-blocks-color-highlight-9</Text>
          </Column>
        </Column>
      </Card>
    </Column>
  );
}