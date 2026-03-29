import { AutoComplete, Block, Column, Row, Text, useTheme } from '@platform-blocks/ui'

const sampleData = [
  { label: 'Apple', value: 'apple', description: 'A red or green fruit' },
  { label: 'Banana', value: 'banana', description: 'A yellow curved fruit' },
  { label: 'Cherry', value: 'cherry', description: 'A small red fruit' },
  { label: 'Date', value: 'date', description: 'A sweet brown fruit' },
  { label: 'Elderberry', value: 'elderberry', description: 'A dark purple berry' },
  { label: 'Fig', value: 'fig', description: 'A purple or green fruit' },
  { label: 'Grape', value: 'grape', description: 'Clusters of small berries' },
  { label: 'Honeydew', value: 'honeydew', description: 'A sweet green melon' },
]

export default function Demo() {
  const theme = useTheme()
  const highlightPalette = theme.colors.highlight?.slice(0, 6) ?? []

  return (
    <Column gap="md" fullWidth>
      <Text weight="semibold">Highlight colours</Text>
      <Text size="sm" colorVariant="secondary">
        Match highlighting uses theme tokens. Type a vowel to see matches emphasised below.
      </Text>
      <AutoComplete
        label="Search fruits"
        placeholder="Type to search fruits..."
        data={sampleData}
        highlightMatches
        minSearchLength={0}
        fullWidth
      />

      <Column gap="xs">
        <Text size="sm" weight="semibold">
          Palette preview
        </Text>
        <Row gap="sm" wrap="wrap">
          {highlightPalette.map((color, index) => (
            <Column key={color} align="center" gap="xs">
              <Block
                w={32}
                h={32}
                radius="md"
                style={{
                  backgroundColor: color,
                  borderWidth: 1,
                  borderColor: theme.backgrounds?.border ?? 'transparent',
                }}
              />
              <Text size="xs" colorVariant="secondary">
                {index}
              </Text>
            </Column>
          ))}
        </Row>
      </Column>

      <Column gap="xs">
        <Text size="sm" weight="semibold">
          Semantic tokens
        </Text>
        <Text size="xs" colorVariant="secondary">
          Text selection and highlight backgrounds inherit from theme states for consistent contrast.
        </Text>
      </Column>
    </Column>
  )
}