import { useEffect } from 'react';
import { Button, Column, NavigationProgress, Row, navigationProgress } from '@platform-blocks/ui';

const AUTO_COMPLETE_DELAY = 1500;

export default function Demo() {
  useEffect(() => {
    navigationProgress.start();
    const timer = setTimeout(() => navigationProgress.complete(), AUTO_COMPLETE_DELAY);
    return () => {
      clearTimeout(timer);
      navigationProgress.reset();
    };
  }, []);

  return (
    <Column gap="sm" align="flex-start">
      <NavigationProgress overlay={false} />
      <Row gap="sm" wrap="wrap">
        <Button size="sm" onPress={() => navigationProgress.start()}>Start</Button>
        <Button size="sm" onPress={() => navigationProgress.increment(10)}>Increment</Button>
        <Button size="sm" variant="outline" onPress={() => navigationProgress.complete()}>Complete</Button>
        <Button size="sm" variant="ghost" onPress={() => navigationProgress.reset()}>Reset</Button>
      </Row>
    </Column>
  );
}
