import { useState } from 'react';
import { View, Alert } from 'react-native';
import { Gallery, Button, Card, Text } from '@platform-blocks/ui';
import type { GalleryItem } from '../../types';

const PRODUCT_IMAGES: GalleryItem[] = [
  {
    id: 'prod1',
    uri: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=600&fit=crop',
    title: 'Wireless Headphones',
    description: 'Premium noise-canceling headphones',
    metadata: {
      size: '1.5 MB',
      dimensions: { width: 1600, height: 1200 },
      dateCreated: 'March 8, 2024',
      camera: 'Studio Setup',
      location: 'Product Studio',
    },
  },
  {
    id: 'prod2',
    uri: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&h=600&fit=crop',
    title: 'Smartphone',
    description: 'Latest model with advanced features',
    metadata: {
      size: '1.8 MB',
      dimensions: { width: 1400, height: 1050 },
      dateCreated: 'March 12, 2024',
      camera: 'Professional Setup',
      location: 'Tech Studio',
    },
  },
];

export default function Demo() {
  const [activeGallery, setActiveGallery] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openGallery = (galleryType: string, index: number = 0) => {
    setCurrentIndex(index);
    setActiveGallery(galleryType);
  };

  const closeGallery = () => {
    setActiveGallery(null);
  };

  const handleDownload = (image: GalleryItem) => {
    Alert.alert(
      'Download Image',
      `Would you like to download "${image.title}"?\\n\\nFile: ${image.metadata?.size || 'Unknown size'}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Download', onPress: () => console.log('Downloading:', image.title) }
      ]
    );
  };

  return (
    <View style={{ padding: 20 }}>
      <Text variant="h3" style={{ marginBottom: 16 }}>
        Advanced Gallery Features
      </Text>

      <Card variant="outline" style={{ marginBottom: 24, padding: 16 }}>
        <Text variant="subtitle" style={{ marginBottom: 12 }}>
          📱 Minimal Gallery
        </Text>
        <Text variant="body" style={{ marginBottom: 16, color: '#666' }}>
          Clean interface with no thumbnails or metadata
        </Text>
        <Button
          title="Open Minimal Gallery"
          variant="outline"
          onPress={() => openGallery('minimal')}
        />
      </Card>

      <Card variant="outline" style={{ marginBottom: 24, padding: 16 }}>
        <Text variant="subtitle" style={{ marginBottom: 12 }}>
          💾 Custom Download Handler
        </Text>
        <Text variant="body" style={{ marginBottom: 16, color: '#666' }}>
          Gallery with custom download confirmation dialog
        </Text>
        <Button
          title="Open Gallery with Custom Actions"
          variant="outline"
          onPress={() => openGallery('custom')}
        />
      </Card>

      {/* Minimal Gallery */}
      <Gallery
        visible={activeGallery === 'minimal'}
        images={PRODUCT_IMAGES}
        initialIndex={currentIndex}
        onClose={closeGallery}
        showMetadata={false}
        showThumbnails={false}
        showDownloadButton={false}
        allowKeyboardNavigation={true}
        allowSwipeNavigation={true}
      />

      {/* Custom Gallery */}
      <Gallery
        visible={activeGallery === 'custom'}
        images={PRODUCT_IMAGES}
        initialIndex={currentIndex}
        onClose={closeGallery}
        onDownload={handleDownload}
        showMetadata={true}
        showThumbnails={true}
        showDownloadButton={true}
        allowKeyboardNavigation={true}
        allowSwipeNavigation={true}
      />
    </View>
  );
}
