import React from 'react';
import { Grid, GridItem, Card, Text } from '@platform-blocks/ui';

export default function NestingGridDemo() {
  return (
    <Grid columns={12} gap={12}>
      <GridItem span={8}>
        <Card p={12} variant="outline">
          <Text weight="semibold" size="sm" mb={8}>Parent span=8</Text>
          <Grid columns={6} gap={8}>
            {Array.from({ length: 6 }).map((_, i) => (
              <GridItem key={i} span={2}>
                <Card p={6} variant="filled">
                  <Text size="xs" align="center">Nested {i + 1}</Text>
                </Card>
              </GridItem>
            ))}
          </Grid>
        </Card>
      </GridItem>
      <GridItem span={4}>
        <Card p={12} variant="outline">
          <Text weight="semibold" size="sm">Sidebar span=4</Text>
        </Card>
      </GridItem>
    </Grid>
  );
}
