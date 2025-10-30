import { useState } from 'react';
import { TextArea, Button, Column, Card, Text } from '@platform-blocks/ui';
import { DESIGN_TOKENS } from '../../../../core/design-tokens';

export default function Demo() {
  const [feedback, setFeedback] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!feedback.trim()) {
      newErrors.feedback = 'Feedback is required';
    } else if (feedback.length < 10) {
      newErrors.feedback = 'Feedback must be at least 10 characters';
    }
    
    if (message.length > 500) {
      newErrors.message = 'Message cannot exceed 500 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      alert('Form submitted successfully!');
    }
  };

    return (
      <Column gap={DESIGN_TOKENS.spacing.md}>        <TextArea
          label="Feedback"
          placeholder="Please provide your feedback (minimum 10 characters)"
          value={feedback}
          onChangeText={setFeedback}
          error={errors.feedback}
          required={true}
          rows={4}
          helperText="Share your thoughts and suggestions"
          fullWidth
        />

        <TextArea
          label="Additional Message"
          placeholder="Any additional comments (optional)"
          value={message}
          onChangeText={setMessage}
          error={errors.message}
          rows={3}
          maxLength={500}
          showCharCounter={true}
          helperText="Optional field with character limit"
          fullWidth
        />

        <Button onPress={handleSubmit}>
          Submit Feedback
        </Button>

        {/* Validation Summary */}
        {Object.keys(errors).length > 0 && (
          <Card padding={DESIGN_TOKENS.spacing.md} style={{ backgroundColor: '#FEF2F2', borderColor: '#FCA5A5', borderWidth: 1 }}>
            <Text style={{ color: '#DC2626', fontSize: DESIGN_TOKENS.typography.fontSize.sm, fontWeight: DESIGN_TOKENS.typography.fontWeight.semibold }}>
              Please fix the following errors:
            </Text>
            {Object.entries(errors).map(([field, error]) => (
              <Text key={field} style={{ color: '#DC2626', fontSize: DESIGN_TOKENS.typography.fontSize.xs, marginTop: DESIGN_TOKENS.spacing.xs }}>
                • {error}
              </Text>
            ))}
          </Card>
        )}
      </Column>
  );
}