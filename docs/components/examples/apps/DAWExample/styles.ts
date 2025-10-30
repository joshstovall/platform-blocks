import type { PlatformBlocksTheme } from '@platform-blocks/ui';
import { StyleSheet } from 'react-native';

export const createDAWStyles = (theme: PlatformBlocksTheme) => StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colorScheme === 'dark' ? '#0f1115' : '#111827',
    paddingTop: 12
  },
  transportBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
  },
  timeDisplay: {
    fontVariant: ['tabular-nums'],
    letterSpacing: 1
  },
  tracksContainer: {
    flexDirection: 'row',
    flex: 1,
    marginTop: 8,
    width: '100%',
  },
  trackList: {
    width: 160,
    borderRightWidth: 1,
    borderRightColor: '#1f2937'
  },
  timeline: {
    flex: 1,
    position: 'relative'
  },
  trackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937'
  },
  trackColorSwatch: {
    width: 10,
    height: 32,
    borderRadius: 2,
    marginRight: 8
  },
  controlButton: {
    width: 36,
    height: 36,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center'
  },
  clipsLane: {
    height: 44,
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937'
  },
  clip: {
    position: 'absolute',
    top: 4,
    height: 36,
    borderRadius: 4,
    paddingHorizontal: 6,
    justifyContent: 'center'
  },
  ruler: {
    flexDirection: 'row',
    height: 28,
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937'
  },
  measureMarker: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'center'
  },
  playhead: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: '#f59e0b'
  }
});
