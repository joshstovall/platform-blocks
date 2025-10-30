import { Rating, Text, Column, Block } from '@platform-blocks/ui';

export default function Demo() {
  return (
    <Column gap={16}>
      <Block>
        <Text mb="sm">Default Rating</Text>
        <Rating value={4} readOnly size="lg" />
      </Block>
      
      <Block>
        <Text mb="sm">Custom Color</Text>
        <Rating value={4} readOnly size="lg" color="#FF6B6B" />
      </Block>
      
      <Block>
        <Text mb="sm">Different Size</Text>
        <Rating value={3} readOnly size="xl" />
      </Block>
    </Column>
  );
}


