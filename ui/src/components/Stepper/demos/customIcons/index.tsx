import { useState } from 'react';
import { Stepper, Text, Flex, Card, Icon, Button } from '@platform-blocks/ui';

export default function Demo() {
  const [active, setActive] = useState(1);
  
  const nextStep = () => setActive((current) => (current < 2 ? current + 1 : current));
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  return (
    <Card p={16} variant="outline">
      <Flex direction="column" gap={16}>
        <Text size="lg" weight="semibold">Custom Icons</Text>
        
        <Stepper 
          active={active} 
          onStepClick={setActive}
          completedIcon={<Icon name="check" size={18} color="white" />}
        >
          <Stepper.Step 
            icon={<Icon name="user" size={18} />}
            label="Account" 
            description="Create your account"
          >
            Account setup: Fill in your personal information and create your profile.
          </Stepper.Step>
          <Stepper.Step 
            icon={<Icon name="mail" size={18} />}
            label="Email" 
            description="Verify your email"
          >
            Email verification: Check your inbox and click the verification link.
          </Stepper.Step>
          <Stepper.Step 
            icon={<Icon name="settings" size={18} />}
            label="Settings" 
            description="Configure preferences"
          >
            Settings configuration: Customize your app preferences and privacy settings.
          </Stepper.Step>
        </Stepper>

        <Flex direction="row" gap={12} justify="center" style={{ marginTop: 16 }}>
          <Button variant="outline" onPress={prevStep} disabled={active === 0}>
            Back
          </Button>
          <Button onPress={nextStep} disabled={active === 2}>
            Next step
          </Button>
        </Flex>
      </Flex>
    </Card>
  );
}
