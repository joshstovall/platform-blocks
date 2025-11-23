import { useState } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { Gallery, Button, Card, Text, Flex } from '@platform-blocks/ui';
import type { GalleryItem } from '../../types';

// Sample images for the gallery
const SAMPLE_IMAGES: GalleryItem[] = [
  {
    id: '1',
    uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    title: 'Mountain Landscape',
    description: 'Beautiful mountain view with snow-capped peaks',
    metadata: {
      size: '2.4 MB',
      dimensions: { width: 1920, height: 1080 },
      dateCreated: 'March 15, 2024',
      camera: 'Canon EOS R5',
      location: 'Swiss Alps',
    },
  },
  {
    id: '2',
    uri: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop',
    title: 'Forest Path',
    description: 'A serene path through the forest',
    metadata: {
      size: '1.8 MB',
      dimensions: { width: 1600, height: 1200 },
      dateCreated: 'April 2, 2024',
      camera: 'Sony A7 III',
      location: 'Pacific Northwest',
    },
  },
  {
    id: '3',
    uri: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
    title: 'Dense Forest',
    description: 'Tall trees reaching toward the sky',
    metadata: {
      size: '3.1 MB',
      dimensions: { width: 2048, height: 1536 },
      dateCreated: 'May 18, 2024',
      camera: 'Nikon D850',
      location: 'Redwood National Park',
    },
  },
];

export default function Demo() {
  const [galleryVisible, setGalleryVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openGallery = (index: number = 0) => {
    setCurrentIndex(index);
    setGalleryVisible(true);
  };

  const handleDownload = (image: GalleryItem) => {
    alert(`Downloading: ${image.title}`);
  };

  return (
    <View style={{ padding: 20 }}>
      <Text variant="h3" style={{ marginBottom: 16 }}>
        Gallery Demo
      </Text>
      
      <Text variant="p" style={{ marginBottom: 24, color: '#666' }}>
        Tap any image below to open the fullscreen gallery viewer.
      </Text>

      <View style={{ marginBottom: 24 }}>
        <Flex direction="row" style={{ flexWrap: 'wrap', gap: 12 }}>
          {SAMPLE_IMAGES.map((image, index) => (
            <TouchableOpacity
              key={image.id}
              onPress={() => openGallery(index)}
            >
              <Card
                variant="outline"
                style={{ 
                  width: 150, 
                  height: 120, 
                  padding: 8,
                  overflow: 'hidden'
                }}
              >
                <Image 
                  source={{ uri: image.uri }}
                  style={{ 
                    width: '100%', 
                    height: 90, 
                    borderRadius: 8,
                    marginBottom: 8,
                  }}
                  resizeMode="cover"
                />
                <Text variant="small" style={{ textAlign: 'center' }}>
                  {image.title}
                </Text>
              </Card>
            </TouchableOpacity>
          ))}
        </Flex>
      </View>

      <Button
        title="🖼️ Open Gallery"
        variant="filled"
        onPress={() => openGallery(0)}
      />

      <Gallery
        visible={galleryVisible}
        images={SAMPLE_IMAGES}
        initialIndex={currentIndex}
        onClose={() => setGalleryVisible(false)}
        onImageChange={(index: number, image: GalleryItem) => {
          setCurrentIndex(index);
          console.log('Changed to:', image.title);
        }}
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
