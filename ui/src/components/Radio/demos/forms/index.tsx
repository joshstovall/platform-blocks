import { useState } from 'react';
import { RadioGroup, Text, Column, Card, Button } from '@platform-blocks/ui';

export default function Demo() {
  const [selectedPlan, setSelectedPlan] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('monthly');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!selectedPlan) {
      newErrors.plan = 'Please select a plan';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      alert(`Selected: ${selectedPlan} plan with ${selectedPayment} billing`);
    }
  };

  return (
    <Column gap={24}>
      <Text variant="h6">Radio in Forms</Text>
      
      <Card padding={16}>
        <Column gap={16}>
          <Text variant="body" weight="medium">Subscription Form</Text>
          
          <RadioGroup
            label="Select Plan"
            options={[
              { 
                label: 'Basic Plan - $9/month', 
                value: 'basic',
                description: 'Perfect for individuals'
              },
              { 
                label: 'Pro Plan - $19/month', 
                value: 'pro',
                description: 'Great for small teams'
              },
              { 
                label: 'Enterprise - $49/month', 
                value: 'enterprise',
                description: 'For large organizations'
              },
            ]}
            value={selectedPlan}
            onChange={(value) => {
              setSelectedPlan(value);
              if (errors.plan) {
                setErrors({ ...errors, plan: '' });
              }
            }}
            error={errors.plan}
            required
          />
          
          <RadioGroup
            label="Billing Cycle"
            options={[
              { label: 'Monthly', value: 'monthly' },
              { label: 'Yearly (20% off)', value: 'yearly' },
            ]}
            value={selectedPayment}
            onChange={setSelectedPayment}
            orientation="horizontal"
          />
          
          <Button
            onPress={handleSubmit}
            variant="filled"
            style={{ alignSelf: 'flex-start' }}
          >
            Subscribe
          </Button>
        </Column>
      </Card>
    </Column>
  );
}


