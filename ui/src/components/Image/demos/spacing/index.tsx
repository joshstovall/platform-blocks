import React from 'react';
import { View } from 'react-native';
import { Card, Text, Column, Image } from '@platform-blocks/ui';

export default function UniversalSpacingDemo() {
  return (
    <Card>
      <Text size="lg" weight="semibold" mb={16}>Universal Spacing Props</Text>
      <Column gap={24}>
        
        {/* Auto margin example */}
        <View>
          <Text size="md" weight="medium" mb={8}>Auto Margin Example</Text>
          <View style={{ backgroundColor: '#f0f0f0', padding: 16 }}>
            <Image 
              src="https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=100&h=100&fit=crop" 
              alt="Centered image"
              width={100}
              height={100}
              m="auto"
            />
          </View>
          <Text size="sm" color="gray.6" mt={4}>
            Image with m="auto" should be centered
          </Text>
        </View>

        {/* Theme spacing example */}
        <View>
          <Text size="md" weight="medium" mb={8}>Theme Spacing Values</Text>
          <View style={{ backgroundColor: '#f0f0f0', padding: 16 }}>
            <Image 
              src="https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=80&h=80&fit=crop" 
              alt="Image with theme spacing"
              width={80}
              height={80}
              m="lg"
            />
          </View>
          <Text size="sm" color="gray.6" mt={4}>
            Image with m="lg" using theme spacing
          </Text>
        </View>

        {/* Numeric spacing example */}
        <View>
          <Text size="md" weight="medium" mb={8}>Numeric Spacing Values</Text>
          <View style={{ backgroundColor: '#f0f0f0', padding: 16 }}>
            <Image 
              src="https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=60&h=60&fit=crop" 
              alt="Image with numeric spacing"
              width={60}
              height={60}
              m={20}
            />
          </View>
          <Text size="sm" color="gray.6" mt={4}>
            Image with m={`{20}`} using numeric spacing
          </Text>
        </View>

        {/* Zero margin example */}
        <View>
          <Text size="md" weight="medium" mb={8}>Zero Margin Example</Text>
          <View style={{ backgroundColor: '#f0f0f0', padding: 16 }}>
            <Image 
              src="https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=60&h=60&fit=crop" 
              alt="Image with zero margin"
              width={60}
              height={60}
              m="0"
            />
          </View>
          <Text size="sm" color="gray.6" mt={4}>
            Image with m="0" should have no margin
          </Text>
        </View>

        {/* Mixed spacing props example */}
        <View>
          <Text size="md" weight="medium" mb={8}>Mixed Spacing Props</Text>
          <View style={{ backgroundColor: '#f0f0f0', padding: 16 }}>
            <Image 
              src="https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=80&h=80&fit=crop" 
              alt="Image with mixed spacing"
              width={80}
              height={80}
              mx="auto"
              my="md"
              p="sm"
            />
          </View>
          <Text size="sm" color="gray.6" mt={4}>
            Image with mx="auto", my="md", p="sm"
          </Text>
        </View>
        
      </Column>
    </Card>
  );
}