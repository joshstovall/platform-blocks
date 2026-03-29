import { useEffect, useState } from 'react';
import { Button, Column, Progress, Text } from '@platform-blocks/ui';

export default function Demo() {
  const [animatedValue, setAnimatedValue] = useState<number>(0);

  useEffect(() => {
    const timeout = setTimeout(() => setAnimatedValue(78), 120);
    return () => clearTimeout(timeout);
  }, []);

  const handleRestart = () => {
    setAnimatedValue(0);
    requestAnimationFrame(() => {
      setAnimatedValue(78);
    });
  };

  return (
    <Column gap="lg">
      <Column gap="xs">
        <Text variant="small" colorVariant="muted">
          Animated transition with easing
        </Text>
        <Progress value={animatedValue} transitionDuration={600} size="lg" fullWidth />
        <Text variant="small" colorVariant="muted">
          {animatedValue}% of highlight reels encoded.
        </Text>
        <Button size="xs" variant="outline" onPress={handleRestart}>
          Restart animation
        </Button>
      </Column>
      <Column gap="xs">
        <Text variant="small" colorVariant="muted">
          Striped status indicator
        </Text>
        <Progress value={100} striped animate color="secondary" />
        <Text variant="small" colorVariant="muted">
          Combine `striped` and `animate` to represent indeterminate work.
        </Text>
      </Column>
      <Column gap="xs">
        <Text variant="small" colorVariant="muted">
          Compact success state
        </Text>
        <Progress value={42} size="sm" color="success" fullWidth />
      </Column>
    </Column>
  );
}


