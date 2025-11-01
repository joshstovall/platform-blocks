import { Button, Flex } from '@platform-blocks/ui';
import { NavigationProgress, navigationProgress } from '../..';

export default function ControllerNavigationProgressDemo() {
  return (
    <Flex gap={12} style={{ paddingTop: 32 }}>
      <NavigationProgress />
      <Flex direction="row" gap={8} wrap="wrap">
        <Button title="Start" size="sm" onPress={() => navigationProgress.start()} />
        <Button title="Stop" size="sm" onPress={() => navigationProgress.stop()} />
        <Button title="Inc" size="sm" onPress={() => navigationProgress.increment()} />
        <Button title="Dec" size="sm" onPress={() => navigationProgress.decrement()} />
        <Button title="50%" size="sm" onPress={() => navigationProgress.set(50)} />
        <Button title="Reset" size="sm" onPress={() => navigationProgress.reset()} />
        <Button title="Complete" size="sm" variant="outline" onPress={() => navigationProgress.complete()} />
      </Flex>
    </Flex>
  );
}