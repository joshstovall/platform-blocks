import { Button, Row } from '@platform-blocks/ui'
export default function Demo() {
  return (
    <Row align="flex-end">
      <Button title="Small" size="sm" />
      <Button title="Medium" size="md" />
      <Button title="Large" size="lg" />
      <Button title="Extra Large" size="xl" />
    </Row>
  )
}