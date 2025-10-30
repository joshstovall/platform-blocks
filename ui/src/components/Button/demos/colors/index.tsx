import { Button, Flex } from '@platform-blocks/ui'
export default function Demo(){
  return <Flex direction="row" gap={8}>
    <Button title="Click Me" colorVariant="primary" />
    <Button title="Click Me" colorVariant="secondary" />
    <Button title="Click Me" colorVariant="success" />
    <Button title="Click Me" colorVariant="warning" />
    <Button title="Click Me" colorVariant="error" />
  </Flex>
}
