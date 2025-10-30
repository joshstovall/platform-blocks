import React, { useState } from 'react';
import { Progress, Text, Column, Card, Button, Row } from '@platform-blocks/ui';

export default function Demo() {
  const [progress, setProgress] = useState(65);

  const decreaseProgress = () => {
    setProgress(prev => Math.max(prev - 10, 0));
  };

  const increaseProgress = () => {
    setProgress(prev => Math.min(prev + 10, 100));
  };

  return (
    <Card>
      <Column gap={16}>
        <Text size="lg" weight="semibold">Basic Progress Bar</Text>
        <Progress value={progress} />
        
        <Text size="md" weight="semibold">Full Width Progress Bar</Text>
        <Progress value={progress} fullWidth />
        
        <Text size="md" weight="semibold">Progress Bar with Custom Width</Text>
        <Progress value={progress} style={{ width: 200 }} />
        
        <Text size="sm" style={{ color: '#666' }}>
          Progress: {progress}%
        </Text>
        <Row gap={8}>
          <Button title="Decrease" onPress={decreaseProgress} />
          <Button title="Increase" onPress={increaseProgress} />
        </Row>
      </Column>
    </Card>
  );
}


