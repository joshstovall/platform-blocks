export interface GalleryItem {
  id: string;
  uri: string;
  title?: string;
  description?: string;
  metadata?: {
    size?: string;
    dimensions?: {
      width: number;
      height: number;
    };
    dateCreated?: string;
    camera?: string;
    location?: string;
    [key: string]: any;
  };
}

export interface GalleryProps {
  images: GalleryItem[];
  initialIndex?: number;
  onClose?: () => void;
  onImageChange?: (index: number, image: GalleryItem) => void;
  onDownload?: (image: GalleryItem) => void;
  showMetadata?: boolean;
  showThumbnails?: boolean;
  showDownloadButton?: boolean;
  allowKeyboardNavigation?: boolean;
  allowSwipeNavigation?: boolean;
  overlayOpacity?: number;
  animationDuration?: number;
}

export interface GalleryModalProps extends GalleryProps {
  visible: boolean;
}

export interface GalleryThumbnailProps {
  images: GalleryItem[];
  currentIndex: number;
  onThumbnailPress: (index: number) => void;
  thumbnailSize?: number;
}

export interface GalleryImageProps {
  image: GalleryItem;
  onLoad?: () => void;
  onError?: () => void;
  resizeMode?: 'contain' | 'cover' | 'stretch' | 'center';
}

export interface GalleryControlsProps {
  currentIndex: number;
  totalImages: number;
  onPrevious: () => void;
  onNext: () => void;
  onClose: () => void;
  onDownload?: () => void;
  showDownloadButton?: boolean;
  image?: GalleryItem;
}

export interface GalleryMetadataProps {
  image: GalleryItem;
  visible: boolean;
}

export type GalleryNavigationDirection = 'previous' | 'next';

export interface GalleryGestureState {
  translationX: number;
  translationY: number;
  velocityX: number;
  velocityY: number;
  scale: number;
}
