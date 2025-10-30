import React, { useState, useEffect, useMemo, useRef } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { Text, Flex, Button, Slider, Icon, useTheme, ToggleButton, Chip } from '@platform-blocks/ui';
import { tracksMock } from './mockData';
import { createDAWStyles } from './styles';
import type { DAWTransportState } from './types';

const TOTAL_MEASURES = 32; // 4 bars * 8 groups example
const SECONDS_PER_MEASURE = 2; // simplified

export function DAWExample() {
  const theme = useTheme();
  const styles = createDAWStyles(theme);
  const [transport, setTransport] = useState<DAWTransportState>({ playing: false, position: 0, loop: false, bpm: 120, timeSig: '4/4' });
  const [zoom, setZoom] = useState(1);
  const rafRef = useRef<number | null>(null);

  // Playback loop
  useEffect(() => {
    if (!transport.playing) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }
    const start = Date.now();
    const startPos = transport.position;
    const step = () => {
      const elapsed = (Date.now() - start) / 1000; // seconds
      const newPos = startPos + elapsed;
      const maxDuration = TOTAL_MEASURES * SECONDS_PER_MEASURE;
      if (newPos >= maxDuration) {
        if (transport.loop) {
          setTransport(t => ({ ...t, position: 0 }));
        } else {
          setTransport(t => ({ ...t, playing: false, position: 0 }));
          return;
        }
      } else {
        setTransport(t => ({ ...t, position: newPos }));
      }
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [transport.playing, transport.loop]);

  const togglePlay = () => setTransport(t => ({ ...t, playing: !t.playing }));
  const stop = () => setTransport(t => ({ ...t, playing: false, position: 0 }));
  const toggleLoop = () => setTransport(t => ({ ...t, loop: !t.loop }));

  const formattedTime = useMemo(() => {
    const totalSecs = transport.position;
    const measure = Math.floor(totalSecs / SECONDS_PER_MEASURE) + 1;
    const beatFrac = (totalSecs % SECONDS_PER_MEASURE) / (SECONDS_PER_MEASURE / 4);
    const beat = Math.floor(beatFrac) + 1;
    const sub = Math.floor((beatFrac % 1) * 960); // ticks
    return `${measure}:${beat}:${sub.toString().padStart(3, '0')}`;
  }, [transport.position]);

  const measureWidth = 80 * zoom;
  const playheadLeft = (transport.position / SECONDS_PER_MEASURE) * measureWidth;

  return (
    <Flex direction="column" style={styles.root} gap={4}>
      {/* Transport */}
      <View style={styles.transportBar}>
        <Flex direction="row" align="center" gap={8}>
          <Button size="sm" variant="ghost" title="Play" onPress={togglePlay} startIcon={<Icon name={transport.playing ? 'pause' : 'play'} size="sm" />} />
          <Button size="sm" variant="ghost" title="Stop" onPress={stop} startIcon={<Icon name="stop" size="sm" />} />
          <ToggleButton value="loop" selected={transport.loop} onPress={toggleLoop} variant="ghost">
            <Icon name="repeat" size="sm" color={transport.loop ? 'primary' : 'gray'} />
          </ToggleButton>
          <Chip size="sm" variant="outline">{transport.bpm} BPM</Chip>
          <Chip size="sm" variant="outline">{transport.timeSig}</Chip>
        </Flex>
        <Flex direction="row" align="center" gap={8}>
          <Text size="xs" color="muted">Zoom</Text>
          <Slider value={zoom * 50} onChange={(v: number) => setZoom(Math.max(0.5, Math.min(2, v / 50)))} style={{ width: 120 }} />
          <Text size="sm" weight="semibold" style={styles.timeDisplay}>{formattedTime}</Text>

        </Flex>
      </View>

      {/* Tracks area */}
      <View style={styles.tracksContainer}>
        {/* Track list */}
        <ScrollView style={styles.trackList}>
          {tracksMock.map(track => (
            <Flex key={track.id} direction="row" align="center" gap={6} style={styles.trackRow}>
              <View style={[styles.trackColorSwatch, { backgroundColor: track.color }]} />
              <Text size="sm" style={{ flex: 1 }}>{track.name}</Text>
              <ToggleButton value="m" size="xs" variant="ghost" selected={track.muted}>
                <Icon name="volumeOff" size="sm" />
              </ToggleButton>
              <ToggleButton
                value="favorite"
                variant="ghost"
                selected={track.solo}
              // onPress={() => setFavorite(!favorite)}
              >
                <Icon name="headphones" size={24} color={track.solo ? 'red' : 'gray'} variant={track.solo ? 'filled' : 'outlined'} />
              </ToggleButton>

              <ToggleButton value="r" size="xs" variant="ghost" selected={track.armed}>
                <Icon name="circle" size="sm" color={track.armed ? 'error' : undefined} />
              </ToggleButton>
            </Flex>
          ))}
        </ScrollView>

        {/* Timeline */}
        <ScrollView horizontal style={styles.timeline} contentContainerStyle={{ paddingBottom: 40 }}>
          <View style={{ width: TOTAL_MEASURES * measureWidth }}>
            {/* Ruler */}
            <View style={styles.ruler}>
              {Array.from({ length: TOTAL_MEASURES }, (_, i) => (
                <View key={i} style={[styles.measureMarker, { width: measureWidth }]}>
                  <Text size="xs" color="muted">{i + 1}</Text>
                </View>
              ))}
            </View>

            {/* Clips lanes */}
            {tracksMock.map((track, idx) => (
              <View key={track.id} style={[styles.clipsLane, { width: '100%' }]}>
                {track.clips.map(clip => {
                  const left = clip.start / SECONDS_PER_MEASURE * measureWidth;
                  const width = clip.length / SECONDS_PER_MEASURE * measureWidth;
                  return (
                    <Pressable key={clip.id} style={[styles.clip, { left, width, backgroundColor: track.color + '33', borderWidth: 1, borderColor: track.color }]}>
                      <Text size="xs">{track.name}</Text>
                    </Pressable>
                  );
                })}
              </View>
            ))}

            {/* Playhead */}
            <View style={[styles.playhead, { left: playheadLeft }]} />
          </View>
        </ScrollView>
      </View>
    </Flex>
  );
}

export default DAWExample;
