import { View } from 'react-native';
import { Container } from '../Container';
import { Text } from '../../Text';
import { Flex } from '../../Flex';

export const SpacingDemo = () => {
  return (
    <Flex direction="column" gap="md" style={{ padding: 16 }}>
      <Text size="lg" weight="bold">Container Spacing Demo</Text>
      
      {/* Margin examples */}
      <Text weight="semibold">Margin Examples:</Text>
      <View style={{ backgroundColor: '#f0f0f0', padding: 8 }}>
        <Container mt="lg" mb="md" mx="xl" style={{ backgroundColor: 'lightblue', padding: 8 }}>
          <Text>mt="lg" mb="md" mx="xl"</Text>
        </Container>
      </View>

      <View style={{ backgroundColor: '#f0f0f0', padding: 8 }}>
        <Container m="md" style={{ backgroundColor: 'lightgreen', padding: 8 }}>
          <Text>m="md" (all margins)</Text>
        </Container>
      </View>

      {/* Padding examples */}
      <Text weight="semibold">Padding Examples:</Text>
      <Container pt="lg" pb="md" px="xl" style={{ backgroundColor: 'lightcoral' }}>
        <Text>pt="lg" pb="md" px="xl"</Text>
      </Container>

      <Container p="lg" style={{ backgroundColor: 'lightyellow' }}>
        <Text>p="lg" (all padding)</Text>
      </Container>

      {/* Combined examples */}
      <Text weight="semibold">Combined Margin & Padding:</Text>
      <View style={{ backgroundColor: '#f0f0f0', padding: 8 }}>
        <Container 
          mt="md" 
          mx="lg" 
          pt="lg" 
          px="xl" 
          style={{ backgroundColor: 'lightpink' }}
        >
          <Text>mt="md" mx="lg" pt="lg" px="xl"</Text>
        </Container>
      </View>

      {/* Legacy props still work */}
      <Text weight="semibold">Legacy Props (backward compatibility):</Text>
      <View style={{ backgroundColor: '#f0f0f0', padding: 8 }}>
        <Container 
          padding={16} 
          margin={8} 
          style={{ backgroundColor: 'lightsteelblue' }}
        >
          <Text>padding={16} margin={8} (legacy)</Text>
        </Container>
      </View>
    </Flex>
  );
};

export default SpacingDemo;