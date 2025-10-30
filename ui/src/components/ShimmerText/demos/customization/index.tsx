import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ShimmerText } from '../..';
import { Text } from '../../../Text';

export default function CustomizationDemo() {
  return (
    <View style={styles.container}>
      <Text variant="small" colorVariant="muted">
        Tweak the shimmer color, width, direction, and loop cadence.
      </Text>

      <ShimmerText  shimmerColor="#facc15" spread={3} weight="bold" size="lg">
        Golden spotlight offer
      </ShimmerText>

      <ShimmerText 
        color="#94a3b8"
        shimmerColor="#38bdf8"
        spread={1.2}
        duration={1.2}
        repeatDelay={0.2}
      >
        Fast pulse notification
      </ShimmerText>

      <ShimmerText  direction="rtl" repeatDelay={0.8} text="RTL shimmer direction" />

      <ShimmerText  once repeat={false} delay={0.5}>
        Single pass announcement
      </ShimmerText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
});
