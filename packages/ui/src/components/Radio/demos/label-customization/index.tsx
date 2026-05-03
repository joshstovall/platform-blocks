import { useState } from 'react';
import { Column, Radio, Text } from '@platform-blocks/ui';

export default function Demo() {
  const [plan, setPlan] = useState('free');

  return (
    <Column gap="lg">
      <Text weight="semibold">labelProps & descriptionProps</Text>

      <Column gap="sm">
        <Radio
          name="plan"
          value="free"
          checked={plan === 'free'}
          onChange={setPlan}
          label="Free"
          description="Up to 3 projects"
          labelProps={{ weight: '700', size: 'lg' }}
          descriptionProps={{ size: 'xs', colorVariant: 'muted' }}
        />
        <Radio
          name="plan"
          value="pro"
          checked={plan === 'pro'}
          onChange={setPlan}
          label="Pro"
          description="Unlimited projects, priority support"
          labelProps={{ weight: '700', size: 'lg', colorVariant: 'primary' }}
          descriptionProps={{ size: 'xs', colorVariant: 'muted' }}
        />
        <Radio
          name="plan"
          value="enterprise"
          checked={plan === 'enterprise'}
          onChange={setPlan}
          label="Enterprise"
          description="Custom contracts, SAML SSO, dedicated SLA"
          labelProps={{ ff: 'Georgia, serif', weight: '600', size: 'lg' }}
          descriptionProps={{ size: 'xs', colorVariant: 'muted' }}
        />
      </Column>
    </Column>
  );
}
