import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from '../Text';
import type { GalleryMetadataProps } from './types';

export const GalleryMetadata: React.FC<GalleryMetadataProps> = ({
  image,
  visible,
}) => {
  if (!visible || !image.metadata) return null;

  const metadata = image.metadata;

  const formatFileSize = (bytes?: string): string => {
    if (!bytes) return 'Unknown';
    if (typeof bytes === 'string') return bytes;
    return bytes;
  };

  const formatDimensions = (dimensions?: { width: number; height: number }): string => {
    if (!dimensions) return 'Unknown';
    return `${dimensions.width} × ${dimensions.height}`;
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {image.title && (
            <View style={styles.section}>
              <Text style={styles.label}>Title</Text>
              <Text style={styles.value}>{image.title}</Text>
            </View>
          )}

          {image.description && (
            <View style={styles.section}>
              <Text style={styles.label}>Description</Text>
              <Text style={styles.value}>{image.description}</Text>
            </View>
          )}

          {metadata.dimensions && (
            <View style={styles.section}>
              <Text style={styles.label}>Dimensions</Text>
              <Text style={styles.value}>{formatDimensions(metadata.dimensions)}</Text>
            </View>
          )}

          {metadata.size && (
            <View style={styles.section}>
              <Text style={styles.label}>File Size</Text>
              <Text style={styles.value}>{formatFileSize(metadata.size)}</Text>
            </View>
          )}

          {metadata.dateCreated && (
            <View style={styles.section}>
              <Text style={styles.label}>Date Created</Text>
              <Text style={styles.value}>{metadata.dateCreated}</Text>
            </View>
          )}

          {metadata.camera && (
            <View style={styles.section}>
              <Text style={styles.label}>Camera</Text>
              <Text style={styles.value}>{metadata.camera}</Text>
            </View>
          )}

          {metadata.location && (
            <View style={styles.section}>
              <Text style={styles.label}>Location</Text>
              <Text style={styles.value}>{metadata.location}</Text>
            </View>
          )}

          {/* Additional metadata */}
          {Object.entries(metadata)
            .filter(([key]) => !['size', 'dimensions', 'dateCreated', 'camera', 'location'].includes(key))
            .map(([key, value]) => (
              <View key={key} style={styles.section}>
                <Text style={styles.label}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
                <Text style={styles.value}>{String(value)}</Text>
              </View>
            ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 12,
    bottom: 100,
    padding: 16,
    position: 'absolute',
    right: 20,
    top: 100,
    width: 250,
    zIndex: 5,
  },
  content: {
    paddingBottom: 16,
  },
  label: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 12,
  },
  value: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 18,
  },
});
