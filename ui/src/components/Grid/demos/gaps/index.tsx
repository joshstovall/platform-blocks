import { Grid, GridItem, Card, Text, Block, Divider } from '@platform-blocks/ui';

export default function GapsGridDemo() {
  return (<Block>
    <Grid columns={6} gap="xs" rowGap={6} columnGap={6}>
      {Array.from({ length: 12 }).map((_, i) => (
          <Card key={i}>
            <Text size="sm">Item {i + 1}</Text>
          </Card>
      ))}
    </Grid>
    <Divider my={24} />
    <Grid columns={6} gap={24} rowGap={24} columnGap={12}>
      {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <Text size="sm">Item {i + 1}</Text>
          </Card>
      ))}
    </Grid>
    </Block>
  );
}
