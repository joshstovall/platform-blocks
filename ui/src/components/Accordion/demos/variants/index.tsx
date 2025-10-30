import { Accordion, Text, Grid, GridItem } from '@platform-blocks/ui'

export default function Demo() {
  const items = [
    {
      key: 'item1',
      title: 'First Item',
      content: <Text>Content for the first accordion item.</Text>
    },
    {
      key: 'item2',
      title: 'Second Item',
      content: <Text>Content for the second accordion item.</Text>
    }
  ]

  return (
    <Grid gap="2xl">
      <GridItem span={4}>
        <Text variant="h6" mb="md">Default Variant</Text>
        <Accordion type="single" items={items} />
      </GridItem>

      <GridItem span={4}>
        <Text variant="h6" mb="md">Separated Variant</Text>
        <Accordion type="single" variant="separated" items={items} />
      </GridItem>

      <GridItem span={4}>
        <Text variant="h6" mb="md">Bordered Variant</Text>
        <Accordion type="single" variant="bordered" items={items} />
      </GridItem>
    </Grid>
  )
}
