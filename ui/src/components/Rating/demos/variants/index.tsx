import { Rating, Text, Column, Block } from '@platform-blocks/ui';

export default function Demo() {
  return (
    <Block gap={16}>
      <Rating value={4} readOnly size="lg" label="Default Rating" />
      <Rating value={4} readOnly size="lg" color="#FF6B6B" label="Custom Color" />
      <Rating value={3} readOnly size="xl" label="Different Size" />
    </Block>
  );
}


