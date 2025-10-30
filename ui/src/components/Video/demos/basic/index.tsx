import React, { useState, useRef } from 'react';
import { Column, Text, Card, Flex, Button, Alert, Strong } from '@platform-blocks/ui';
import { Video } from '../../Video';
import type { VideoRef } from '../../types';

export default function VideoYouTubeDemo() {
  const [status, setStatus] = useState('Ready');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<VideoRef>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Column gap="lg">
      <Text variant="h4">Normal Video</Text>

      <Text variant="body">
        This demo shows YouTube video playback using iframe on web and WebView on native platforms.
        The player supports all standard video controls and YouTube-specific features.
      </Text>

      <Card>
        <Column gap="md">
          <Text variant="h6">Rick Astley - Never Gonna Give You Up</Text>


          <Video
            ref={videoRef}
            source={{
              url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',

            }}
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
            youtubeOptions={{
              modestbranding: true,
              rel: false,
              start: 10, // Start at 10 seconds
            }}
            onPlay={() => setStatus('Playing')}
            onPause={() => setStatus('Paused')}
            onTimeUpdate={(state) => setCurrentTime(state.currentTime)}
            onDurationChange={(dur) => setDuration(dur)}
            onBuffer={(isBuffering) => setStatus(isBuffering ? 'Buffering…' : 'Playing')}
            onError={(error) => setStatus(`Error: ${error}`)}
            onLoad={() => setStatus('Loaded')}
          />
        </Column>
      </Card>

      <Alert icon="info">
        <Column gap="md">
          <Flex align="center" justify="space-between">
            <Text variant="h6">Playback Status</Text>
            <Text variant="caption" style={{ fontFamily: 'monospace' }}>{status}</Text>
          </Flex>
          {duration > 0 && (
            <Flex align="center" justify="space-between">
              <Text variant="body">Progress</Text>
              <Text variant="caption" style={{ fontFamily: 'monospace' }}>
                {formatTime(currentTime)} / {formatTime(duration)}
              </Text>
            </Flex>
          )}
          <Text variant="body">
            This YouTube player works across all platforms using your hosted iframe API.
            It supports real-time synchronization with React Native controls including play/pause,
            seeking, volume control, mute/unmute, playback rate, and more. All YouTube iframe API
            events are properly forwarded to maintain perfect sync between the player and UI.
          </Text>
          <Flex gap="sm" style={{ flexWrap: 'wrap' }}>
            <Button
              size="sm"
              variant="outline"
              onPress={() => videoRef.current?.play()}
            >
              Play
            </Button>
            <Button
              size="sm"
              variant="outline"
              onPress={() => videoRef.current?.pause()}
            >
              Pause
            </Button>
            <Button
              size="sm"
              variant="outline"
              onPress={() => videoRef.current?.seek(30)}
            >
              Skip to 30s
            </Button>
            <Button
              size="sm"
              variant="outline"
              onPress={() => videoRef.current?.setVolume(0.5)}
            >
              50% Volume
            </Button>
            <Button
              size="sm"
              variant="outline"
              onPress={() => videoRef.current?.mute()}
            >
              Mute
            </Button>
            <Button
              size="sm"
              variant="outline"
              onPress={() => videoRef.current?.unmute()}
            >
              Unmute
            </Button>
            <Button
              size="sm"
              variant="outline"
              onPress={() => videoRef.current?.setPlaybackRate(1.5)}
            >
              1.5x Speed
            </Button>
            <Button
              size="sm"
              variant="outline"
              onPress={() => setStatus('Reset')}
            >
              Reset Status
            </Button>
          </Flex>
        </Column>
      </Alert>
    </Column>
  );
}