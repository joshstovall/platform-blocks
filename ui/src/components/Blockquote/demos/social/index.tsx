import { Blockquote, Column, Text } from '@platform-blocks/ui';

export default function BlockquoteSocialDemo() {
  return (
    <Column gap="lg">
      <Text variant="h4">Social Media Quotes</Text>

      <Blockquote
        variant="minimal"
        author={{
          name: '@elonmusk',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elon'
        }}
        source={{
          name: 'X (Twitter)',
          brand: 'x',
          url: 'https://twitter.com/status/123'
        }}
        date="3h"
        verified
      >
        The future is going to be wild 🚀
      </Blockquote>

      <Blockquote
        variant="testimonial"
        author={{
          name: 'Tech Reviewer',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Reviewer'
        }}
        source={{
          name: 'LinkedIn',
          brand: 'linkedin'
        }}
        date="1 day ago"
      >
        Just finished testing the new Platform Blocks UI library. The component quality and developer experience is outstanding!
      </Blockquote>

      <Blockquote
        variant="testimonial"
        author={{
          name: 'Happy Customer',
          title: 'Software Engineer'
        }}
        source={{
          name: 'GitHub',
          brand: 'github'
        }}
        rating={{ value: 5, max: 5, showValue: true }}
        verified
      >
        This library has saved us countless hours of development time. Clean API, great documentation, and excellent TypeScript support.
      </Blockquote>
    </Column>
  );
}