import React from 'react';
import { Button } from '../Button';
import { useFormContext, useOptionalFormContext } from './FormContext';
import { FormSubmitProps } from './types';

export const FormSubmit: React.FC<FormSubmitProps> = ({ 
  children, 
  disabled, 
  ...buttonProps 
}) => {
  const formContext = useOptionalFormContext();
  
  const handlePress = () => {
    if (formContext) {
      formContext.submitForm();
    }
  };

  const isDisabled = disabled || 
    (formContext && (formContext.isSubmitting || formContext.disabled || !formContext.isValid)) ||
    false;

  return (
    <Button
      {...buttonProps}
      title={typeof children === 'string' ? children : 'Submit'}
      disabled={isDisabled}
      onPress={handlePress}
    />
  );
};

FormSubmit.displayName = 'FormSubmit';
