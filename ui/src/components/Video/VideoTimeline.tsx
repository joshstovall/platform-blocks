import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../core/theme';
import { useDirection } from '../../core/providers/DirectionProvider';
import { Text } from '../Text';
import type { VideoTimelineEvent } from './types';

interface VideoTimelineProps {
  timeline: VideoTimelineEvent[];
  duration: number;
  currentTime: number;
  onSeek: (time: number) => void;
  style?: ViewStyle;
}

const EVENT_TYPE_COLORS = {
  marker: '#FF6B6B',
  chapter: '#4ECDC4',
  annotation: '#45B7D1',
  cue: '#FFA07A',
  custom: '#98D8C8',
};

export function VideoTimeline({
  timeline,
  duration,
  currentTime,
  onSeek,
  style
}: VideoTimelineProps) {
  const theme = useTheme();
  const { isRTL } = useDirection();
  
  if (duration === 0 || timeline.length === 0) {
    return null;
  }
  
  const handleMarkerPress = (event: VideoTimelineEvent) => {
    onSeek(event.time);
  };
  
  const styles = StyleSheet.create({
    activeMarker: {
      borderRadius: 2,
      height: 8,
      top: -1,
      width: 4,
    },
    container: {
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      height: 6,
      left: 0,
      position: 'absolute',
      right: 0,
      top: 0,
    },
    marker: {
      borderRadius: 1.5,
      height: '100%',
      position: 'absolute',
      width: 3,
    },
    markerTooltip: {
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      borderRadius: 4,
      bottom: 8,
      minWidth: 60,
      padding: 4,
      position: 'absolute',
    },
    tooltipText: {
      color: 'white',
      fontSize: 10,
      textAlign: 'center',
    },
  });
  
  return (
    <View style={[styles.container, style]}>
      {timeline.map((event, index) => {
        const position = (event.time / duration) * 100;
        const isActive = Math.abs(currentTime - event.time) < 1; // Within 1 second
        const color = EVENT_TYPE_COLORS[event.type] || EVENT_TYPE_COLORS.custom;
        
        return (
          <TouchableOpacity
            key={`${event.id}-${index}`}
            style={[
              styles.marker,
              isActive && styles.activeMarker,
              {
                ...(isRTL ? { right: `${position}%` } : { left: `${position}%` }),
                backgroundColor: color,
              }
            ]}
            onPress={() => handleMarkerPress(event)}
            accessible
            accessibilityLabel={`Jump to ${event.type} at ${Math.floor(event.time / 60)}:${(event.time % 60).toFixed(0).padStart(2, '0')}`}
          >
            {isActive && event.data?.title && (
              <View style={styles.markerTooltip}>
                <Text style={styles.tooltipText}>
                  {event.data.title}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}