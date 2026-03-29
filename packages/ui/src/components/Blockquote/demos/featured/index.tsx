import { Blockquote } from '@platform-blocks/ui';

export default function Demo() {
  return (
    <Blockquote
      variant="featured"
      alignment="center"
      size="lg"
      quoteIconPosition="top-center"
      author={{
        name: 'Marie Curie',
        title: 'Physicist & Chemist',
      }}
      date="1903"
    >
      Nothing in life is to be feared, it is only to be understood.
    </Blockquote>
  );
}