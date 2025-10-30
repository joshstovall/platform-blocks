import React, { useState } from 'react';
import { Card } from '../Card';
import { Text } from '../Text';
import { Input } from '../Input';
import { Button } from '../Button';
import { Link } from '../Link';
import { Alert } from '../Alert';
import { Flex } from '../Flex';
import type { ForgotPasswordFormProps } from './types';

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = (props) => {
  const {
    style,
    onSubmit,
    onBackToLogin,
    loading = false,
    error,
    success,
    title = 'Reset your password',
    subtitle = 'Enter your email address and we\'ll send you a link to reset your password',
    primaryButtonText = 'Send reset link',
    backToLoginText = 'Back to sign in'
  } = props;

  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    if (onSubmit && email.trim()) {
      onSubmit(email.trim());
    }
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <Card style={[{ padding: 24, maxWidth: 400, width: '100%' }, style]}>
      <Flex direction="column" gap={24}>
        {/* Header */}
        <Flex direction="column" gap={8} align="center">
          <Text variant="h2" weight="semibold" align="center">
            {title}
          </Text>
          <Text variant="body" color="gray.6" align="center">
            {subtitle}
          </Text>
        </Flex>

        {/* Success Alert */}
        {success && (
          <Alert sev="success" title="Email sent">
            {success}
          </Alert>
        )}

        {/* Error Alert */}
        {error && (
          <Alert sev="error" title="Error">
            {error}
          </Alert>
        )}

        {/* Form */}
        {!success && (
          <Flex direction="column" gap={16}>
            <Input
              label="Email"
              placeholder="Enter your email address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              disabled={loading}
            />

            <Button
              onPress={handleSubmit}
              loading={loading}
              disabled={!email.trim() || !isValidEmail(email)}
            >
              {primaryButtonText}
            </Button>
          </Flex>
        )}

        {/* Back to Login Link */}
        <Flex justify="center">
          <Link onPress={onBackToLogin} disabled={loading}>
            {backToLoginText}
          </Link>
        </Flex>
      </Flex>
    </Card>
  );
};
