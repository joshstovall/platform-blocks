import React from 'react';
import { Grid, GridItem, Card, Text } from '@platform-blocks/ui';

export default function BasicGridDemo() {
  return (
    <Grid columns={12} gap={12}>
      {Array.from({ length: 12 }).map((_, i) => (
        <GridItem key={i} span={1}>
          <Card p={8} variant="outline">
            <Text size="sm" align="center">{i + 1}</Text>
          </Card>
        </GridItem>
      ))}
    </Grid>
  );
}
