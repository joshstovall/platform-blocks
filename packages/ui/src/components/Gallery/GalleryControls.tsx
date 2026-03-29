import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Text } from '../Text';
import { Icon } from '../Icon';
import type { GalleryControlsProps } from './types';

export const GalleryControls: React.FC<GalleryControlsProps> = ({
  currentIndex,
  totalImages,
  onPrevious,
  onNext,
  onClose,
  onDownload,
  showDownloadButton = true,
  image,
}) => {
  return (
    <>
      {/* Top Controls */}
      <View style={styles.topControls}>
        <TouchableOpacity style={styles.controlButton} onPress={onClose}>
          <Icon name="x" size={24} color="#fff" />
        </TouchableOpacity>
        
        <View style={styles.titleContainer}>
          {image?.title && (
            <Text style={styles.title}>
              {image.title}
            </Text>
          )}
          <Text style={styles.counter}>
            {currentIndex + 1} / {totalImages}
          </Text>
        </View>

        {showDownloadButton && onDownload && (
          <TouchableOpacity style={styles.controlButton} onPress={onDownload}>
            <Icon name="copy" size={24} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      {/* Navigation Controls */}
      {totalImages > 1 && (
        <>
          <TouchableOpacity
            style={[styles.navButton, styles.prevButton]}
            onPress={onPrevious}
            disabled={currentIndex === 0}
          >
            <Icon 
              name="chevron-left" 
              size={32} 
              color={currentIndex === 0 ? 'rgba(255,255,255,0.5)' : '#fff'} 
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navButton, styles.nextButton]}
            onPress={onNext}
            disabled={currentIndex === totalImages - 1}
          >
            <Icon 
              name="chevron-right" 
              size={32} 
              color={currentIndex === totalImages - 1 ? 'rgba(255,255,255,0.5)' : '#fff'} 
            />
          </TouchableOpacity>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  controlButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  counter: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginTop: 2,
  },
  navButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 30,
    height: 60,
    justifyContent: 'center',
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -30 }],
    width: 60,
    zIndex: 10,
  },
  nextButton: {
    right: 20,
  },
  prevButton: {
    left: 20,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 16,
  },
  topControls: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    left: 0,
    paddingHorizontal: 20,
    position: 'absolute',
    right: 0,
    top: Platform.OS === 'ios' ? 50 : 30,
    zIndex: 10,
  },
});
