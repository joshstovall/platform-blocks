import React, { useState } from 'react';
import { Card } from '../Card';
import { Text } from '../Text';
import { Input } from '../Input';
import { Button } from '../Button';
import { Link } from '../Link';
import { Divider } from '../Divider';
import { Alert } from '../Alert';
import { Flex } from '../Flex';
import { getLayoutStyles, extractLayoutProps } from '../../core/utils';
import type { LoginFormProps, OAuthProvider } from './types';
import { BrandButton } from '../BrandButton';
import type { BrandPlatform } from '../BrandButton/types';

export const LoginForm: React.FC<LoginFormProps> = (allProps) => {
  const { layoutProps, otherProps } = extractLayoutProps(allProps);
  const {
    style,
    onLogin,
    onSignup,
    onForgotPassword,
    oauthProviders = [],
    loading = false,
    error,
    title = 'Welcome back',
    subtitle = 'Sign in to your account',
    showSignupLink = true,
    showForgotPasswordLink = true,
    primaryButtonText = 'Sign in',
    signupLinkText = "Don't have an account? Sign up",
    forgotPasswordLinkText = 'Forgot your password?'
  } = otherProps;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    if (onLogin && email.trim() && password.trim()) {
      onLogin(email.trim(), password.trim());
    }
  };

  const renderOAuthButton = (provider: OAuthProvider) => {
    // Check if provider name is a valid BrandPlatform
    const validBrandPlatforms: BrandPlatform[] = [
      'google', 'apple', 'facebook', 'twitter', 'github', 'microsoft', 
      'linkedin', 'discord', 'slack', 'spotify', 'youtube', 'instagram'
    ];
    
    const isValidBrand = validBrandPlatforms.includes(provider.name as BrandPlatform);
    
    if (isValidBrand) {
      return (
        <BrandButton
          key={provider.name}
          brand={provider.name as BrandPlatform}
          title={provider.displayName}
          onPress={provider.onPress}
          disabled={loading}
          fullWidth
        />
      );
    }
    
    // Fallback to regular Button for unsupported brands
    return (
      <Button
        key={provider.name}
        onPress={provider.onPress}
        disabled={loading}
        fullWidth
        variant="outline"
      >
        {provider.displayName}
      </Button>
    );
  };

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

        {/* Login Form */}
        <Flex direction="column" gap={16}>
          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            disabled={loading}
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            disabled={loading}
          />

          {showForgotPasswordLink && (
            <Flex justify="flex-end">
              <Link onPress={onForgotPassword} disabled={loading}>
                {forgotPasswordLinkText}
              </Link>
            </Flex>
          )}

          <Button
            onPress={handleSubmit}
            loading={loading}
            disabled={!email.trim() || !password.trim()}
          >
            {primaryButtonText}
          </Button>
        </Flex>

        {/* Signup Link */}
        {showSignupLink && (
          <Flex justify="center">
            <Link onPress={onSignup} disabled={loading}>
              {signupLinkText}
            </Link>
          </Flex>
        )}
      </Flex>
    </Card>
  );
};
