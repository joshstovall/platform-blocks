import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { GradientText } from '../..';
import { Text } from '../../../Text';
import { Slider } from '../../../Slider';

export default function ControlledDemo() {
  const [position, setPosition] = useState(0);

  return (
    <View style={styles.container}>
      <Text variant="small" colorVariant="muted" style={styles.note}>
        Use the slider to control the gradient position (0.0 - 1.0)
      </Text>
      
      <View style={styles.spacer} />
      
      <GradientText 
        colors={['#FF0080', '#7928CA', '#4F46E5']}
        position={position}
        variant="h2"
        weight="bold"
      >
        Controlled Gradient
      </GradientText>
            
      <View style={styles.sliderContainer}>
        <Slider
          value={position}
          onChange={setPosition}
          min={0}
          max={1}
          step={0.01}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  note: {
    fontStyle: 'italic',
  },
  sliderContainer: {
    gap: 8,
    marginTop: 16,
  },
  spacer: {
    height: 16,
  },
});