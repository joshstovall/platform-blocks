import { Alert, Column } from '@platform-blocks/ui'

export default function VariantsAlertDemo() {
  return (
    <Column gap={16}>
      <Alert variant="light" color="primary" title="Light Alert">
        This is a light variant alert.
      </Alert>
      <Alert variant="outline" color="success" title="Outline Alert">
        This is an outline variant alert.
      </Alert>
      <Alert variant="filled" color="warning" title="Filled Alert">
        This is a filled variant alert.
      </Alert>
      <Alert variant="subtle" color="error" title="Subtle Alert">
        This is a subtle variant alert with no background, just colored icon.
      </Alert>
      <Alert variant="filled" color="error" title="Filled Error">
        This is a filled error alert.
      </Alert>
    </Column>
  )
}
