import { Blockquote } from '@platform-blocks/ui';

export default function BlockquoteTestimonialDemo() {
  return (
    <Blockquote
      variant="testimonial"
      author={{
        name: 'John Smith',
        title: 'CEO',
        organization: 'Tech Corp',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
      }}
      rating={{ value: 5, max: 5, showValue: true }}
      source={{
        name: 'Google Business',
        brand: 'google'
      }}
      date="2024-03-15"
      verified
      shadow
    >
      Outstanding service and incredible results. The team exceeded all our expectations and delivered on time. Highly recommended!
    </Blockquote>
  );
}