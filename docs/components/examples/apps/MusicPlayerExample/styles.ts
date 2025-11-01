import { StyleSheet } from 'react-native';
import { PlatformBlocksTheme } from '@platform-blocks/ui';
import { platformShadow } from '../../../../utils/platformShadow';

export const createMusicPlayerStyles = (theme: PlatformBlocksTheme) => StyleSheet.create({

  wrapperContent: {
    padding: 0,
  },
  
  // Sidebar
  sidebar: {
    width: 240,
    backgroundColor: theme.backgrounds.surface,
    padding: 24,
    paddingTop: 24,
  },
  logoContainer: {
    marginBottom: 32,
  },
  spotifyLogo: {
    color: theme.text.primary,
    fontSize: 24,
    fontWeight: 'bold',
  },
  navigation: {
    marginBottom: 32,
    gap: 16,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 8,
  },
  navText: {
    color: theme.text.secondary,
    fontSize: 14,
    fontWeight: '500',
  },
  playlistsContainer: {
    flex: 1,
  },
  playlistsTitle: {
    color: theme.text.secondary,
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    marginBottom: 16,
  },
  playlistItem: {
    paddingVertical: 8,
  },
  playlistText: {
    color: theme.text.secondary,
    fontSize: 14,
  },

  // Main Content
  mainContent: {
    flex: 1,
    backgroundColor: theme.backgrounds.base,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 16,
  },
  navButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.backgrounds.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userSection: {
    backgroundColor: theme.backgrounds.surface,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  userName: {
    color: theme.text.primary,
    fontSize: 14,
    fontWeight: '600',
  },

  // Album Section
  albumSection: {
    flexDirection: 'row',
    padding: 32,
    gap: 32,
    alignItems: 'flex-end',
  },
  albumArt: {
    width: 232,
    height: 232,
    borderRadius: 8,
    backgroundColor: theme.backgrounds.surface,
    elevation: 8,
    ...platformShadow({ color: '#000000', opacity: 0.6, offsetY: 8, radius: 24, elevation: 8 }),
    overflow: 'hidden',
  },
  albumArtImage: {
    width: '100%',
    height: '100%',
  },
  albumArtFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  albumArtIcon: {
    color: theme.text.secondary,
    fontSize: 48,
  },
  albumInfo: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  albumType: {
    color: theme.text.primary,
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 8,
  },
  trackTitle: {
    color: theme.text.primary,
    fontSize: 48,
    fontWeight: 'bold',
    lineHeight: 52,
    marginBottom: 16,
  },
  artistInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  artistName: {
    color: theme.text.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  albumDetails: {
    color: theme.text.secondary,
    fontSize: 14,
  },

  // Track Controls
  trackControls: {
    paddingHorizontal: 32,
    paddingBottom: 24,
  position: 'relative',
  zIndex: 2000,
  },
  spotifyPlayButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary[5],
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreOptions: {
    color: theme.text.secondary,
    fontSize: 20,
    fontWeight: 'bold',
  },
  moreMenu: {
    position: 'absolute',
    backgroundColor: theme.backgrounds.surface,
    borderWidth: 1,
    borderColor: theme.backgrounds.border,
    borderRadius: 8,
    paddingVertical: 4,
    minWidth: 160,
    zIndex: 10000,
    pointerEvents: 'auto',
    ...platformShadow({ color: '#000', opacity: 0.3, offsetY: 4, radius: 8, elevation: 12 }),
  },
  moreMenuItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  moreMenuItemText: {
    color: theme.text.primary,
  },

  // Queue Section
  queueSection: {
    flex: 1,
    paddingHorizontal: 32,
  },
  queueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 1,
    borderRadius: 4,
    gap: 16,
  },
  activeQueueItem: {
    backgroundColor: theme.backgrounds.surface,
  },
  queueNumber: {
    width: 16,
    alignItems: 'center',
  },
  queueNumberText: {
    color: theme.text.secondary,
    fontSize: 14,
  },
  queueCover: {
    width: 40,
    height: 40,
    borderRadius: 4,
    backgroundColor: theme.backgrounds.surface,
    overflow: 'hidden',
  },
  queueCoverImage: {
    width: '100%',
    height: '100%',
  },
  queueCoverFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  queueCoverIcon: {
    color: theme.text.secondary,
    fontSize: 16,
  },
  queueTrackInfo: {
    flex: 1,
  },
  queueTrackTitle: {
    color: theme.text.primary,
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 2,
  },
  queueArtist: {
    color: theme.text.secondary,
    fontSize: 12,
  },
  queueDuration: {
    color: theme.text.secondary,
    fontSize: 12,
  },

  // Bottom Player
  bottomPlayer: {
    position: 'fixed' as any,
    bottom: 0,
    left: 0,
    right: 0,
    height: 90,
    backgroundColor: theme.backgrounds.surface,
    borderTopWidth: 1,
    borderTopColor: theme.backgrounds.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    gap: 16,
    zIndex: 20,
  },
  currentTrack: {
    flex: 1,
    maxWidth: 360,
  },
  currentTrackThumb: {
    width: 56,
    height: 56,
    borderRadius: 4,
    backgroundColor: theme.backgrounds.surface,
    overflow: 'hidden',
  },
  currentTrackThumbImage: {
    width: '100%',
    height: '100%',
  },
  currentTrackThumbFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentTrackIcon: {
    color: theme.text.secondary,
    fontSize: 20,
  },
  currentTrackInfo: {
    flex: 1,
    marginLeft: 12,
  },
  currentTrackTitle: {
    color: theme.text.primary,
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 2,
  },
  currentTrackArtist: {
    color: theme.text.secondary,
    fontSize: 11,
  },
  heartButton: {
    padding: 8,
  },

  // Player Controls (Center)
  playerControls: {
    flex: 2,
    alignItems: 'center',
  },
  bottomPlayButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary[5],
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
    width: '100%',
  },
  progressTime: {
    color: theme.text.secondary,
    fontSize: 11,
    minWidth: 40,
    textAlign: 'center',
  },
  progressSlider: {
    flex: 1,
  },

  // Volume Controls (Right)
  volumeControls: {
    flex: 1,
    maxWidth: 180,
    justifyContent: 'flex-end',
  },
  volumeSlider: {
    width: 93,
  },

});
