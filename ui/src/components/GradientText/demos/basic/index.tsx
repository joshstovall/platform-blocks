import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GradientText } from '../..';

export default function BasicDemo() {
  return (
    <View style={styles.container}>
      <GradientText colors={['#FF0080', '#7928CA']}>
        Hello Gradient World
      </GradientText>
      
      <View style={styles.spacer} />
      
      <GradientText 
        colors={['#667eea', '#764ba2']} 
        size="xl"
        weight="bold"
      >
        Bold Gradient Text
      </GradientText>
      
      <View style={styles.spacer} />
      
      <GradientText 
        colors={['#f093fb', '#f5576c']}
        variant="h2"
      >
        Heading with Gradient
      </GradientText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  spacer: {
    height: 16,
  },
});
