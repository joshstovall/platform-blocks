import React, { useEffect } from 'react';
import { View } from 'react-native';
import { NavigationProgress, navigationProgress, Button, Row } from '../../../../';

export default function BasicNavigationProgressDemo() {
  useEffect(() => {
    // Start automatically then complete after a moment for demo
    navigationProgress.start();
    const t = setTimeout(() => navigationProgress.complete(), 1500);
    return () => { clearTimeout(t); navigationProgress.reset(); };
  }, []);

  return (
    <View style={{ paddingVertical: 16 }}>
      <NavigationProgress overlay={false} />
      <Row gap={12} mt={12}>
        <Button size="sm" title="Start" onPress={() => navigationProgress.start()} />
        <Button size="sm" title="Inc" onPress={() => navigationProgress.increment(10)} />
        <Button size="sm" title="Complete" variant="outline" onPress={() => navigationProgress.complete()} />
        <Button size="sm" title="Reset" variant="ghost" onPress={() => navigationProgress.reset()} />
      </Row>
    </View>
  );
}
