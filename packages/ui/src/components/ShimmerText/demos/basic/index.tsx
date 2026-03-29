import { Column, ShimmerText } from '@platform-blocks/ui';

export default function Demo() {
  return (
    <Column gap="lg" align="flex-start">
      <ShimmerText size="xl" weight="bold">
        Weekly highlights go live
      </ShimmerText>
      <ShimmerText>
        New arrivals shimmer into view every Friday at noon.
      </ShimmerText>
    </Column>
  );
}