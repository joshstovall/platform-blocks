import { View, StyleSheet } from 'react-native';
import { GradientText } from '../..';
import { Text } from '../../../Text';

export default function AnimatedDemo() {
  return (
    <View style={styles.container}>
      <Text variant="small" colorVariant="muted" style={styles.note}>
        Note: Animation is currently supported on web only
      </Text>
      
      <View style={styles.spacer} />
      
      <GradientText 
        colors={['#FF0080', '#7928CA', '#4F46E5']}
        animate
        animationDuration={3000}
        variant="h3"
      >
        Looping Animation
      </GradientText>
      
      <View style={styles.spacer} />
      
      <GradientText 
        colors={['#f093fb', '#f5576c', '#ffd200']}
        animate
        animationDuration={2000}
        animationLoop="reverse"
        size="lg"
      >
        Reversing Animation
      </GradientText>
      
      <View style={styles.spacer} />
      
      <GradientText 
        colors={['#667eea', '#764ba2', '#f093fb']}
        animate
        animationDuration={4000}
        animationLoop="once"
        weight="bold"
      >
        Single Run Animation
      </GradientText>
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
  spacer: {
    height: 16,
  },
});