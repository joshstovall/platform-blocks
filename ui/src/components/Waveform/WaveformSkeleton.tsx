import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../core/theme';

interface WaveformSkeletonProps {
  width?: number;
  height?: number;
  fullWidth?: boolean;
  barsCount?: number;
}

export const WaveformSkeleton: React.FC<WaveformSkeletonProps> = ({
  width = 300,
  height = 60,
  fullWidth = false,
  barsCount = 20,
}) => {
  const theme = useTheme();
  
  const styles = StyleSheet.create({
    animatedBar: {
      backgroundColor: theme.colors.gray[4],
    },
    bar: {
      backgroundColor: theme.colors.gray[3],
      borderRadius: 1,
      opacity: 0.6,
    },
    container: {
      alignItems: 'center',
      backgroundColor: theme.colors.gray[1],
      borderRadius: 4,
      flexDirection: 'row',
      height,
      justifyContent: 'space-between',
      paddingHorizontal: 4,
      width: fullWidth ? '100%' : width,
    },
  });

  // Generate random heights for skeleton bars
  const barHeights = Array.from({ length: barsCount }, () => 
    Math.random() * 0.6 + 0.2 // Heights between 20% and 80% of container
  );

  const barWidth = fullWidth ? 'auto' : Math.max(1, (width - 40) / barsCount - 2);

  return (
    <View style={styles.container}>
      {barHeights.map((heightRatio, index) => {
        const barHeight = height * heightRatio;
        const isAnimated = index % 3 === 0; // Animate every 3rd bar for shimmer effect
        
        return (
          <View
            key={index}
            style={[
              styles.bar,
              {
                width: fullWidth ? undefined : barWidth,
                flex: fullWidth ? 1 : undefined,
                height: barHeight,
                marginHorizontal: fullWidth ? 1 : 1,
              },
              isAnimated && styles.animatedBar,
            ]}
          />
        );
      })}
    </View>
  );
};