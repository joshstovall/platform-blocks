import React, { useState } from 'react';
import { Video } from '../../Video';
import { Column, Text, Card, Button } from '@platform-blocks/ui';
import type { VideoTimelineEvent, VideoState } from '../../types';

export default function VideoTimelineDemo() {
  const [triggeredEvents, setTriggeredEvents] = useState<string[]>([]);
  
  const timelineEvents: VideoTimelineEvent[] = [
    {
      id: 'intro',
      time: 5,
      type: 'chapter',
      data: { label: 'Introduction', description: 'Video introduction starts' },
      callback: () => {
        console.log('Introduction reached!');
        setTriggeredEvents(prev => [...prev, 'Reached: Introduction (5s)']);
      },
    },
    {
      id: 'main-content',
      time: 15,
      type: 'chapter',
      data: { label: 'Main Content', description: 'Main content begins' },
      callback: () => {
        console.log('Main content reached!');
        setTriggeredEvents(prev => [...prev, 'Reached: Main Content (15s)']);
      },
    },
  ];
  
  const handleTimelineEvent = (event: VideoTimelineEvent, state: VideoState) => {
    console.log('Timeline event triggered:', event.id, 'at time:', state.currentTime);
  };
  
  return (
    <Column gap="lg">
      <Video
        source={{
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        }}
        width="100%"
        height={300}
        controls={true}
        timeline={timelineEvents}
        onTimelineEvent={handleTimelineEvent}
      />

      <Card>
        <Column gap="sm">
          <Text variant="h6">Triggered Events</Text>
          {triggeredEvents.length === 0 ? (
            <Text variant="caption" colorVariant="secondary">
              Play the video to watch timeline callbacks fire.
            </Text>
          ) : (
            <Column gap="xs">
              {triggeredEvents.map((event, index) => (
                <Text key={index} variant="body">
                  {event}
                </Text>
              ))}
            </Column>
          )}
          {triggeredEvents.length > 0 && (
            <Button size="sm" variant="outline" onPress={() => setTriggeredEvents([])}>
              Clear log
            </Button>
          )}
        </Column>
      </Card>
    </Column>
  );
}