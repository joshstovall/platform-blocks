import React, { useState } from 'react';
import { Flex, Text, EmojiPicker } from '@platform-blocks/ui';

export default function EmojiPickerQuickDemo() {
  const [reaction, setReaction] = useState<string | undefined>('❤️');
  return (
    <Flex direction="column" gap={16} p={12} style={{ maxWidth: 400 }}>
      <Text weight="semibold" size="sm">Quick Reaction Emojis</Text>
      
      {/* Basic without background */}
      <Flex direction="column" gap={8}>
        <Text size="xs" colorVariant="secondary">Without background:</Text>
        <EmojiPicker variant="quick" value={reaction} onSelect={setReaction} />
      </Flex>
      
      {/* With background */}
      <Flex direction="column" gap={8}>
        <Text size="xs" colorVariant="secondary">With background:</Text>
        <EmojiPicker variant="quick" value={reaction} onSelect={setReaction} showBackground />
      </Flex>
      
      {reaction && (
        <Text size="xs">
          Current reaction: {reaction}
        </Text>
      )}
    </Flex>
  );
}
