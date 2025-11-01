import { View, Text, Platform } from 'react-native';
import { KeyCap, Flex } from '@platform-blocks/ui';

export default function KeyCapDemo() {
  return (
    <View style={{ padding: 20, gap: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
        KeyCap Component Demo
      </Text>
      
      {Platform.OS === 'web' && (
        <Text style={{ color: '#666', marginBottom: 20 }}>
          On web, press the corresponding keys to see animations!
        </Text>
      )}

      {/* Basic Examples */}
      <View style={{ gap: 15 }}>
        <Text style={{ fontSize: 16, fontWeight: '600' }}>Basic Keys</Text>
        <Flex direction="row" gap="sm" wrap="wrap">
          <KeyCap keyCode="A" animateOnPress>A</KeyCap>
          <KeyCap keyCode="S" animateOnPress>S</KeyCap>
          <KeyCap keyCode="D" animateOnPress>D</KeyCap>
          <KeyCap keyCode="F" animateOnPress>F</KeyCap>
          <KeyCap keyCode="Enter" animateOnPress>Enter</KeyCap>
          <KeyCap keyCode="Space" animateOnPress>Space</KeyCap>
        </Flex>
      </View>

      {/* Modifier Keys */}
      <View style={{ gap: 15 }}>
        <Text style={{ fontSize: 16, fontWeight: '600' }}>Modifier Combinations</Text>
        <Flex direction="row" gap="sm" wrap="wrap">
          <KeyCap keyCode="C" modifiers={['cmd']} animateOnPress>⌘ + C</KeyCap>
          <KeyCap keyCode="V" modifiers={['cmd']} animateOnPress>⌘ + V</KeyCap>
          <KeyCap keyCode="Z" modifiers={['cmd']} animateOnPress>⌘ + Z</KeyCap>
          <KeyCap keyCode="S" modifiers={['cmd']} animateOnPress>⌘ + S</KeyCap>
        </Flex>
      </View>

      {/* Sizes */}
      <View style={{ gap: 15 }}>
        <Text style={{ fontSize: 16, fontWeight: '600' }}>Sizes</Text>
        <Flex direction="row" gap="sm" align="center" wrap="wrap">
          <KeyCap size="xs">XS</KeyCap>
          <KeyCap size="sm">SM</KeyCap>
          <KeyCap size="md">MD</KeyCap>
          <KeyCap size="lg">LG</KeyCap>
          <KeyCap size="xl">XL</KeyCap>
        </Flex>
      </View>

      {/* Colors */}
      <View style={{ gap: 15 }}>
        <Text style={{ fontSize: 16, fontWeight: '600' }}>Colors</Text>
        <Flex direction="row" gap="sm" wrap="wrap">
          <KeyCap color="gray">Gray</KeyCap>
          <KeyCap color="primary">Primary</KeyCap>
          <KeyCap color="secondary">Secondary</KeyCap>
          <KeyCap color="success">Success</KeyCap>
          <KeyCap color="warning">Warning</KeyCap>
          <KeyCap color="error">Error</KeyCap>
        </Flex>
      </View>

      {/* Variants */}
      <View style={{ gap: 15 }}>
        <Text style={{ fontSize: 16, fontWeight: '600' }}>Variants</Text>
        <Flex direction="row" gap="sm" wrap="wrap">
          <KeyCap variant="default">Default</KeyCap>
          <KeyCap variant="filled">Filled</KeyCap>
          <KeyCap variant="minimal">Minimal</KeyCap>
          <KeyCap variant="outline">outline</KeyCap>
        </Flex>
      </View>

      {/* Pressed State */}
      <View style={{ gap: 15 }}>
        <Text style={{ fontSize: 16, fontWeight: '600' }}>Pressed State</Text>
        <Flex direction="row" gap="sm" wrap="wrap">
          <KeyCap pressed={false}>Normal</KeyCap>
          <KeyCap pressed={true}>Pressed</KeyCap>
        </Flex>
      </View>

      {/* Keyboard Shortcuts Documentation */}
      <View style={{ gap: 15 }}>
        <Text style={{ fontSize: 16, fontWeight: '600' }}>Documentation Examples</Text>
        <View style={{ gap: 10 }}>
          <Flex direction="row" gap="xs" align="center">
            <Text>Copy text: </Text>
            <KeyCap keyCode="C" modifiers={['cmd']} size="sm">⌘</KeyCap>
            <Text>+</Text>
            <KeyCap keyCode="C" modifiers={['cmd']} size="sm">C</KeyCap>
          </Flex>
          
          <Flex direction="row" gap="xs" align="center">
            <Text>Save file: </Text>
            <KeyCap keyCode="S" modifiers={['cmd']} size="sm">⌘</KeyCap>
            <Text>+</Text>
            <KeyCap keyCode="S" modifiers={['cmd']} size="sm">S</KeyCap>
          </Flex>
          
          <Flex direction="row" gap="xs" align="center">
            <Text>Undo: </Text>
            <KeyCap keyCode="Z" modifiers={['cmd']} size="sm">⌘</KeyCap>
            <Text>+</Text>
            <KeyCap keyCode="Z" modifiers={['cmd']} size="sm">Z</KeyCap>
          </Flex>
        </View>
      </View>

      {/* Function Keys */}
      <View style={{ gap: 15 }}>
        <Text style={{ fontSize: 16, fontWeight: '600' }}>Function Keys</Text>
        <Flex direction="row" gap="sm" wrap="wrap">
          <KeyCap keyCode="F1" animateOnPress>F1</KeyCap>
          <KeyCap keyCode="F2" animateOnPress>F2</KeyCap>
          <KeyCap keyCode="F3" animateOnPress>F3</KeyCap>
          <KeyCap keyCode="F4" animateOnPress>F4</KeyCap>
          <KeyCap keyCode="F5" animateOnPress>F5</KeyCap>
        </Flex>
      </View>
    </View>
  );
}
