import { Grid, GridItem, Card, Text } from '@platform-blocks/ui'

export default function Demo() {
  return (
    <Grid columns={12} gap={12}>
      <GridItem span={6}><Card><Text>span=6</Text></Card></GridItem>
      <GridItem span={6}><Card><Text>span=6</Text></Card></GridItem>
      <GridItem span={4}><Card><Text>span=4</Text></Card></GridItem>
      <GridItem span={4}><Card><Text>span=4</Text></Card></GridItem>
      <GridItem span={4}><Card><Text>span=4</Text></Card></GridItem>
      <GridItem span={3}><Card><Text>span=3</Text></Card></GridItem>
      <GridItem span={3}><Card><Text>span=3</Text></Card></GridItem>
      <GridItem span={3}><Card><Text>span=3</Text></Card></GridItem>
      <GridItem span={3}><Card><Text>span=3</Text></Card></GridItem>
    </Grid>
  )
}
