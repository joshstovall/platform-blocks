import React from 'react';
import { View } from 'react-native';
import { FormProvider } from './FormContext';
import { FormProps } from './types';

export const FormBase: React.FC<FormProps> = ({
  initialValues,
  validationSchema,
  onSubmit,
  validate,
  disabled,
  validateOnChange,
  validateOnBlur,
  children
}) => {
  return (
    <FormProvider
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      validate={validate}
      disabled={disabled}
      validateOnChange={validateOnChange}
      validateOnBlur={validateOnBlur}
    >
      <View>
        {children}
      </View>
    </FormProvider>
  );
};
