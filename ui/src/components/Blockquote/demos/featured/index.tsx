import { Blockquote } from '@platform-blocks/ui';

export default function BlockquoteFeaturedDemo() {
  return (
    <Blockquote
      variant="featured"
      alignment="center"
      size="lg"
      quoteIconPosition="top-center"
      author={{
        name: 'Marie Curie',
        title: 'Nobel Prize Winner'
      }}
      date="1903"
    >
      Nothing in life is to be feared, it is only to be understood.
    </Blockquote>
  );
}