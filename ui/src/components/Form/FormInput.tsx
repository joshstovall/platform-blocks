import React from 'react';
import { useFormContext, useOptionalFormContext } from './FormContext';
import { Input } from '../Input';
import { FormInputProps } from './types';

export const FormInput: React.FC<FormInputProps> = ({ name, ...inputProps }) => {
  const formContext = useOptionalFormContext();
  
  if (!formContext || !name) {
    // Fallback to regular Input if not in form context or no name
    return <Input {...inputProps} />;
  }

  const fieldProps = formContext.getFieldProps(name);

  return (
    <Input
      {...inputProps}
      {...fieldProps}
    />
  );
};

FormInput.displayName = 'FormInput';
