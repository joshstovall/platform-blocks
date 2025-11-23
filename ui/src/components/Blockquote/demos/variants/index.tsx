import { Blockquote, Column, Text } from '@platform-blocks/ui';

export default function Demo() {
  return (
    <Column gap="xl">
      <Column gap="sm">
        <Text variant="h5" weight="semibold">
          Default
        </Text>
        <Blockquote author={{ name: 'Anonymous' }}>
          The best way to predict the future is to create it.
        </Blockquote>
      </Column>

      <Column gap="sm">
        <Text variant="h5" weight="semibold">
          Testimonial
        </Text>
        <Blockquote
          variant="testimonial"
          author={{
            name: 'Sarah Johnson',
            title: 'Marketing Director',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
          }}
          rating={{ value: 4, max: 5 }}
          shadow
        >
          Great experience with this service. The team was professional and delivered quality results.
        </Blockquote>
      </Column>

      <Column gap="sm">
        <Text variant="h5" weight="semibold">
          Featured
        </Text>
        <Blockquote
          variant="featured"
          alignment="center"
          author={{
            name: 'Albert Einstein',
            title: 'Theoretical Physicist',
          }}
        >
          Imagination is more important than knowledge.
        </Blockquote>
      </Column>

      <Column gap="sm">
        <Text variant="h5" weight="semibold">
          Minimal
        </Text>
        <Blockquote
          variant="minimal"
          quoteIconPosition="none"
          author={{ name: '@username' }}
          source={{ name: 'X (Twitter)', brand: 'x' }}
          date="2 hours ago"
        >
          Just discovered this amazing new feature! 🚀
        </Blockquote>
      </Column>
    </Column>
  );
}