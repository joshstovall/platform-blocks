import React, { useState, useEffect, useMemo, useRef } from 'react';
import { View, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Text, Flex, Button, Slider, Icon, useTheme, ToggleButton, Chip, Block } from '@platform-blocks/ui';
import { tracksMock } from './mockData';
import { createDAWStyles } from './styles';
import type { DAWTransportState } from './types';
import { useResponsive } from '../../../../hooks/useResponsive';

const TOTAL_MEASURES = 32; // 4 bars * 8 groups example
const SECONDS_PER_MEASURE = 2; // simplified

export function DAWExample() {
  const theme = useTheme();
  const styles = createDAWStyles(theme);
  const { isMobile, isTablet } = useResponsive();
  const [transport, setTransport] = useState<DAWTransportState>({ playing: false, position: 0, loop: false, bpm: 120, timeSig: '4/4' });
  const [zoom, setZoom] = useState(1);
  const [showTrackList, setShowTrackList] = useState(() => !isMobile);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    setShowTrackList(!isMobile);
  }, [isMobile]);

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

  const baseMeasureWidth = useMemo(() => {
    if (isMobile) return 56;
    if (isTablet) return 72;
    return 80;
  }, [isMobile, isTablet]);

  const formattedTime = useMemo(() => {
    const totalSecs = transport.position;
    const measure = Math.floor(totalSecs / SECONDS_PER_MEASURE) + 1;
    const beatFrac = (totalSecs % SECONDS_PER_MEASURE) / (SECONDS_PER_MEASURE / 4);
    const beat = Math.floor(beatFrac) + 1;
    const sub = Math.floor((beatFrac % 1) * 960); // ticks
    return `${measure}:${beat}:${sub.toString().padStart(3, '0')}`;
  }, [transport.position]);

  const measureWidth = baseMeasureWidth * zoom;
  const playheadLeft = (transport.position / SECONDS_PER_MEASURE) * measureWidth;

  return (
    <Flex
      direction="column"
      style={StyleSheet.flatten([styles.root, isMobile && styles.rootMobile])}
      gap={isMobile ? 3 : 4}
    >
      {/* Transport */}
      <View style={[styles.transportBar, isMobile && styles.transportBarMobile]}>
        <Flex
          direction="row"
          align="center"
          gap={isMobile ? 6 : 8}
          wrap={isMobile ? 'wrap' : 'nowrap'}
          style={isMobile ? styles.transportControlsMobile : undefined}
        >
          <Button size="sm" variant="ghost" title="Play" onPress={togglePlay} startIcon={<Icon name={transport.playing ? 'pause' : 'play'} size="sm" />} />
          <Button size="sm" variant="ghost" title="Stop" onPress={stop} startIcon={<Icon name="stop" size="sm" />} />
          <ToggleButton value="loop" selected={transport.loop} onPress={toggleLoop} variant="ghost">
            <Icon name="repeat" size="sm" color={transport.loop ? 'primary' : 'gray'} />
          </ToggleButton>
          <Chip size="sm" variant="outline">{transport.bpm} BPM</Chip>
          <Chip size="sm" variant="outline">{transport.timeSig}</Chip>
        </Flex>
        <Block
          direction="row"
          align="center"
          gap={isMobile ? 6 : 8}
          wrap={isMobile ? 'wrap' : 'nowrap'}
          style={isMobile ? styles.transportControlsMobile : undefined}
        >
          <Text size="xs" color="muted">Zoom</Text>
          <Slider
            value={zoom * 50}
            onChange={(v: number) => setZoom(Math.max(0.5, Math.min(2, v / 50)))}
            style={StyleSheet.flatten([styles.slider, isMobile && styles.sliderMobile])}
            w={70}
          />
          <Text size="sm" weight="semibold" style={styles.timeDisplay}>{formattedTime}</Text>
        </Block>
      </View>

      {isMobile && (
        <Flex direction="row" align="center" justify="space-between" style={styles.mobileToggleRow}>
          <Text size="sm" color="muted">Track Controls</Text>
          <Button size="sm" variant="ghost" onPress={() => setShowTrackList(prev => !prev)}>
            {showTrackList ? 'Hide tracks' : 'Show tracks'}
          </Button>
        </Flex>
      )}

      {/* Tracks area */}
      <View style={[styles.tracksContainer, isMobile && styles.tracksContainerMobile]}>
        {/* Track list */}
        {(!isMobile || showTrackList) && (
          <ScrollView
            style={[styles.trackList, isTablet && styles.trackListTablet, isMobile && styles.trackListMobile]}
            contentContainerStyle={isMobile ? styles.trackListContentMobile : undefined}
            showsVerticalScrollIndicator={!isMobile}
          >
            {tracksMock.map(track => (
              <Flex
                key={track.id}
                direction="row"
                align="center"
                gap={6}
                style={StyleSheet.flatten([styles.trackRow, isMobile && styles.trackRowMobile])}
              >
                <View style={[styles.trackColorSwatch, { backgroundColor: track.color }]} />
                <Text size="sm" style={{ flex: 1 }}>{track.name}</Text>
                <ToggleButton value="m" size="xs" variant="ghost" selected={track.muted}>
                  <Icon name="volumeOff" size="sm" />
                </ToggleButton>
                <ToggleButton
                  value="favorite"
                  variant="ghost"
                  selected={track.solo}
                >
                  <Icon name="headphones" size={isMobile ? 20 : 24} color={track.solo ? 'red' : 'gray'} variant={track.solo ? 'filled' : 'outlined'} />
                </ToggleButton>

                <ToggleButton value="r" size="xs" variant="ghost" selected={track.armed}>
                  <Icon name="circle" size="sm" color={track.armed ? 'error' : undefined} />
                </ToggleButton>
              </Flex>
            ))}
          </ScrollView>
        )}

        {/* Timeline */}
        <ScrollView
          horizontal
          style={[styles.timeline, isMobile && styles.timelineMobile]}
          contentContainerStyle={{ paddingBottom: isMobile ? 24 : 40 }}
          showsHorizontalScrollIndicator={false}
        >
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
