import { useState } from 'react';
import { PinInput, Text, Card, Column, Button, Row } from '@platform-blocks/ui';

export default function Demo() {
  const [maskedValue, setMaskedValue] = useState('');
  const [otpValue, setOtpValue] = useState('');
  const [validationValue, setValidationValue] = useState('');
  const [error, setError] = useState('');
  const [disabled, setDisabled] = useState(false);

  const correctPin = '1234';

  const handleValidate = () => {
    if (validationValue !== correctPin) {
      setError('Incorrect PIN. Try again.');
    } else {
      setError('');
      alert('PIN verified successfully!');
    }
  };

  const handleOtpComplete = (value: string) => {
    alert(`OTP entered: ${value}`);
  };

  return (
    <Column gap={24}>
      <Text variant="h6">Security Features</Text>
      
      <Card padding={16}>
        <Column gap={16}>
          <Text variant="body" weight="medium">Masked PIN Input</Text>
          <Text variant="caption" colorVariant="secondary">
            PIN values are hidden for security
          </Text>
          <PinInput
            value={maskedValue}
            onChange={setMaskedValue}
            mask
            label="Secure PIN"
          />
        </Column>
      </Card>
      
      <Card padding={16}>
        <Column gap={16}>
          <Text variant="body" weight="medium">OTP with Auto-Complete</Text>
          <Text variant="caption" colorVariant="secondary">
            Automatically completes when all digits are entered
          </Text>
          <PinInput
            value={otpValue}
            onChange={setOtpValue}
            onComplete={handleOtpComplete}
            oneTimeCode
            length={6}
            label="One-Time Password"
          />
        </Column>
      </Card>
      
      <Card padding={16}>
        <Column gap={16}>
          <Text variant="body" weight="medium">PIN Validation</Text>
          <Text variant="caption" colorVariant="secondary">
            Enter the correct PIN: 1234
          </Text>
          <PinInput
            value={validationValue}
            onChange={(newValue) => {
              setValidationValue(newValue);
              if (error) setError('');
            }}
            label="Enter PIN"
            error={error}
            disabled={disabled}
            helperText={!error ? 'Enter the correct 4-digit PIN' : undefined}
          />
          
          <Row gap={12}>
            <Button
              variant="filled"
              onPress={handleValidate}
              disabled={validationValue.length !== 4}
            >
              Validate
            </Button>
            <Button
              variant="outline"
              onPress={() => setDisabled(!disabled)}
            >
              {disabled ? 'Enable' : 'Disable'}
            </Button>
            <Button
              variant="outline"
              onPress={() => {
                setValidationValue('');
                setError('');
              }}
            >
              Clear
            </Button>
          </Row>
        </Column>
      </Card>
    </Column>
  );
}


