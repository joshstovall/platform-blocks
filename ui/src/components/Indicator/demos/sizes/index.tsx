import { View } from 'react-native';
import { Flex, Text, Indicator, Card } from '@platform-blocks/ui';

export default function IndicatorSizesDemo() {
  const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] as const;
  
  return (
    <Flex direction="column" gap={20} p={16} style={{ maxWidth: 600 }}>
      <Text size="sm" weight="semibold">Indicator Sizes (String Values)</Text>
      
      <Flex gap={32} wrap="wrap" align="center">
        {sizes.map((size) => (
          <Flex key={size} direction="column" align="center" gap={8}>
            <Text size="xs" color="muted" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>
              {size}
            </Text>
            <View style={{ 
              width: 60, 
              height: 60, 
              backgroundColor: '#f5f5f5', 
              borderRadius: 12, 
              position: 'relative',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: '#e0e0e0'
            }}>
              <Indicator 
                placement="top-right" 
                size={size} 
                color="#6366F1"
                offset={2}
              />
              <Text size="xs" color="muted">Item</Text>
            </View>
          </Flex>
        ))}
      </Flex>

      <Text size="sm" weight="semibold">Indicator with Content (Different Sizes)</Text>
      
      <Flex gap={24} wrap="wrap" align="center">
        {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
          <Flex key={size} direction="column" align="center" gap={8}>
            <Text size="xs" color="muted">{size}</Text>
            <View style={{ 
              width: 80, 
              height: 60, 
              backgroundColor: '#f8f9fa', 
              borderRadius: 8, 
              position: 'relative',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Indicator 
                placement="top-right" 
                size={size} 
                color="#10b981"
                offset={4}
              >
                <Text 
                  size="xs" 
                  weight="bold" 
                  color="white"
                  style={{ fontSize: size === 'xs' ? 8 : size === 'sm' ? 9 : 10 }}
                >
                  {size === 'xs' ? '1' : size === 'sm' ? '5' : size === 'md' ? '12' : size === 'lg' ? '99' : '99+'}
                </Text>
              </Indicator>
              <Text size="xs" color="muted">Inbox</Text>
            </View>
          </Flex>
        ))}
      </Flex>

      <Text size="sm" weight="semibold">Numeric Size (Legacy Support)</Text>
      <Flex gap={16} align="center">
        <View style={{ 
          width: 60, 
          height: 60, 
          backgroundColor: '#f5f5f5', 
          borderRadius: 12, 
          position: 'relative',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Indicator 
            placement="top-right" 
            size={24} 
            color="#ef4444"
            offset={2}
          />
          <Text size="xs" color="muted">Custom</Text>
        </View>
        <Text size="xs" color="muted">size={24}</Text>
      </Flex>
    </Flex>
  );
}