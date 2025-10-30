import { Alert, Column } from '@platform-blocks/ui'

export default function BasicAlertDemo() {
  return (
    <Column gap={16}>
      <Alert>
        This is a default alert message.
      </Alert>
      <Alert title="Information" color="primary">
        This is an informational alert with a title.
      </Alert>
      <Alert title="Success!" color="success">
        Your changes have been saved successfully.
      </Alert>
      <Alert title="Warning" color="warning">
        Please review your information before submitting.
      </Alert>
      <Alert title="Error" color="error">
        An error occurred while processing your request.
      </Alert>
    </Column>
  )
}
