import { useState, useEffect } from 'react';
import { Waveform, Text, Card, Column, Button, Row } from '../../../../components';
import { useTheme } from 'platform-blocks/core';

const samplePeaks = [
  0, 0.15, 0.3, 0.1, -0.31, 0.15, 0.25, 0.11, -0.04, -0.1, -0.03, 0.11, 0.24, 0.01, -0.12, 0.05,
  -0.02, 0.11, 0.07, 0.09, -0.17, -0.02, -0.1, 0.003, 0.08, 0.03, 0.19, 0.02, -0.15, 0.06, 0,
  0.27, 0.26, 0.08, 0.11, -0.07, 0.15, 0.07, 0.03, -0.09, 0.02, -0.05, -0.05, -0.007, 0.05, -0.02,
];

const quietPeaks = [
  0, 0.05, 0.08, 0.03, -0.09, 0.04, 0.07, 0.02, -0.01, -0.03, -0.01, 0.04, 0.06, 0.01, -0.04, 0.02,
  -0.01, 0.03, 0.02, 0.03, -0.05, -0.01, -0.03, 0.001, 0.02, 0.01, 0.05, 0.01, -0.04, 0.02, 0,
  0.07, 0.06, 0.02, 0.03, -0.02, 0.04, 0.02, 0.01, -0.02, 0.01, -0.01, -0.01, -0.002, 0.01, -0.01,
];

export default function Demo() {
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [wasPlayingBeforeDrag, setWasPlayingBeforeDrag] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [normalize, setNormalize] = useState(false);
  const [useQuietPeaks, setUseQuietPeaks] = useState(false);
  const theme = useTheme();

  // Simulate playback
  useEffect(() => {
    if (!isPlaying || isDragging) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (0.01 * speed);
        if (newProgress >= 1) {
          setIsPlaying(false);
          return 1;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, isDragging, speed]);

  const handleSeek = (position: number) => {
    setProgress(position);
  };

  const handleDragStart = (position: number) => {
    setIsDragging(true);
    setWasPlayingBeforeDrag(isPlaying);
    setIsPlaying(false); // Pause during drag
    setProgress(position);
  };

  const handleDrag = (position: number) => {
    setProgress(position);
  };

  const handleDragEnd = (position: number) => {
    setIsDragging(false);
    setProgress(position);
    // Resume playback if it was playing before drag
    if (wasPlayingBeforeDrag) {
      setIsPlaying(true);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  return (
    <Column gap={24}>
      <Text variant="h6">Interactive Waveform</Text>
      
      <Card padding={16}>
        <Column gap={16}>
          <Text variant="body" weight="medium">Drag & Seek Waveform</Text>
          <Text variant="caption">
            Click to seek or drag to scrub through. Playback pauses during drag and resumes after.
          </Text>
          
          <Waveform 
            peaks={useQuietPeaks ? quietPeaks : samplePeaks}
            height={300}
            color="#3b82f6"
            progress={progress}
            interactive={true}
            onSeek={handleSeek}
            onDragStart={handleDragStart}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            progressColor="#ef4444"
            fullWidth
            normalize={normalize}
            showProgressLine
          />
          
          <Row gap={12} align="center">
            <Button
              variant={isPlaying ? 'secondary' : 'filled'}
              onPress={handlePlayPause}
            >
              {isPlaying ? 'Pause' : 'Play'}
            </Button>
            <Button
              variant="outline"
              onPress={handleStop}
            >
              Stop
            </Button>
            <Text variant="caption">
              {Math.round(progress * 100)}% / {Math.round((progress * 180))}s
              {isDragging && ' • Dragging'}
              {isPlaying && !isDragging && ' • Playing'}
            </Text>
          </Row>
          
          <Row gap={12} align="center">
            <Text variant="caption">Waveform Type:</Text>
            <Button
              variant={useQuietPeaks ? 'outline' : 'filled'}
              onPress={() => setUseQuietPeaks(false)}
            >
              Normal
            </Button>
            <Button
              variant={useQuietPeaks ? 'filled' : 'outline'}
              onPress={() => setUseQuietPeaks(true)}
            >
              Quiet
            </Button>
            <Button
              variant={normalize ? 'filled' : 'outline'}
              onPress={() => setNormalize(!normalize)}
            >
              {normalize ? 'Normalized' : 'Normalize'}
            </Button>
          </Row>
        </Column>
      </Card>
      
      <Card padding={16}>
        <Column gap={16}>
          <Text variant="body" weight="medium">Playback Controls</Text>
          
          <Row gap={12} align="center">
            <Text variant="caption">Speed:</Text>
            <Button
              variant={speed === 0.5 ? 'filled' : 'outline'}
              onPress={() => setSpeed(0.5)}
            >
              0.5x
            </Button>
            <Button
              variant={speed === 1 ? 'filled' : 'outline'}
              onPress={() => setSpeed(1)}
            >
              1x
            </Button>
            <Button
              variant={speed === 1.5 ? 'filled' : 'outline'}
              onPress={() => setSpeed(1.5)}
            >
              1.5x
            </Button>
            <Button
              variant={speed === 2 ? 'filled' : 'outline'}
              onPress={() => setSpeed(2)}
            >
              2x
            </Button>
          </Row>
          
          <Row gap={12} align="center">
            <Text variant="caption">Quick Seek:</Text>
            <Button variant="outline" onPress={() => setProgress(0.25)}>25%</Button>
            <Button variant="outline" onPress={() => setProgress(0.5)}>50%</Button>
            <Button variant="outline" onPress={() => setProgress(0.75)}>75%</Button>
          </Row>
        </Column>
      </Card>
    </Column>
  );
}


