import React, { useState } from 'react';
import { Flex, Text, ColorSwatch } from '@platform-blocks/ui';

export default function ColorSwatchAdvancedDemo() {
  const [selectedColor, setSelectedColor] = useState<string>('#E74C3C');

  const colors = [
    '#E74C3C', '#3498DB', '#2ECC71', '#F39C12', '#9B59B6',
    '#1ABC9C', '#34495E', '#95A5A6', '#E67E22', '#16A085'
  ];

  return (
    <Flex direction="column" gap={20} p={16} style={{ maxWidth: 500 }}>
      <Text weight="semibold" size="md">Advanced Color Swatches</Text>
      
      <Flex direction="column" gap={8}>
        <Text size="sm">Custom styling options:</Text>
        <Flex direction="row" gap={12} wrap="wrap">
          {/* Rounded swatches */}
          <Flex direction="column" gap={4} align="center">
            <ColorSwatch 
              color="#E74C3C" 
              size={40} 
              borderRadius={20}
              selected={selectedColor === '#E74C3C'}
              onPress={() => setSelectedColor('#E74C3C')}
            />
            <Text size="xs">Rounded</Text>
          </Flex>

          {/* Square with thick border */}
          <Flex direction="column" gap={4} align="center">
            <ColorSwatch 
              color="#3498DB" 
              size={40} 
              borderRadius={0}
              borderWidth={3}
              selected={selectedColor === '#3498DB'}
              onPress={() => setSelectedColor('#3498DB')}
            />
            <Text size="xs">Square</Text>
          </Flex>

          {/* Custom border color */}
          <Flex direction="column" gap={4} align="center">
            <ColorSwatch 
              color="#2ECC71" 
              size={40} 
              borderColor="#FFD700"
              borderWidth={2}
              selected={selectedColor === '#2ECC71'}
              onPress={() => setSelectedColor('#2ECC71')}
            />
            <Text size="xs">Gold border</Text>
          </Flex>

          {/* No checkmark */}
          <Flex direction="column" gap={4} align="center">
            <ColorSwatch 
              color="#F39C12" 
              size={40} 
              showCheckmark={false}
              selected={selectedColor === '#F39C12'}
              onPress={() => setSelectedColor('#F39C12')}
            />
            <Text size="xs">No checkmark</Text>
          </Flex>

          {/* Custom checkmark color */}
          <Flex direction="column" gap={4} align="center">
            <ColorSwatch 
              color="#9B59B6" 
              size={40} 
              checkmarkColor="#FFD700"
              selected={selectedColor === '#9B59B6'}
              onPress={() => setSelectedColor('#9B59B6')}
            />
            <Text size="xs">Gold check</Text>
          </Flex>
        </Flex>
      </Flex>

      <Flex direction="column" gap={8}>
        <Text size="sm">Color palette grid:</Text>
        <Flex direction="row" gap={4} wrap="wrap" style={{ maxWidth: 280 }}>
          {colors.map(color => (
            <ColorSwatch
              key={color}
              color={color}
              size={32}
              selected={selectedColor === color}
              onPress={() => setSelectedColor(color)}
            />
          ))}
        </Flex>
        <Text size="xs" colorVariant="secondary">
          Selected: {selectedColor}
        </Text>
      </Flex>

      <Flex direction="column" gap={8}>
        <Text size="sm">Grayscale palette:</Text>
        <Flex direction="row" gap={2}>
          {[
            '#000000', '#1a1a1a', '#333333', '#4d4d4d', '#666666',
            '#808080', '#999999', '#b3b3b3', '#cccccc', '#e6e6e6', '#ffffff'
          ].map(color => (
            <ColorSwatch
              key={color}
              color={color}
              size={24}
              borderRadius={2}
              selected={selectedColor === color}
              onPress={() => setSelectedColor(color)}
            />
          ))}
        </Flex>
      </Flex>

      <Flex direction="column" gap={8}>
        <Text size="sm">Large display swatch:</Text>
        <Flex direction="row" align="center" gap={16}>
          <ColorSwatch 
            color={selectedColor} 
            size={80} 
            borderRadius={8}
            showCheckmark={false}
          />
          <Flex direction="column" gap={4}>
            <Text weight="semibold">{selectedColor}</Text>
            <Text size="xs" colorVariant="secondary">Click any swatch above to change</Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}