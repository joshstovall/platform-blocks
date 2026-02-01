import { useMemo, useState } from 'react';
import { Button, Card, Column, Text, Video } from '@platform-blocks/ui';
import type { VideoTimelineEvent, VideoState } from '../../types';

const SOURCE = {
  url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
} as const;

export default function Demo() {
  const [log, setLog] = useState<string[]>([]);

  const timelineEvents = useMemo<VideoTimelineEvent[]>(
    () => [
      {
        id: 'intro',
        time: 5,
        type: 'chapter',
        data: { label: 'Introduction', description: 'Video introduction starts' },
        callback: (_, state) => {
          console.log('Introduction reached!', state.currentTime);
          setLog((entries) => [...entries, 'Reached introduction at 5s']);
        },
      },
      {
        id: 'main-content',
        time: 15,
        type: 'chapter',
        data: { label: 'Main content', description: 'Main content begins' },
        callback: (_, state) => {
          console.log('Main content reached!', state.currentTime);
          setLog((entries) => [...entries, 'Reached main content at 15s']);
        },
      },
    ],
    []
  );

  const handleTimelineEvent = (event: VideoTimelineEvent, state: VideoState) => {
    console.log('Timeline event triggered:', event.id, 'at time:', state.currentTime);
  };

  return (
    <Column gap="lg">
      <Card p="md">
        <Column gap="md">
          <Text size="sm" colorVariant="secondary">
            Attach `timeline` markers to run callbacks as playback crosses those timestamps. Use the `onTimelineEvent` hook for analytics or syncing UI.
          </Text>
          <Video
            source={SOURCE}
            w="100%"
            h={300}
            controls
            timeline={timelineEvents}
            onTimelineEvent={handleTimelineEvent}
          />
          <Column gap="xs">
            <Text size="xs" colorVariant="secondary">
              Timeline log
            </Text>
            {log.length === 0 ? (
              <Text size="xs" colorVariant="secondary">
                Press play to fire registered markers.
              </Text>
            ) : (
              <Column gap="xs">
                {log.map((entry, index) => (
                  <Text key={`${entry}-${index}`} size="xs">
                    {entry}
                  </Text>
                ))}
              </Column>
            )}
            {log.length > 0 && (
              <Button size="xs" variant="outline" onPress={() => setLog([])}>
                Clear log
              </Button>
            )}
          </Column>
        </Column>
      </Card>
    </Column>
  );
}