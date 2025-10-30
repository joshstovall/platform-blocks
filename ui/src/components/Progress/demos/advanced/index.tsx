import React, { useState, useEffect } from 'react';
import { Progress, Text, Column, Card, Button, Block } from '@platform-blocks/ui';

export default function Demo() {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  const startAnimation = () => {
    setAnimatedProgress(0);
    setTimeout(() => setAnimatedProgress(85), 100);
  };

  return (
    <Card>
      <Column gap={16}>
        <Text size="lg" weight="semibold">Advanced Progress</Text>
        
        <Block>
          <Text size="sm" mb="xs">Animated Progress</Text>
          <Progress value={animatedProgress} />
          <Text size="xs" style={{ color: '#666' }}>
            {animatedProgress}% Complete
          </Text>
        </Block>
        
        <Button title="Start Animation" onPress={startAnimation} />
        
        <Block>
          <Text size="sm" mb="xs">Indeterminate Loading</Text>
          <Progress value={100} />
        </Block>
      </Column>
    </Card>
  );
}


