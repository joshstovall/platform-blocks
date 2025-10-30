import React, { useCallback, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { ShimmerText } from '../..';
import { Text } from '../../../Text';
import { Slider } from '../../../Slider';
import { Switch } from '../../../Switch';

export default function ControlsDemo() {
  const [spread, setSpread] = useState(2);
  const [repeat, setRepeat] = useState(true);
  const [once, setOnce] = useState(false);

  const handleRepeatChange = useCallback((value: boolean) => {
    setRepeat(value);
    if (value) {
      setOnce(false);
    }
  }, []);

  const handleOnceChange = useCallback((value: boolean) => {
    setOnce(value);
    if (value) {
      setRepeat(false);
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text variant="small" colorVariant="muted">
        Adjust the toggles and slider to see the shimmer respond in real time.
      </Text>

      <ShimmerText 
        spread={spread}
        repeat={repeat}
        once={once}
        repeatDelay={0.6}
        duration={1.6}
        shimmerColor="#38bdf8"
        weight="bold"
        size="lg"
      >
        Interactive shimmer headline
      </ShimmerText>

      <View style={styles.controlGroup}>
        <Text variant="small" weight="medium">
          Spread: {spread.toFixed(1)}
        </Text>
        <Slider
          value={spread}
          onChange={setSpread}
          min={1}
          max={4}
          step={0.1}
        />
      </View>

      <View style={styles.toggleRow}>
        <Text variant="small">Repeat animation</Text>
        <Switch checked={repeat} onChange={handleRepeatChange} />
      </View>

      <View style={styles.toggleRow}>
        <Text variant="small">Single pass</Text>
        <Switch checked={once} onChange={handleOnceChange} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  controlGroup: {
    gap: 8,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
