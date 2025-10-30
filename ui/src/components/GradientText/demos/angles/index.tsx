import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GradientText } from '../..';
import { Text } from '../../../Text';

export default function AnglesDemo() {
  return (
    <View style={styles.container}>
      <View>
        <Text variant="small" colorVariant="muted">0° (Left to Right)</Text>
        <GradientText 
          colors={['#FF0080', '#7928CA']}
          angle={0}
          size="lg"
        >
          Horizontal Gradient
        </GradientText>
      </View>
      
      <View style={styles.spacer} />
      
      <View>
        <Text variant="small" colorVariant="muted">45° (Diagonal)</Text>
        <GradientText 
          colors={['#667eea', '#764ba2']}
          angle={45}
          size="lg"
        >
          Diagonal Gradient
        </GradientText>
      </View>
      
      <View style={styles.spacer} />
      
      <View>
        <Text variant="small" colorVariant="muted">90° (Top to Bottom)</Text>
        <GradientText 
          colors={['#f093fb', '#f5576c']}
          angle={90}
          size="lg"
        >
          Vertical Gradient
        </GradientText>
      </View>
      
      <View style={styles.spacer} />
      
      <View>
        <Text variant="small" colorVariant="muted">135° (Diagonal)</Text>
        <GradientText 
          colors={['#ffd200', '#f7971e']}
          angle={135}
          size="lg"
        >
          Reverse Diagonal
        </GradientText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  spacer: {
    height: 20,
  },
});