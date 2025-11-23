import { useState } from 'react';
import { Button, Column, Row, Text, Waveform } from '@platform-blocks/ui';

import { TRACK_TWO_PEAKS, WAVEFORM_DEMO_PEAKS } from '../data';

const CUE_POINTS: number[] = [0, 0.25, 0.5, 0.75, 1];

export default function Demo() {
  const [progress, setProgress] = useState<number>(0.35);

  const handleSeek = (value: number) => {
    setProgress(value);
  };

  return (
    <Column gap="lg">
      <Column gap="sm">
        <Text variant="small">Narration track</Text>
        <Waveform
          peaks={WAVEFORM_DEMO_PEAKS}
          progress={progress}
          height={80}
          fullWidth
          color="primary"
          interactive
          onSeek={handleSeek}
        />
      </Column>

      <Column gap="sm">
        <Text variant="small">Background score</Text>
        <Waveform
          peaks={TRACK_TWO_PEAKS}
          progress={progress}
          height={80}
          fullWidth
          color="secondary"
          interactive
          onSeek={handleSeek}
        />
      </Column>

      <Row gap="sm" wrap="wrap">
        {CUE_POINTS.map((value) => (
          <Button key={value} variant="outline" onPress={() => handleSeek(value)}>
            {Math.round(value * 100)}%
          </Button>
        ))}
      </Row>

      <Text variant="small">Shared progress: {Math.round(progress * 100)}%</Text>
    </Column>
  );
}


