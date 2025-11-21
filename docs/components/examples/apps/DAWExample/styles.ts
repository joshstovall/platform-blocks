import type { PlatformBlocksTheme } from '@platform-blocks/ui';
import { StyleSheet } from 'react-native';

export const createDAWStyles = (theme: PlatformBlocksTheme) => StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colorScheme === 'dark' ? '#0f1115' : '#111827',
    paddingTop: 12,
    paddingHorizontal: 24
  },
  rootMobile: {
    paddingHorizontal: 12
  },
  transportBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
  },
  transportBarMobile: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 16,
  },
  transportControlsMobile: {
    width: '100%',
  },
  slider: {
    width: 160,
  },
  sliderMobile: {
    width: '100%',
    minWidth: 140,
    flexGrow: 1,
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
  tracksContainerMobile: {
    flexDirection: 'column',
  },
  trackList: {
    width: 250,
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 250,
    borderRightWidth: 1,
    borderRightColor: '#1f2937'
  },
  trackListTablet: {
    width: 180,
    flexBasis: 180,
  },
  trackListMobile: {
    width: '100%',
    flexBasis: 'auto',
    flexGrow: 0,
    maxHeight: 220,
    borderRightWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937'
  },
  trackListContentMobile: {
    paddingBottom: 12,
  },
  timeline: {
    flex: 1,
    position: 'relative',
    width: '100%',
  },
  timelineMobile: {
    marginTop: 12,
  },
  trackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937'
  },
  trackRowMobile: {
    paddingHorizontal: 16,
  },
  mobileToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
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
