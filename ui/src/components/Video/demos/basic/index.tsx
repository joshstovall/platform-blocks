import { useMemo, useRef, useState } from 'react';
import { Button, Card, Column, Row, Text, Video } from '@platform-blocks/ui';
import type { VideoRef } from '../../types';

const SOURCE = {
  url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
} as const;

export default function Demo() {
  const videoRef = useRef<VideoRef>(null);
  const [status, setStatus] = useState('Ready');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const actions = useMemo(
    () => [
      { label: 'Play', onPress: () => videoRef.current?.play() },
      { label: 'Pause', onPress: () => videoRef.current?.pause() },
      { label: 'Skip to 30s', onPress: () => videoRef.current?.seek(30) },
      { label: 'Volume 50%', onPress: () => videoRef.current?.setVolume(0.5) },
  { label: 'Mute', onPress: () => videoRef.current?.setVolume(0) },
  { label: 'Unmute', onPress: () => videoRef.current?.setVolume(1) },
      { label: '1.5× speed', onPress: () => videoRef.current?.setPlaybackRate(1.5) },
      { label: 'Reset status', onPress: () => setStatus('Ready') },
    ],
    []
  );

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const secs = Math.floor(seconds % 60)
      .toString()
      .padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <Column gap="lg">
      <Card p="md">
        <Column gap="md">
          <Text size="sm" colorVariant="secondary">
            Combine default transport controls with imperative helpers to script playback, adjust volume, and toggle captions from surrounding UI.
          </Text>
          <Video
            ref={videoRef}
            source={SOURCE}
            width="100%"
            height={300}
            controls={{
              play: true,
              pause: true,
              progress: true,
              time: true,
              volume: true,
              fullscreen: true,
              playbackRate: true,
              quality: true,
              autoHide: true,
              autoHideTimeout: 3000,
            }}
            onPlay={() => setStatus('Playing')}
            onPause={() => setStatus('Paused')}
            onLoad={() => setStatus('Loaded')}
            onBuffer={(buffering) => setStatus(buffering ? 'Buffering…' : 'Playing')}
            onTimeUpdate={(state) => setCurrentTime(state.currentTime)}
            onDurationChange={(value) => setDuration(value)}
            onError={(error) => setStatus(`Error: ${error}`)}
          />
          <Column gap="xs">
            <Text size="xs" colorVariant="secondary">
              Status: {status}
            </Text>
            {duration > 0 && (
              <Text size="xs" colorVariant="secondary">
                Progress: {formatTime(currentTime)} / {formatTime(duration)}
              </Text>
            )}
          </Column>
          <Row gap="sm" wrap="wrap">
            {actions.map((action) => (
              <Button key={action.label} size="xs" variant="outline" onPress={action.onPress}>
                {action.label}
              </Button>
            ))}
          </Row>
        </Column>
      </Card>
    </Column>
  );
}