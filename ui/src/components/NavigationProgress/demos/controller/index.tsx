import { useEffect } from 'react';
import { Button, Column, NavigationProgress, Row, navigationProgress } from '@platform-blocks/ui';

export default function Demo() {
  useEffect(() => {
    navigationProgress.reset();
  }, []);

  return (
    <Column gap="sm" align="flex-start">
      <NavigationProgress />
      <Row gap="sm" wrap="wrap">
        <Button size="sm" onPress={() => navigationProgress.start()}>Start</Button>
        <Button size="sm" onPress={() => navigationProgress.stop()}>Stop</Button>
        <Button size="sm" onPress={() => navigationProgress.increment()}>Increment</Button>
        <Button size="sm" onPress={() => navigationProgress.decrement()}>Decrement</Button>
        <Button size="sm" onPress={() => navigationProgress.set(50)}>Set 50%</Button>
        <Button size="sm" onPress={() => navigationProgress.reset()}>Reset</Button>
        <Button size="sm" variant="outline" onPress={() => navigationProgress.complete()}>Complete</Button>
      </Row>
    </Column>
  );
}