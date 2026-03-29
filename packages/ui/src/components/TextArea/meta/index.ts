export const TextAreaMeta = {
  name: 'TextArea',
  type: 'input',
  description: 'Multi-line text input component for longer content like messages, comments, or descriptions.',
  
  features: [
    'Multi-line text input',
    'Auto-resize functionality', 
    'Character counter and limits',
    'Size variants (xs to 3xl)',
    'Validation and error states',
    'Accessible labels and descriptions',
    'Consistent styling with Input components',
    'Mobile-optimized experience'
  ],

  props: {
    value: {
      type: 'string',
      description: 'Current text value',
      default: ''
    },
    onChangeText: {
      type: 'function',
      description: 'Callback fired when text changes',
      signature: '(text: string) => void'
    },
    label: {
      type: 'ReactNode',
      description: 'Input label text or component'
    },
    placeholder: {
      type: 'string', 
      description: 'Placeholder text when empty'
    },
    disabled: {
      type: 'boolean',
      description: 'Whether the textarea is disabled',
      default: false
    },
    required: {
      type: 'boolean',
      description: 'Whether the field is required',
      default: false
    },
    error: {
      type: 'string',
      description: 'Error message to display'
    },
    helperText: {
      type: 'string',
      description: 'Helper text below the textarea'
    },
    description: {
      type: 'string',
      description: 'Description text below the label'
    },
    size: {
      type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'",
      description: 'Size of the textarea',
      default: 'md'
    },
    rows: {
      type: 'number',
      description: 'Number of visible text rows',
      default: 3
    },
    minRows: {
      type: 'number',
      description: 'Minimum number of rows for auto-resize',
      default: 1
    },
    maxRows: {
      type: 'number',
      description: 'Maximum number of rows for auto-resize'
    },
    autoResize: {
      type: 'boolean',
      description: 'Automatically resize based on content',
      default: false
    },
    maxLength: {
      type: 'number',
      description: 'Maximum number of characters allowed'
    },
    showCharCounter: {
      type: 'boolean',
      description: 'Show character count indicator',
      default: false
    },
    radius: {
      type: 'RadiusValue',
      description: 'Border radius',
      default: 'md'
    }
  },

  examples: [
    {
      name: 'Basic usage',
      code: `<TextArea
  label="Message"
  placeholder="Enter your message..."
  value={value}
  onChangeText={setValue}
/>`
    },
    {
      name: 'With character counter',
      code: `<TextArea
  label="Comment"
  maxLength={200}
  showCharCounter={true}
  value={value}
  onChangeText={setValue}
/>`
    },
    {
      name: 'Auto-resize',
      code: `<TextArea
  label="Description" 
  autoResize={true}
  minRows={2}
  maxRows={8}
  value={value}
  onChangeText={setValue}
/>`
    },
    {
      name: 'With validation',
      code: `<TextArea
  label="Feedback"
  required={true}
  error={error}
  helperText="Please provide detailed feedback"
  value={value}
  onChangeText={setValue}
/>`
    }
  ],

  accessibility: {
    label: 'Use meaningful labels that describe the purpose',
    placeholder: 'Provide helpful placeholder text',
    error: 'Error messages are announced to screen readers',
    required: 'Required fields are clearly marked and announced'
  },

  related: ['Input', 'Form', 'Validation']
};