import { Blockquote, Column, Text } from '@platform-blocks/ui';

export default function BlockquoteVariantsDemo() {
  return (
    <Column gap="xl">
      <Text variant="h4">Default Variant</Text>
      <Blockquote 
        author={{ name: 'Anonymous' }}
      >
        The best way to predict the future is to create it.
      </Blockquote>

      <Text variant="h4">Testimonial Variant</Text>
      <Blockquote
        variant="testimonial"
        author={{
          name: 'Sarah Johnson',
          title: 'Marketing Director',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
        }}
        rating={{ value: 4, max: 5 }}
        shadow
      >
        Great experience with this service. The team was professional and delivered quality results.
      </Blockquote>

      <Text variant="h4">Featured Variant</Text>
      <Blockquote
        variant="featured"
        alignment="center"
        author={{
          name: 'Albert Einstein',
          title: 'Theoretical Physicist'
        }}
      >
        Imagination is more important than knowledge.
      </Blockquote>

      <Text variant="h4">Minimal Variant</Text>
      <Blockquote
        variant="minimal"
        quoteIconPosition="none"
        author={{ name: '@username' }}
        source={{ name: 'Twitter', brand: 'x' }}
        date="2 hours ago"
      >
        Just discovered this amazing new feature! 🚀
      </Blockquote>
    </Column>
  );
}