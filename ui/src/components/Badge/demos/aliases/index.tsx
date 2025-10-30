import { Badge, Text, Column, Row } from '../../../..';

export default function AliasesBadgeDemo() {
  return (
    <Column gap="lg">
      <Text variant="h4">Using Full Prop Names</Text>
      <Row gap="sm" wrap="wrap">
        <Badge variant="filled" color="primary">Primary Filled</Badge>
        <Badge variant="outline" color="secondary">Secondary Outline</Badge>
        <Badge variant="light" color="success">Success Light</Badge>
        <Badge variant="subtle" color="warning">Warning Subtle</Badge>
      </Row>
      
      <Text variant="h4">Using Aliases (v, c)</Text>
      <Row gap="sm" wrap="wrap">
        <Badge v="filled" c="primary">Primary Filled</Badge>
        <Badge v="outline" c="secondary">Secondary Outline</Badge>
        <Badge v="light" c="success">Success Light</Badge>
        <Badge v="subtle" c="warning">Warning Subtle</Badge>
      </Row>

      <Text variant="h4">Mixed Usage</Text>
      <Row gap="sm" wrap="wrap">
        <Badge v="filled" color="error">Using v + color</Badge>
        <Badge variant="outline" c="gray">Using variant + c</Badge>
        <Badge v="light" c="primary">Both aliases</Badge>
        <Badge variant="subtle" color="success">Both full names</Badge>
      </Row>

      <Text variant="body" colorVariant="muted" mt="lg">
        The aliases `v` and `c` provide the same functionality as `variant` and `color` 
        but with shorter, more concise syntax. You can mix and match or use whichever style you prefer.
      </Text>
    </Column>
  );
}