import { useState } from 'react';
import { Button, Column, Row, Text, Waveform } from '@platform-blocks/ui';

import { WAVEFORM_DEMO_PEAKS } from '../data';

const PROGRESS_STEP = 0.1;

export default function Demo() {
  const [progress, setProgress] = useState<number>(0.3);

  const handleAdvance = () => {
    setProgress((current) => Math.min(current + PROGRESS_STEP, 1));
  };

  const handleReset = () => {
    setProgress(0);
  };

  return (
    <Column gap="md">
      <Waveform peaks={WAVEFORM_DEMO_PEAKS} progress={progress} height={64} />
      <Row gap="sm" align="center">
        <Button onPress={handleAdvance}>Skip 10%</Button>
        <Button variant="outline" onPress={handleReset}>
          Reset
        </Button>
        <Text variant="small">{Math.round(progress * 100)}% complete</Text>
      </Row>
    </Column>
  );
}
