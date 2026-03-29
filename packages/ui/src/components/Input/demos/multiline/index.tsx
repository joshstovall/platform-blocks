import { useState } from 'react';
import { Column, Input, Text } from '@platform-blocks/ui';

export default function Demo() {
  const [dynamicText, setDynamicText] = useState('');
  const [fixedText, setFixedText] = useState('');
  const [limitedText, setLimitedText] = useState('');

  return (
    <Column gap="lg">
      <Column gap="xs">
        <Text size="sm" weight="semibold">
          Dynamic multiline (auto-expanding)
        </Text>
        <Input
          label="Dynamic Input"
          value={dynamicText}
          onChangeText={setDynamicText}
          placeholder="Start typing... Press Enter to add new lines"
          multiline
          minLines={1}
          maxLines={5}
          helperText={`Lines: ${dynamicText.split('\n').length} • Auto-expands up to 5 lines`}
        />
      </Column>

      <Column gap="xs">
        <Text size="sm" weight="semibold">
          Fixed multiline (3 lines)
        </Text>
        <Input
          label="Fixed Size Input"
          value={fixedText}
          onChangeText={setFixedText}
          placeholder="Fixed at 3 lines regardless of content"
          multiline
          numberOfLines={3}
          helperText="Always shows 3 lines (numberOfLines=3)"
        />
      </Column>

      <Column gap="xs">
        <Text size="sm" weight="semibold">
          Limited auto-expanding (1-3 lines)
        </Text>
        <Input
          label="Limited Dynamic Input"
          value={limitedText}
          onChangeText={setLimitedText}
          placeholder="Expands from 1 to 3 lines max"
          multiline
          minLines={1}
          maxLines={3}
          helperText={`Lines: ${limitedText.split('\n').length} • Max 3 lines, then scrolls`}
        />
      </Column>

      <Column gap="xs">
        <Text size="sm" weight="semibold">
          Demo content
        </Text>
        <Text size="sm" colorVariant="secondary">
          Try typing multiline content like:{'\n'}• URLs{'\n'}• Addresses{'\n'}• Code snippets{'\n'}• Long descriptions
        </Text>
      </Column>
    </Column>
  );
}