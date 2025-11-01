import { Grid, GridItem, Card, Text } from '@platform-blocks/ui';

// Example assumes responsive prop shape matches breakpoints used in resolveResponsiveProp (e.g. { base: 4, md: 8, lg: 12 })

export default function ResponsiveGridDemo() {
  return (
    <Grid columns={{ base: 4, md: 8, lg: 12 }} gap={12}>
      <GridItem span={{ base: 4, md: 4, lg: 6 }}>
        <Card p={12}><Text>Hero (4/8/6)</Text></Card>
      </GridItem>
      <GridItem span={{ base: 4, md: 4, lg: 6 }}>
        <Card p={12}><Text>Hero (4/8/6)</Text></Card>
      </GridItem>
      <GridItem span={{ base: 2, md: 4, lg: 3 }}>
        <Card p={12}><Text>Side (2/4/3)</Text></Card>
      </GridItem>
      <GridItem span={{ base: 2, md: 4, lg: 3 }}>
        <Card p={12}><Text>Side (2/4/3)</Text></Card>
      </GridItem>
      <GridItem span={{ base: 4, md: 8, lg: 12 }}>
        <Card p={12}><Text>Footer (4/8/12)</Text></Card>
      </GridItem>
    </Grid>
  );
}
