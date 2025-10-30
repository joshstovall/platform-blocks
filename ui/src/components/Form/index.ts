import { FormBase } from './FormBase';
import { FormField } from './FormField';
import { FormInput } from './FormInput';
import { FormLabel } from './FormLabel';
import { FormError } from './FormError';
import { FormSubmit } from './FormSubmit';

export const Form = Object.assign(FormBase, {
  Field: FormField,
  Input: FormInput,
  Label: FormLabel,
  Error: FormError,
  Submit: FormSubmit
});

export type { 
  FormProps,
  FormFieldProps,
  FormInputProps,
  FormLabelProps,
  FormErrorProps,
  FormSubmitProps,
  ValidationSchema,
  FormContextValue
} from './types';

export { useFormContext, useOptionalFormContext } from './FormContext';
