import React, { useState, useEffect, useMemo } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Text, Flex, Slider, useTheme, ToggleButton, Button, CopyButton, Menu, MenuItem, MenuDropdown, Card, Image } from '@platform-blocks/ui';
import { Icon } from '@platform-blocks/ui';
import { PageWrapper } from '../../../../components/PageWrapper';
import { Track, RepeatMode } from './types';
import { tracks } from './mockData';
import { createMusicPlayerStyles } from './styles';
import { useResponsive } from '../../../../hooks/useResponsive';

// Generate mock waveform data
const generateWaveform = (duration: number) => {
  const bars = 50;
  return Array.from({ length: bars }, () => Math.random() * 40 + 10);
};

export function MusicPlayerExample() {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(75);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<RepeatMode>('off');
  const [isUserSeeking, setIsUserSeeking] = useState(false);
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>({});
  const [likedTracks, setLikedTracks] = useState<Set<number>>(new Set());

  const theme = useTheme();
  const styles = createMusicPlayerStyles(theme);
  const { isMobile } = useResponsive();
  const currentTrackData = tracks[currentTrack];

  // Generate waveform for current track
  const waveformData = useMemo(() =>
    generateWaveform(currentTrackData.duration),
    [currentTrackData.duration]
  );

  const handleImageError = (trackId: number) => {
    setImageErrors(prev => ({ ...prev, [trackId]: true }));
  };

  // Simulate playback progress
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && !isUserSeeking) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1;
          if (newTime >= currentTrackData.duration) {
            // Auto-advance to next track
            nextTrack();
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTrackData.duration, isUserSeeking]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    if (shuffle) {
      const randomTrack = Math.floor(Math.random() * tracks.length);
      setCurrentTrack(randomTrack);
    } else {
      setCurrentTrack((prev) => (prev + 1) % tracks.length);
    }
    setCurrentTime(0);
  };

  const previousTrack = () => {
    if (currentTime > 5) {
      // If more than 5 seconds played, restart current track
      setCurrentTime(0);
    } else {
      setCurrentTrack((prev) => (prev - 1 + tracks.length) % tracks.length);
      setCurrentTime(0);
    }
  };

  const seekTo = (position: number) => {
    const newTime = Math.floor((position / 100) * currentTrackData.duration);
    setCurrentTime(newTime);
  };

  const handleSliderChange = (value: number) => {
    setIsUserSeeking(true);
    setCurrentTime(value);
    // Reset seeking state after a short delay
    setTimeout(() => setIsUserSeeking(false), 100);
  };

  const toggleShuffle = () => {
    setShuffle(!shuffle);
  };

  const toggleRepeat = () => {
    const modes: RepeatMode[] = ['off', 'all', 'one'];
    const currentIndex = modes.indexOf(repeat);
    setRepeat(modes[(currentIndex + 1) % modes.length]);
  };

  const progress = (currentTime / currentTrackData.duration) * 100;

  const selectTrack = (index: number) => {
    setCurrentTrack(index);
    setCurrentTime(0);
  };

  return (
    <PageWrapper>
      {/* Album/Track Details */}
      <Flex
        direction={isMobile ? 'column' : 'row'}
        align={isMobile ? 'stretch' : 'flex-end'}
        gap={isMobile ? 16 : 32}
        style={StyleSheet.flatten([styles.albumSection, isMobile && styles.albumSectionMobile])}
      >
        <Card
          shadow="lg"
          radius="md"
          p={0}
          style={StyleSheet.flatten([styles.albumArt, isMobile && styles.albumArtMobile])}
        >
          {imageErrors[currentTrackData.id] ? (
            <Flex align="center" justify="center" style={{ flex: 1 }}>
              <Text size="xl" color={theme.text.secondary}>♪</Text>
            </Flex>
          ) : (
              <Image
                src={currentTrackData.cover}
                style={styles.albumArtImage}
                imageStyle={styles.albumArtImage}
                onError={() => handleImageError(currentTrackData.id)}
                resizeMode="cover"
              />
          )}
        </Card>

        <Flex
          direction="column"
          justify="flex-end"
          style={StyleSheet.flatten([styles.albumInfo, isMobile && styles.albumInfoMobile])}
        >
          <Text style={StyleSheet.flatten([styles.albumType, isMobile && styles.albumTypeMobile])}>SONG</Text>
          <Text
            style={StyleSheet.flatten([styles.trackTitle, isMobile && styles.trackTitleMobile])}
          >
            {currentTrackData.title}
          </Text>
          <Flex
            direction="row"
            align="center"
            wrap={isMobile ? 'wrap' : 'nowrap'}
            gap={isMobile ? 6 : 12}
            style={StyleSheet.flatten([styles.artistInfo, isMobile && styles.artistInfoMobile])}
          >
            <Text style={StyleSheet.flatten([styles.artistName, isMobile && styles.artistNameMobile])}>
              {currentTrackData.artist}
            </Text>
            <Text style={StyleSheet.flatten([styles.albumDetails, isMobile && styles.albumDetailsMobile])}>
              • 2024 • {formatTime(currentTrackData.duration)}
            </Text>
          </Flex>
        </Flex>
      </Flex>

      {/* Track Controls */}
      <Flex
        direction="row"
        align="center"
        gap={isMobile ? 16 : 24}
        wrap={isMobile ? 'wrap' : 'nowrap'}
        style={StyleSheet.flatten([styles.trackControls, isMobile && styles.trackControlsMobile])}
      >
        <Button
          onPress={togglePlayPause}
          variant="gradient"
          size="lg"
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: theme.colors.primary[5],
          }}
        >
          <Icon name={isPlaying ? 'pause' : 'play'} size="xl" color="black" />
        </Button>
        <ToggleButton
          value="liked"
          variant="ghost"
          selected={likedTracks?.has(currentTrackData.id)}
          onPress={() => {
            setLikedTracks(prev => {
              const next = new Set(prev);
              if (next.has(currentTrackData.id)) next.delete(currentTrackData.id); else next.add(currentTrackData.id);
              return next;
            });
          }}
          style={{ width: 40, height: 40, paddingHorizontal: 0 }}
        >
          <Icon
            name="heart"
            variant={likedTracks?.has(currentTrackData.id) ? 'filled' : 'outlined'}
            size="lg"
            color={likedTracks?.has(currentTrackData.id) ? theme.colors.error[5] : 'white'}
          />
        </ToggleButton>
        <CopyButton
          value={currentTrackData.title}
          mode="icon"
          iconName="link"
          copiedIconName="check-square"
          iconColor="white"
          copiedIconColor="#22c55e"
          size="sm"
          tooltip="Copy track title"
        />
        <Menu position="bottom-start" >
          <Button
            size="sm"
            variant="ghost"
            icon={<Icon name="ellipsis" size="md" color={theme.text.secondary} variant="filled" />}
            title=""
            style={{ minWidth: 32, minHeight: 32, paddingHorizontal: 6 }}
          />
          <MenuDropdown>
            <MenuItem startSection={<Icon name="plus" size="sm" />}>
              Add to Playlist
            </MenuItem>
            <MenuItem startSection={<Icon name="share" size="sm" />}>
              Share
            </MenuItem>
            <MenuItem startSection={<Icon name="user" size="sm" />}>
              View Artist
            </MenuItem>
            <MenuItem startSection={<Icon name="flag" size="sm" />} color="danger">
              Report
            </MenuItem>
          </MenuDropdown>
        </Menu>
      </Flex>

      {/* Queue */}
      <View style={StyleSheet.flatten([styles.queueSection, isMobile && styles.queueSectionMobile])}>
        {tracks.map((track, index) => (
          <Pressable
            key={track.id}
            style={StyleSheet.flatten([
              styles.queueItem,
              index === currentTrack && styles.activeQueueItem,
              isMobile && styles.queueItemMobile
            ])}
            onPress={() => selectTrack(index)}
          >
            <View style={styles.queueNumber}>
              {index === currentTrack && isPlaying ? (
                <Icon name="play" size="sm" color={theme.colors.primary[5]} />
              ) : (
                <Text size="sm" style={styles.queueNumberText}>{index + 1}</Text>
              )}
            </View>
            <View style={styles.queueCover}>
              {imageErrors[track.id] ? (
                <View style={styles.queueCoverFallback}>
                  <Text size="xs" style={styles.queueCoverIcon}>♪</Text>
                </View>
              ) : (
                  <Image
                    src={track.cover}
                  style={{ width: '100%', height: '100%' }}
                  imageStyle={{ width: '100%', height: '100%' }}
                  onError={() => handleImageError(track.id)}
                  resizeMode="cover"
                />
              )}
            </View>
            <View style={styles.queueTrackInfo}>
              <Text size="sm" weight="medium" style={[
                styles.queueTrackTitle,
                index === currentTrack && { color: '#1DB954' }
              ]}>
                {track.title}
              </Text>
              <Text size="xs" style={styles.queueArtist}>{track.artist}</Text>
            </View>
            <Text size="xs" style={styles.queueDuration}>{formatTime(track.duration)}</Text>
          </Pressable>
        ))}
      </View>

      {/* Bottom Player Bar */}
      <View style={StyleSheet.flatten([styles.bottomPlayer, isMobile && styles.bottomPlayerMobile])}>
        {/* Left: Current Track */}
        <Flex
          direction="row"
          align={isMobile ? 'flex-start' : 'center'}
          gap={12}
          wrap={isMobile ? 'wrap' : 'nowrap'}
          style={StyleSheet.flatten([styles.currentTrack, isMobile && styles.currentTrackMobile])}
        >
          <View style={styles.currentTrackThumb}>
            {imageErrors[currentTrackData.id] ? (
              <View style={styles.currentTrackThumbFallback}>
                <Text size="sm" style={styles.currentTrackIcon}>♪</Text>
              </View>
            ) : (
                <Image
                  src={currentTrackData.cover}
                style={{ width: '100%', height: '100%' }}
                imageStyle={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
            )}
          </View>
          <View style={StyleSheet.flatten([styles.currentTrackInfo, isMobile && styles.currentTrackInfoMobile])}>
            <Text size="sm" weight="medium" style={styles.currentTrackTitle}>
              {currentTrackData.title}
            </Text>
            <Text size="xs" style={styles.currentTrackArtist}>
              {currentTrackData.artist}
            </Text>
          </View>
          <ToggleButton
            value="like-main"
            size="sm"
            variant="ghost"
            selected={likedTracks.has(currentTrackData.id)}
            onPress={() => {
              setLikedTracks(prev => {
                const next = new Set(prev);
                if (next.has(currentTrackData.id)) next.delete(currentTrackData.id); else next.add(currentTrackData.id);
                return next;
              });
            }}
          >
            <Icon
              name="heart"
              variant={likedTracks.has(currentTrackData.id) ? 'filled' : 'outlined'}
              size="sm"
              color={likedTracks.has(currentTrackData.id) ? theme.colors.error[5] : theme.text.secondary}
            />
          </ToggleButton>
        </Flex>

        {/* Center: Player Controls */}
        <View style={StyleSheet.flatten([styles.playerControls, isMobile && styles.playerControlsMobile])}>
          <Flex direction="row" align="center" justify="center" gap={isMobile ? 12 : 16}>
            <ToggleButton
              value="shuffle"
              size="sm"
              variant="ghost"
              selected={shuffle}
              onPress={toggleShuffle}
            >
              <Icon name={shuffle ? 'star' : 'star-outline'} size="sm" color={shuffle ? theme.colors.primary[5] : theme.text.secondary} />
            </ToggleButton>
            <Pressable onPress={previousTrack}>
              <Icon name="chevronLeft" size="md" color="white" />
            </Pressable>
            <Pressable onPress={togglePlayPause} style={styles.bottomPlayButton}>
              <Icon name={isPlaying ? 'pause' : 'play'} size="md" color="black" />
            </Pressable>
            <Pressable onPress={nextTrack}>
              <Icon name="chevronRight" size="md" color="white" />
            </Pressable>
            <ToggleButton
              value="repeat"
              size="sm"
              variant="ghost"
              selected={repeat !== 'off'}
              onPress={toggleRepeat}
            >
              <Icon name={repeat === 'one' ? 'chevronUp' : 'chevronDown'} size="sm" color={repeat !== 'off' ? theme.colors.primary[5] : theme.text.secondary} />
            </ToggleButton>
          </Flex>

          <View style={StyleSheet.flatten([styles.progressBar, isMobile && styles.progressBarMobile])}>
            <Text size="xs" style={styles.progressTime}>
              {formatTime(currentTime)}
            </Text>
            <Slider
              value={currentTime}
              min={0}
              max={currentTrackData.duration}
              onChange={handleSliderChange}
              style={StyleSheet.flatten([styles.progressSlider, isMobile && styles.progressSliderMobile])}
            />
            <Text size="xs" style={styles.progressTime}>
              {formatTime(currentTrackData.duration)}
            </Text>
          </View>
        </View>

        {/* Right: Volume & Controls */}
        <Flex
          direction="row"
          align="center"
          gap={12}
          wrap={isMobile ? 'wrap' : 'nowrap'}
          justify={isMobile ? 'space-between' : 'flex-end'}
          style={StyleSheet.flatten([styles.volumeControls, isMobile && styles.volumeControlsMobile])}
        >
          <ToggleButton value="like-bar" size="sm" variant="ghost" selected={false} onPress={() => { }}>
            <Icon name="heart" size="sm" color={theme.text.secondary} />
          </ToggleButton>
          <ToggleButton value="favorite-bar" size="sm" variant="ghost" selected={false} onPress={() => { }}>
            <Icon name="star" size="sm" color={theme.text.secondary} />
          </ToggleButton>
          <Icon name="eye" size="sm" color={theme.text.primary} />
          <Slider
            value={volume}
            min={0}
            max={100}
            onChange={setVolume}
            style={StyleSheet.flatten([styles.volumeSlider, isMobile && styles.volumeSliderMobile])}
          />
        </Flex>
      </View>
      {/* </View> */}
    </PageWrapper>
  );
}
