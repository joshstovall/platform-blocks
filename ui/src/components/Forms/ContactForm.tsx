import React, { useState } from 'react';
import { Card } from '../Card';
import { Text } from '../Text';
import { Input } from '../Input';
import { Button } from '../Button';
import { Alert } from '../Alert';
import { Flex } from '../Flex';
import type { ContactFormProps, ContactFormData, ContactFormField } from './types';

export const ContactForm: React.FC<ContactFormProps> = (props) => {
  const {
    style,
    onSubmit,
    loading = false,
    error,
    success,
    title = 'Contact us',
    subtitle = 'We\'d love to hear from you. Send us a message and we\'ll respond as soon as possible.',
    primaryButtonText = 'Send message',
    showSubjectField = true,
    showPhoneField = false,
    customFields = []
  } = props;

  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    // Initialize custom fields
    ...customFields.reduce((acc, field) => {
      acc[field.key] = '';
      return acc;
    }, {} as Record<string, string>)
  });

  const handleFieldChange = (field: keyof ContactFormData | string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (onSubmit && isFormValid()) {
      onSubmit(formData);
    }
  };

  const isFormValid = () => {
    const requiredFields = ['name', 'email', 'message'];
    
    if (showSubjectField) requiredFields.push('subject');
    if (showPhoneField) requiredFields.push('phone');
    
    // Check custom required fields
    customFields.forEach(field => {
      if (field.required) {
        requiredFields.push(field.key);
      }
    });

    return requiredFields.every(field => {
      const value = formData[field as keyof ContactFormData];
      return typeof value === 'string' && value.trim() !== '';
    }) && isValidEmail(formData.email);
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const renderCustomField = (field: ContactFormField) => {
    const value = formData[field.key] || '';
    
    if (field.type === 'textarea') {
      return (
        <Input
          key={field.key}
          label={field.label + (field.required ? ' *' : '')}
          placeholder={field.placeholder}
          value={value}
          onChangeText={(text) => handleFieldChange(field.key, text)}
          multiline
          numberOfLines={4}
          disabled={loading}
        />
      );
    }

    return (
      <Input
        key={field.key}
        label={field.label + (field.required ? ' *' : '')}
        placeholder={field.placeholder}
        value={value}
        onChangeText={(text) => handleFieldChange(field.key, text)}
        keyboardType={field.type === 'email' ? 'email-address' : field.type === 'phone' ? 'phone-pad' : 'default'}
        disabled={loading}
      />
    );
  };

  return (
    <Card style={[{ padding: 24, maxWidth: 500, width: '100%' }, style]}>
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
          <Alert sev="success" title="Message sent">
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
              label="Name *"
              placeholder="Enter your full name"
              value={formData.name}
              onChangeText={(value) => handleFieldChange('name', value)}
              disabled={loading}
            />

            <Input
              label="Email *"
              placeholder="Enter your email address"
              value={formData.email}
              onChangeText={(value) => handleFieldChange('email', value)}
              keyboardType="email-address"
              disabled={loading}
            />

            {showPhoneField && (
              <Input
                label="Phone"
                placeholder="Enter your phone number"
                value={formData.phone || ''}
                onChangeText={(value) => handleFieldChange('phone', value)}
                keyboardType="phone-pad"
                disabled={loading}
              />
            )}

            {showSubjectField && (
              <Input
                label="Subject *"
                placeholder="What is this regarding?"
                value={formData.subject || ''}
                onChangeText={(value) => handleFieldChange('subject', value)}
                disabled={loading}
              />
            )}

            {/* Custom Fields */}
            {customFields.map(renderCustomField)}

            <Input
              label="Message *"
              placeholder="Enter your message"
              value={formData.message}
              onChangeText={(value) => handleFieldChange('message', value)}
              multiline
              numberOfLines={6}
              disabled={loading}
            />

            <Button
              onPress={handleSubmit}
              loading={loading}
              disabled={!isFormValid()}
            >
              {primaryButtonText}
            </Button>
          </Flex>
        )}
      </Flex>
    </Card>
  );
};
