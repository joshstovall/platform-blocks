import React, { useState } from 'react';
import { Column, Text, Card, Flex, Button, Alert, Block } from '@platform-blocks/ui';
import { Video } from '../../Video';
import { YouTubePlayer } from '../../YouTubePlayer';

export default function VideoYouTubeDemo() {
  const [status, setStatus] = useState('Paused');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  return (
    <Block gap="lg">
      <Video
        source={{ youtube: 'dQw4w9WgXcQ' }}
        width={400}
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
        }}
        youtubeOptions={{
          modestbranding: true,
          rel: false,
        }}
        onPlay={() => setStatus('Playing')}
        onPause={() => setStatus('Paused')}
        onBuffer={(isBuffering) => setStatus(isBuffering ? 'Buffering…' : 'Playing')}
        onError={() => setStatus('Error')}
        onTimeUpdate={(state) => {
          setCurrentTime(state.currentTime);
          setDuration(state.duration);
        }}
      />

      <Alert icon="info" sev="error">
        <Column gap="md">
          <Flex align="center" justify="space-between">
            <Text variant="h6">Playback status: {status}</Text>
            <Text variant="caption">
              {Math.floor(currentTime)}s / {Math.floor(duration)}s
            </Text>
          </Flex>
          <Text variant="body">
            This demo loads a YouTube video with native controls enabled. Customize the control set via the{' '}
            <Text variant="code">controls</Text>{' '}prop and respond to lifecycle events like{' '}
            <Text variant="code">onPlay</Text>,{' '}
            <Text variant="code">onPause</Text>, and{' '}
            <Text variant="code">onBuffer</Text>.
          </Text>
          <Flex gap="sm">
            <Button size="sm" variant="outline" onPress={() => setStatus('Paused')}>
              Reset status
            </Button>
          </Flex>
        </Column>
      </Alert>
    </Block>
  );
}