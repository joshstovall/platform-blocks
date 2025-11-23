import React, { useCallback, useMemo, useState } from 'react';
import { View, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Masonry, Card, Text, Flex, useTheme, Gallery, Block, Loader, Small, Image } from '@platform-blocks/ui';
import type { MasonryItem } from '@platform-blocks/ui';
import type { GalleryItem } from '@platform-blocks/ui';

import { PHOTOS, createMorePhotos } from './mockData';

export function PhotoGalleryExample() {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const [photos, setPhotos] = useState(PHOTOS);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const galleryImages: GalleryItem[] = useMemo(() => {
    return photos.map(p => ({ id: p.id, uri: p.uri, title: p.title, description: p.subtitle }));
  }, [photos]);

  const masonryItems: MasonryItem[] = useMemo(() => {
    return photos.map((p, idx) => ({
      id: p.id,
      heightRatio: p.ratio,
      content: (
        <TouchableOpacity onPress={() => { setLightboxIndex(idx); setLightboxOpen(true); }}>
         
            <Image
              src={p.uri}
              width="100%"
              aspectRatio={p.ratio}
              resizeMode="cover"
            />
            <Flex direction="row" align="center" justify="space-between" style={{ padding: 8 }}>
              <Text size="sm" weight="medium">{p.title}</Text>
              {p.subtitle ? (
                <Text size="xs" color="muted">{p.subtitle}</Text>
              ) : null}
            </Flex>
        </TouchableOpacity>
      ),
    }));
  }, [photos]);

  const loadMore = useCallback(() => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);
    // Simulate network latency
    setTimeout(() => {
      setPhotos(prev => [...prev, ...createMorePhotos(prev.length, 24)]);
      setIsLoadingMore(false);
    }, 600);
  }, [isLoadingMore]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colorScheme === 'dark' ? '#0B0B0B' : '#FAFAFA' }}>
      <View style={{ paddingTop: 8, paddingHorizontal: 12, paddingBottom: 4 }}>
        <Text size="xl" weight="semibold">Photo Gallery</Text>
        <Text size="sm" color="muted">Masonry grid with infinite scroll and fullscreen lightbox</Text>
      </View>
      <Masonry
        data={masonryItems}
        numColumns={width < 600 ? 2 : width < 1024 ? 3 : 4}
        gap="sm"
        flashListProps={{
          onEndReached: loadMore,
          onEndReachedThreshold: 0.6,
          ListFooterComponent: isLoadingMore ? (
            <Block p="md" align="center" gap={8}>
              <Loader size="xl" />
              <Small color="muted">Loading more photos…</Small>
            </Block>
          ) : null,
        }}
        style={{ flex: 1 }}
      />

      <Gallery
        visible={lightboxOpen}
        images={galleryImages}
        initialIndex={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
        showThumbnails
        showMetadata={false}
        allowKeyboardNavigation
        allowSwipeNavigation
      />
    </View>
  );
}

export default PhotoGalleryExample;
