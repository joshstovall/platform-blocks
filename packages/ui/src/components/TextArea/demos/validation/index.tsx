import { useState } from 'react';

import { Button, Column, Text, TextArea } from '@platform-blocks/ui';

type ValidationErrors = {
  feedback?: string;
  message?: string;
};

export default function Demo() {
  const [feedback, setFeedback] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [status, setStatus] = useState('');

  const validateForm = () => {
    const nextErrors: ValidationErrors = {};

    if (!feedback.trim()) {
      nextErrors.feedback = 'Feedback is required.';
    } else if (feedback.trim().length < 10) {
      nextErrors.feedback = 'Feedback must be at least 10 characters.';
    }

    if (message.length > 500) {
      nextErrors.message = 'Message cannot exceed 500 characters.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setStatus('Feedback submitted successfully.');
      return;
    }

    setStatus('');
  };

  return (
    <Column gap="lg" fullWidth>
      <Text weight="semibold">Text area validation</Text>
      <Text size="sm" colorVariant="secondary">
        Demonstrates required, length, and summary messaging for feedback flows.
      </Text>

      <Column gap="sm">
        <Text size="sm" weight="semibold">
          Required feedback
        </Text>
        <Text size="sm" colorVariant="secondary">
          Must include at least ten characters before the form can submit.
        </Text>
        <TextArea
          label="Feedback"
          placeholder="Share your thoughts (minimum 10 characters)"
          value={feedback}
          onChangeText={(value) => {
            setFeedback(value);
            if (errors.feedback) {
              setErrors((prev) => ({ ...prev, feedback: undefined }));
            }
          }}
          error={errors.feedback}
          required
          rows={4}
          helperText="Tell us what went well and what could improve."
          fullWidth
        />
      </Column>

      <Column gap="sm">
        <Text size="sm" weight="semibold">
          Optional follow-up message
        </Text>
        <Text size="sm" colorVariant="secondary">
          Includes a character counter and enforces a 500 character limit.
        </Text>
        <TextArea
          label="Additional message"
          placeholder="Add more context (optional, max 500 characters)"
          value={message}
          onChangeText={(value) => {
            setMessage(value);
            if (errors.message && value.length <= 500) {
              setErrors((prev) => ({ ...prev, message: undefined }));
            }
          }}
          error={errors.message}
          rows={3}
          maxLength={500}
          showCharCounter
          helperText="Use this field for any extra details."
          fullWidth
        />
      </Column>

      <Button variant="filled" onPress={handleSubmit}>
        Submit feedback
      </Button>

      {status && (
        <Text size="xs" colorVariant="success">
          {status}
        </Text>
      )}

      {Object.keys(errors).length > 0 && (
        <Column
          gap="xs"
          style={{
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#FCA5A5',
            backgroundColor: '#FEF2F2',
            padding: 12,
          }}
        >
          <Text size="sm" weight="semibold" colorVariant="error">
            Please fix the following before submitting:
          </Text>
          {Object.values(errors)
            .filter(Boolean)
            .map((errorMessage) => (
              <Text key={errorMessage} size="xs" colorVariant="error">
                • {errorMessage}
              </Text>
            ))}
        </Column>
      )}
    </Column>
  );
}