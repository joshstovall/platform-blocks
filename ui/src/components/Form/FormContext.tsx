import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { FormContextValue, ValidationSchema } from './types';
import { validateValue } from '../Input/validation';

const FormContext = createContext<FormContextValue | null>(null);

export const useFormContext = (): FormContextValue => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a Form component');
  }
  return context;
};

export const useOptionalFormContext = (): FormContextValue | null => {
  return useContext(FormContext);
};

interface FormProviderProps {
  initialValues?: Record<string, any>;
  validationSchema?: ValidationSchema;
  onSubmit?: (values: Record<string, any>) => void | Promise<void>;
  validate?: (values: Record<string, any>) => Record<string, string> | Promise<Record<string, string>>;
  disabled?: boolean;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  children: React.ReactNode;
}

export const FormProvider: React.FC<FormProviderProps> = ({
  initialValues = {},
  validationSchema = {},
  onSubmit,
  validate,
  disabled = false,
  validateOnChange = true,
  validateOnBlur = true,
  children
}) => {
  const [values, setValues] = useState<Record<string, any>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback(async (name: string, value: any): Promise<string | null> => {
    const fieldValidation = validationSchema[name];
    if (!fieldValidation) return null;

    const fieldErrors = await validateValue(value, fieldValidation, values);
    return fieldErrors.length > 0 ? fieldErrors[0] : null;
  }, [validationSchema, values]);

  const setFieldValue = useCallback((name: string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    if (validateOnChange) {
      validateField(name, value).then(error => {
        setErrors(prev => ({
          ...prev,
          [name]: error || ''
        }));
      });
    }
  }, [validateOnChange, validateField]);

  const setFieldError = useCallback((name: string, error: string | null) => {
    setErrors(prev => ({
      ...prev,
      [name]: error || ''
    }));
  }, []);

  const setFieldTouched = useCallback((name: string, isTouched: boolean) => {
    setTouched(prev => ({ ...prev, [name]: isTouched }));
  }, []);

  const getFieldProps = useCallback((name: string) => {
    const handleChange = (value: any) => {
      setFieldValue(name, value);
    };

    const handleBlur = () => {
      setFieldTouched(name, true);
      if (validateOnBlur) {
        validateField(name, values[name]).then(error => {
          setFieldError(name, error);
        });
      }
    };

    return {
      value: values[name] || '',
      onChangeText: handleChange,
      onBlur: handleBlur,
      error: touched[name] ? errors[name] : undefined,
      name
    };
  }, [values, errors, touched, setFieldValue, setFieldTouched, validateOnBlur, validateField, setFieldError]);

  const validateForm = useCallback(async (): Promise<Record<string, string>> => {
    const allErrors: Record<string, string> = {};

    // Run custom validation if provided
    if (validate) {
      const customErrors = await validate(values);
      Object.assign(allErrors, customErrors);
    }

    // Run schema validation
    for (const [fieldName, fieldValidation] of Object.entries(validationSchema)) {
      const fieldValue = values[fieldName];
      const fieldErrors = await validateValue(fieldValue, fieldValidation, values);
      if (fieldErrors.length > 0) {
        allErrors[fieldName] = fieldErrors[0];
      }
    }

    return allErrors;
  }, [values, validationSchema, validate]);

  const submitForm = useCallback(async () => {
    if (isSubmitting || disabled) return;

    setIsSubmitting(true);
    
    try {
      // Mark all fields as touched
      const allFieldNames = Object.keys(validationSchema);
      const touchedFields = allFieldNames.reduce((acc, name) => {
        acc[name] = true;
        return acc;
      }, {} as Record<string, boolean>);
      setTouched(touchedFields);

      // Validate entire form
      const formErrors = await validateForm();
      setErrors(formErrors);

      // If no errors, submit
      if (Object.keys(formErrors).length === 0) {
        await onSubmit?.(values);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, disabled, validationSchema, validateForm, onSubmit, values]);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  const isValid = useMemo(() => {
    return Object.values(errors).every(error => !error);
  }, [errors]);

  const contextValue: FormContextValue = useMemo(() => ({
    values,
    errors,
    touched,
    disabled,
    isSubmitting,
    isValid,
    validateField,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    getFieldProps,
    submitForm,
    resetForm
  }), [
    values,
    errors,
    touched,
    disabled,
    isSubmitting,
    isValid,
    validateField,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    getFieldProps,
    submitForm,
    resetForm
  ]);

  return (
    <FormContext.Provider value={contextValue}>
      {children}
    </FormContext.Provider>
  );
};
