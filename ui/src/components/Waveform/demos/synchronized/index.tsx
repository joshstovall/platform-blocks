import { useState } from 'react';
import { Waveform, Text, Card, Column, Button, Row } from '../../../../components';

const samplePeaks1 = [
  0, 0.15, 0.3, 0.1, -0.31, 0.15, 0.25, 0.11, -0.04, -0.1, -0.03, 0.11, 0.24, 0.01, -0.12, 0.05,
  -0.02, 0.11, 0.07, 0.09, -0.17, -0.02, -0.1, 0.003, 0.08, 0.03, 0.19, 0.02, -0.15, 0.06, 0,
];

const samplePeaks2 = [
  0.1, -0.25, 0.4, -0.15, 0.2, -0.35, 0.3, -0.1, 0.05, -0.2, 0.15, -0.3, 0.25, -0.05, 0.1, -0.15,
  0.2, -0.25, 0.35, -0.1, 0.05, -0.2, 0.15, -0.3, 0.25, -0.05, 0.1, -0.15, 0.2, -0.25, 0.1,
];

export default function Demo() {
  const [progress, setProgress] = useState(0.3);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleProgressChange = (newProgress: number) => {
    setProgress(newProgress);
  };

  return (
    <Column gap={24}>
      <Text variant="h6">Synchronized Waveforms</Text>
      
      <Card padding={16} w={300}>
          
            <Text variant="caption">Track 1 - Vocals</Text>
            <Waveform 
              peaks={samplePeaks1}
              width={350}
              height={120}
              // color="#3b82f6"
              progress={progress}
              interactive={true}
              onSeek={handleProgressChange}
              fullWidth
            />
          
            <Text variant="caption">Track 2 - Instrumental</Text>
            <Waveform 
              peaks={samplePeaks2}
              width={350}
              height={120}
              // color="#10b981"
              progress={progress}
              interactive={true}
              onSeek={handleProgressChange}
              fullWidth
            />
          
          <Row gap={12} align="center">
            <Button
              variant={isPlaying ? 'secondary' : 'filled'}
              onPress={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? 'Pause' : 'Play'}
            </Button>
            <Text variant="caption">
              Progress: {Math.round(progress * 100)}%
            </Text>
          </Row>
      </Card>
      
      <Card padding={16}>
        <Column gap={16}>
          <Text variant="body" weight="medium">Independent Controls</Text>
          <Row gap={16} wrap="wrap">
            <Button 
              variant="outline" 
              onPress={() => setProgress(0)}
            >
              Reset
            </Button>
            <Button 
              variant="outline" 
              onPress={() => setProgress(0.25)}
            >
              25%
            </Button>
            <Button 
              variant="outline" 
              onPress={() => setProgress(0.5)}
            >
              50%
            </Button>
            <Button 
              variant="outline" 
              onPress={() => setProgress(0.75)}
            >
              75%
            </Button>
            <Button 
              variant="outline" 
              onPress={() => setProgress(1)}
            >
              End
            </Button>
          </Row>
        </Column>
      </Card>
    </Column>
  );
}


