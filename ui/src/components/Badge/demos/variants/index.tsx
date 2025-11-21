import { Block, Badge, Text, Divider } from '@platform-blocks/ui'

export default function Demo() {
  return (
    <Block>
      <Text>Variants</Text>
      <Block gap="sm" direction="row" >
        <Badge v="filled">Filled</Badge>
        <Badge v="outline">Outline</Badge>
        <Badge v="light">Light</Badge>
        <Badge v="subtle">Subtle</Badge>
        <Badge v="gradient">Gradient</Badge>
      </Block>
      <Divider my="lg" />
      <Text>Colors</Text>
      <Block gap="sm" direction="row" >
        <Badge c="primary">Primary</Badge>
        <Badge c="secondary">Secondary</Badge>
        <Badge c="success">Success</Badge>
        <Badge c="warning">Warning</Badge>
        <Badge c="error">Error</Badge>
        <Badge c="gray">Gray</Badge>
      </Block>
    </Block>
  )
}