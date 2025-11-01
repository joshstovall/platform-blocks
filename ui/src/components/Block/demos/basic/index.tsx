import { Text } from '../../../Text';
import { Block } from '../../Block';

export default function BlockBasicDemo() {
  return (
    <Block direction="column" gap="md" p="lg">
      {/* Basic styling */}
      <Block bg="#89abc1ff" p="md" radius="md">
        <Text>Basic Block with background, padding, and radius</Text>
      </Block>

      {/* Flexbox layout */}
      <Block direction="row" gap="sm" mt="md">
        <Block bg="#cc5454ff" p="sm" radius="sm" grow>
          <Text>Flexible item 1</Text>
        </Block>
        <Block bg="#28ab4fff" p="sm" radius="sm" w={100}>
          <Text>Fixed width</Text>
        </Block>
        <Block bg="#a89137ff" p="sm" radius="sm" grow>
          <Text>Flexible item 2</Text>
        </Block>
      </Block>

      {/* Polymorphic usage */}
      <Block direction="row" gap="sm" mt="md">
        <Block 
          component="button"
          bg="#3b82f6" 
          px="md" 
          py="sm" 
          radius="md"
        >
          <Text color="white">Button Block</Text>
        </Block>
      </Block>
    </Block>
  );
}

export const code = `import { Block, Text } from '@platform-blocks/ui';

export default function BlockBasicDemo() {
  return (
    <Block direction="column" gap="md" p="lg">
      {/* Basic styling */}
      <Block bg="#f0f9ff" p="md" radius="md">
        <Text>Basic Block with background, padding, and radius</Text>
      </Block>

      {/* Flexbox layout */}
      <Block direction="row" gap="sm" mt="md">
        <Block bg="#fef2f2" p="sm" radius="sm" grow>
          <Text>Flexible item 1</Text>
        </Block>
        <Block bg="#f0fdf4" p="sm" radius="sm" w={100}>
          <Text>Fixed width</Text>
        </Block>
        <Block bg="#fffbeb" p="sm" radius="sm" grow>
          <Text>Flexible item 2</Text>
        </Block>
      </Block>

      {/* Polymorphic usage */}
      <Block direction="row" gap="sm" mt="md">
        <Block 
          component="button"
          bg="#3b82f6" 
          px="md" 
          py="sm" 
          radius="md"
        >
          <Text color="white">Button Block</Text>
        </Block>
      </Block>
    </Block>
  );
}`;