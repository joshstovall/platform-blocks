import { Text } from '../../Text';
import { Block } from '../Block';

export function BlockBasicDemo() {
  return (
    <Block direction="column" gap="lg" p="xl">
      <Text variant="h3" mb="md">Block Component Demo</Text>
      
      {/* Basic styling */}
      <Block bg="blue.100" p="md" radius="md" mb="lg">
        <Text>Basic Block with background, padding, and radius</Text>
      </Block>

      {/* Flexbox layout */}
      <Block direction="row" gap="md" mb="lg">
        <Block bg="red.100" p="sm" radius="sm" grow>
          <Text>Flexible item 1</Text>
        </Block>
        <Block bg="green.100" p="sm" radius="sm" w={100}>
          <Text>Fixed width</Text>
        </Block>
        <Block bg="yellow.100" p="sm" radius="sm" grow>
          <Text>Flexible item 2</Text>
        </Block>
      </Block>

      {/* Wrapping layout */}
      <Block direction="row" gap="sm" wrap mb="lg">
        <Block bg="blue.100" px="md" py="sm" radius="sm">
          <Text>Item 1</Text>
        </Block>
        <Block bg="blue.200" px="md" py="sm" radius="sm">
          <Text>Item 2</Text>
        </Block>
        <Block bg="blue.300" px="md" py="sm" radius="sm">
          <Text>Item 3</Text>
        </Block>
        <Block bg="blue.400" px="md" py="sm" radius="sm">
          <Text>Item 4</Text>
        </Block>
        <Block bg="blue.500" px="md" py="sm" radius="sm">
          <Text color="white">Item 5</Text>
        </Block>
      </Block>

      {/* Polymorphic usage */}
      <Block direction="row" gap="sm" mb="lg">
        <Block 
          component="button"
          bg="blue.500" 
          px="md" 
          py="sm" 
          radius="md"
        >
          <Text color="white">Button Block</Text>
        </Block>
        
        <Block 
          component="button"
          bg="green.500" 
          px="md" 
          py="sm" 
          radius="md"
          accessibilityRole="link"
        >
          <Text color="white">Link-style Block</Text>
        </Block>
      </Block>

      {/* Complex layout */}
      <Block bg="white" shadow="lg" radius="lg" p="lg" mb="lg">
        <Block direction="row" justify="space-between" align="center" mb="md">
          <Text variant="h4">Card Title</Text>
          <Block bg="gray.100" px="sm" py="xs" radius="sm">
            <Text variant="caption">Indicator</Text>
          </Block>
        </Block>
        
        <Text mb="md">
          This is a card-like component built entirely with Block components.
          It demonstrates complex layouts and nested styling.
        </Text>
        
        <Block direction="row" gap="sm">
          <Block 
            bg="blue.500" 
            px="sm" 
            py="xs" 
            radius="sm"
            grow
          >
              <Text color="white" align="center">Action 1</Text>
          </Block>
          <Block 
            bg="gray.200" 
            px="sm" 
            py="xs" 
            radius="sm"
            grow
          >
              <Text align="center">Action 2</Text>
          </Block>
        </Block>
      </Block>

      {/* Spacing demo */}
      <Block>
        <Text variant="h4" mb="md">Spacing System</Text>
        <Block direction="column" gap="xs">
          <Block bg="purple.100" p="xs"><Text>xs padding</Text></Block>
          <Block bg="purple.200" p="sm"><Text>sm padding</Text></Block>
          <Block bg="purple.300" p="md"><Text>md padding</Text></Block>
          <Block bg="purple.400" p="lg"><Text>lg padding</Text></Block>
          <Block bg="purple.500" p="xl"><Text color="white">xl padding</Text></Block>
        </Block>
      </Block>
    </Block>
  );
}