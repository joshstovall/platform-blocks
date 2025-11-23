import { useState } from 'react';

import { Button, Column, PinInput, Row, Text } from '@platform-blocks/ui';

export default function Demo() {
  const [maskedValue, setMaskedValue] = useState('');
  const [otpValue, setOtpValue] = useState('');
  const [otpStatus, setOtpStatus] = useState('');
  const [validationValue, setValidationValue] = useState('');
  const [validationMessage, setValidationMessage] = useState('');
  const [error, setError] = useState('');
  const [disabled, setDisabled] = useState(false);

  const correctPin = '1234';

  const handleValidate = () => {
    if (validationValue !== correctPin) {
      setError('Incorrect PIN. Try again.');
      setValidationMessage('');
      return;
    }

    setError('');
    setValidationMessage('PIN verified successfully.');
  };

  const handleOtpComplete = (value: string) => {
    setOtpStatus(`OTP entered: ${value}`);
  };

  const handleToggleDisabled = () => {
    setDisabled((prev) => !prev);
    setError('');
    setValidationMessage('');
  };

  const handleClear = () => {
    setValidationValue('');
    setError('');
    setValidationMessage('');
  };

  return (
    <Column gap="lg">
      <Text weight="semibold">Security-focused PIN inputs</Text>

      <Column gap="sm">
        <Text size="sm" weight="semibold">
          Masked PIN input
        </Text>
        <Text size="sm" colorVariant="secondary">
          Conceal characters as they are typed.
        </Text>
        <PinInput
          value={maskedValue}
          onChange={setMaskedValue}
          mask
          label="Secure PIN"
        />
      </Column>

      <Column gap="sm">
        <Text size="sm" weight="semibold">
          OTP with auto-complete
        </Text>
        <Text size="sm" colorVariant="secondary">
          Automatically completes once all digits are entered.
        </Text>
        <PinInput
          value={otpValue}
          onChange={(value) => {
            setOtpValue(value);
            if (otpStatus) setOtpStatus('');
          }}
          onComplete={handleOtpComplete}
          oneTimeCode
          length={6}
          label="One-time password"
        />
        {otpStatus && (
          <Text size="xs" colorVariant="secondary">
            {otpStatus}
          </Text>
        )}
      </Column>

      <Column gap="sm">
        <Text size="sm" weight="semibold">
          PIN validation state
        </Text>
        <Text size="sm" colorVariant="secondary">
          Enter the correct PIN: 1234
        </Text>
        <PinInput
          value={validationValue}
          onChange={(newValue) => {
            setValidationValue(newValue);
            if (error) setError('');
            if (validationMessage) setValidationMessage('');
          }}
          label="Enter PIN"
          error={error}
          disabled={disabled}
          helperText={!error ? 'Enter the correct 4-digit PIN' : undefined}
        />

        <Row gap="sm" wrap="wrap">
          <Button
            variant="filled"
            onPress={handleValidate}
            disabled={validationValue.length !== 4}
          >
            Validate
          </Button>
          <Button variant="outline" onPress={handleToggleDisabled}>
            {disabled ? 'Enable input' : 'Disable input'}
          </Button>
          <Button variant="outline" onPress={handleClear}>
            Clear
          </Button>
        </Row>

        {validationMessage && (
          <Text size="xs" colorVariant="secondary">
            {validationMessage}
          </Text>
        )}
      </Column>
    </Column>
  );
}


