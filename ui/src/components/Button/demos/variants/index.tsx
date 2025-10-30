import { Button, Row } from '@platform-blocks/ui'
export default function Demo() {
  return (
    <Row>
      <Button title="Filled" variant="filled" />
      <Button title="Secondary" variant="secondary" />
      <Button title="Outline" variant="outline" />
      <Button title="Gradient" variant="gradient" />
      <Button title="Ghost" variant="ghost" />
      <Button title="None" variant="none" />
    </Row>
  )
}