import { Dimensions } from 'react-native';

/**
 * Calculate responsive width for social feed cards
 * @param idealWidth - The ideal width for the component
 * @param minWidth - The minimum allowed width
 * @param padding - Total horizontal padding to account for
 * @returns The calculated responsive width
 */
export function getResponsiveCardWidth(
  idealWidth: number = 460,
  minWidth: number = 280,
  padding: number = 32
): number {
  const screenWidth = Dimensions.get('window').width;
  return Math.max(minWidth, Math.min(idealWidth, screenWidth - padding));
}

/**
 * Get safe horizontal padding for centering content
 * @param contentWidth - The width of the content
 * @returns The padding needed to center the content
 */
export function getCenteringPadding(contentWidth: number): number {
  const screenWidth = Dimensions.get('window').width;
  return Math.max(0, (screenWidth - contentWidth) / 2);
}
