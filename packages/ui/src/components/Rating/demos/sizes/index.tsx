import { Rating, Block } from '@platform-blocks/ui';

export default function Demo() {
  return (
    <Block gap={16}>
      <Rating value={4} readOnly size="xs" label="Extra Small" />
      <Rating value={4} readOnly size="sm" label="Small" />
      <Rating value={4} readOnly size="md" label="Medium" />
      <Rating value={4} readOnly size="lg" label="Large" />
      <Rating value={4} readOnly size="xl" label="Extra Large" />
    </Block>
  )
}