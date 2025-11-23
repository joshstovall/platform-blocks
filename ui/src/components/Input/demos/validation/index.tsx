import { useState } from 'react';
import { Input, Text, Card, Column, Button, Row } from '@platform-blocks/ui';

export default function Demo() {
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleValidate = () => {
    const newErrors: Record<string, string> = {};

    if (!emailValue) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(emailValue)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!passwordValue) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(passwordValue)) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
  };

  const handleClear = () => {
    setEmailValue('');
    setPasswordValue('');
    setErrors({});
  };

  return (
    <Column gap={24}>
      <Text variant="h6">Input Validation</Text>
      
      <Card padding={16}>
        <Column gap={16}>
          <Text variant="p" weight="medium">Required Fields</Text>
          
          <Input
            type="email"
            label="Email Address"
            placeholder="user@example.com"
            value={emailValue}
            onChangeText={(value) => {
              setEmailValue(value);
              if (errors.email) {
                setErrors(prev => ({ ...prev, email: '' }));
              }
            }}
            error={errors.email}
            required
            helperText={!errors.email ? "We'll never share your email" : undefined}
          />

          <Input
            type="password"
            label="Password"
            placeholder="Enter your password"
            value={passwordValue}
            onChangeText={(value) => {
              setPasswordValue(value);
              if (errors.password) {
                setErrors(prev => ({ ...prev, password: '' }));
              }
            }}
            error={errors.password}
            required
            helperText={!errors.password ? 'Must be at least 8 characters' : undefined}
          />

          <Row gap={12}>
            <Button variant="gradient" onPress={handleValidate}>
              Validate
            </Button>
            <Button variant="outline" onPress={handleClear}>
              Clear
            </Button>
          </Row>
        </Column>
      </Card>

      <Card padding={16}>
        <Column gap={16}>
          <Text variant="p" weight="medium">Disabled State</Text>
          <Input
            label="Disabled Input"
            placeholder="This input is disabled"
            value="Cannot edit this value"
            disabled
          />
        </Column>
      </Card>
    </Column>
  );
}


