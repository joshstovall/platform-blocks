import type { ViewStyle } from 'react-native';
import type { PlatformBlocksTheme } from '../../core/theme/types';

// Centralized carousel style factory
export const getCarouselStyles = (theme: PlatformBlocksTheme) => ({
  container: {
    position: 'relative' as const,
  } as ViewStyle,
  scrollContainer: {
    overflow: 'hidden' as const,
  } as ViewStyle,
  contentContainer: {
    alignItems: 'center' as const,
  } as ViewStyle,
  itemContainer: {
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  } as ViewStyle,
  arrowContainer: {
    position: 'absolute' as const,
    top: '50%' as any,
    zIndex: 10,
    transform: [{ translateY: -20 }] as any,
  } as ViewStyle,
  leftArrowInside: {
    left: 16,
  } as ViewStyle,
  rightArrowInside: {
    right: 16,
  } as ViewStyle,
  leftArrowOutside: {
    left: -60,
  } as ViewStyle,
  rightArrowOutside: {
    right: -60,
  } as ViewStyle,
  arrowButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.gray[0],
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  } as ViewStyle,
  dotsContainer: {
    flexDirection: 'row' as const,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginTop: 16,
  } as ViewStyle,
  dot: {
    borderRadius: 50,
    marginHorizontal: 4,
    backgroundColor: theme.colors.gray[4],
    cursor: 'pointer',
  } as ViewStyle,
  activeDot: {
    backgroundColor: theme.colors.primary[6],
  } as ViewStyle,
});

// Dot size utility extracted for reuse and consistency
export const getDotSize = (size: 'sm' | 'md' | 'lg') => {
  switch (size) {
    case 'sm':
      return { width: 6, height: 6 };
    case 'md':
      return { width: 8, height: 8 };
    case 'lg':
      return { width: 10, height: 10 };
    default:
      return { width: 8, height: 8 };
  }
};
