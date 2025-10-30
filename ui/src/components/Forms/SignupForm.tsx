import React, { useState } from 'react';
import { Card } from '../Card';
import { Text } from '../Text';
import { Input } from '../Input';
import { Button } from '../Button';
import { Link } from '../Link';
import { Divider } from '../Divider';
import { Alert } from '../Alert';
import { Flex } from '../Flex';
import { Checkbox } from '../Checkbox';
import { getLayoutStyles, extractLayoutProps } from '../../core/utils';
import type { SignupFormProps, SignupFormData, OAuthProvider } from './types';

export const SignupForm: React.FC<SignupFormProps> = (allProps) => {
  const { layoutProps, otherProps } = extractLayoutProps(allProps);
  const {
    style,
    onSignup,
    onLogin,
    oauthProviders = [],
    loading = false,
    error,
    title = 'Create your account',
    subtitle = 'Get started with your free account',
    showLoginLink = true,
    primaryButtonText = 'Create account',
    loginLinkText = 'Already have an account? Sign in',
    requireTermsAcceptance = true,
    termsText = 'I agree to the Terms of Service and Privacy Policy',
    onTermsPress
  } = otherProps;

  const [formData, setFormData] = useState<SignupFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptedTerms: false
  });

  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  const handleFieldChange = (field: keyof SignupFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Validate password in real-time
    if (field === 'password' || field === 'confirmPassword') {
      validatePasswords(
        field === 'password' ? value as string : formData.password,
        field === 'confirmPassword' ? value as string : formData.confirmPassword
      );
    }
  };

  const validatePasswords = (password: string, confirmPassword: string) => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/(?=.*\d)/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (confirmPassword && password !== confirmPassword) {
      errors.push('Passwords do not match');
    }
    
    setPasswordErrors(errors);
  };

  const handleSubmit = () => {
    if (onSignup && isFormValid()) {
      onSignup(formData);
    }
  };

  const isFormValid = () => {
    return (
      formData.firstName.trim() &&
      formData.lastName.trim() &&
      formData.email.trim() &&
      formData.password.trim() &&
      formData.confirmPassword.trim() &&
      formData.password === formData.confirmPassword &&
      passwordErrors.length === 0 &&
      (!requireTermsAcceptance || formData.acceptedTerms)
    );
  };

  const renderOAuthButton = (provider: OAuthProvider) => (
    <Button
      key={provider.name}
      variant="outline"
      onPress={provider.onPress}
      style={{ marginBottom: 12 }}
      loading={loading}
    >
      {provider.displayName}
    </Button>
  );

  const hasOAuthProviders = oauthProviders.length > 0;
  const layoutStyles = getLayoutStyles(layoutProps);

  return (
    <Card style={[{ padding: 24, maxWidth: 400, width: '100%' }, layoutStyles, style]}>
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

        {/* Error Alert */}
        {error && (
          <Alert sev="error" title="Error">
            {error}
          </Alert>
        )}

        {/* OAuth Providers */}
        {hasOAuthProviders && (
          <Flex direction="column" gap={12}>
            {oauthProviders.map(renderOAuthButton)}
          </Flex>
        )}

        {/* Divider */}
        {hasOAuthProviders && (
          <Flex direction="row" align="center" gap={16}>
            <Divider style={{ flex: 1 }} />
            <Text variant="caption" color="gray.5">
              or
            </Text>
            <Divider style={{ flex: 1 }} />
          </Flex>
        )}

        {/* Signup Form */}
        <Flex direction="column" gap={16}>
          <Flex direction="row" gap={12}>
            <Flex style={{ flex: 1 }}>
              <Input
                label="First Name"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChangeText={(value) => handleFieldChange('firstName', value)}
                disabled={loading}
              />
            </Flex>
            <Flex style={{ flex: 1 }}>
              <Input
                label="Last Name"
                placeholder="Enter your last name"
                value={formData.lastName}
                onChangeText={(value) => handleFieldChange('lastName', value)}
                disabled={loading}
              />
            </Flex>
          </Flex>

          <Input
            label="Email"
            placeholder="Enter your email"
            value={formData.email}
            onChangeText={(value) => handleFieldChange('email', value)}
            keyboardType="email-address"
            disabled={loading}
          />

          <Input
            label="Password"
            placeholder="Create a password"
            value={formData.password}
            onChangeText={(value) => handleFieldChange('password', value)}
            secureTextEntry
            disabled={loading}
          />

          <Input
            label="Confirm Password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChangeText={(value) => handleFieldChange('confirmPassword', value)}
            secureTextEntry
            disabled={loading}
          />

          {/* Password Errors */}
          {passwordErrors.length > 0 && (
            <Flex direction="column" gap={4}>
              {passwordErrors.map((error, index) => (
                <Text key={index} variant="caption" color="red.6">
                  • {error}
                </Text>
              ))}
            </Flex>
          )}

          {/* Terms and Conditions */}
          {requireTermsAcceptance && (
            <Checkbox
              checked={formData.acceptedTerms}
              onChange={(checked) => handleFieldChange('acceptedTerms', checked)}
              disabled={loading}
            >
              <Text variant="body">
                {onTermsPress ? (
                  <>
                    I agree to the{' '}
                    <Link onPress={onTermsPress}>Terms of Service and Privacy Policy</Link>
                  </>
                ) : (
                  termsText
                )}
              </Text>
            </Checkbox>
          )}

          <Button
            onPress={handleSubmit}
            loading={loading}
            disabled={!isFormValid()}
          >
            {primaryButtonText}
          </Button>
        </Flex>

        {/* Login Link */}
        {showLoginLink && (
          <Flex justify="center">
            <Link onPress={onLogin} disabled={loading}>
              {loginLinkText}
            </Link>
          </Flex>
        )}
      </Flex>
    </Card>
  );
};
