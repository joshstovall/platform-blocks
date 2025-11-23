import React, { useState } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { Skeleton, Text, Card, Flex, Row, Column } from '@platform-blocks/ui';
import { Title } from '@platform-blocks/ui';

export default function SkeletonShowcase() {
  const { width } = useWindowDimensions();
  const isSmall = width < 768;
  return (
    <View>
      <Title afterline>Skeleton Component Playground</Title>
      <Flex direction={isSmall ? 'column' : 'row'} gap={20} wrap={isSmall ? undefined : 'wrap'}>
        <Card>
          <Text>Default Skeleton</Text>
          <Skeleton />
        </Card>

        {/* YouTube Card Skeleton */}
        <Card p={16}>
          <Skeleton shape="rectangle" height={120} mb={12} />
          <Row gap={12} mb={16}>
            <Skeleton shape="avatar" size="lg" />
            <Column gap={6} grow={1}>
              <Skeleton shape="text" width="100%" mb={6} />
              <Skeleton shape="text" width="80%" mb={12} />
            </Column>
          </Row>

          <Row gap={8}>
            <Skeleton shape="chip" />
            <Skeleton shape="chip" />
            <Skeleton shape="chip" />
          </Row>
        </Card>

        {/* Instagram Card */}
        <Card p={16} width={300}>
          <Row gap={12} mb={16} align="center">
            <Skeleton shape="avatar" size="md" />
            <Column gap={6} grow={1}>
              <Skeleton shape="text" width="30%" />
              <Skeleton shape="text" width="50%" />
            </Column>
          </Row>

          <Skeleton shape="rectangle" height={200} mb={12} />

          <Skeleton shape="text" width="100%" mb={6} />
          <Skeleton shape="text" width="80%" mb={12} />

          <Flex direction="column" gap={12}>
            {/* Small avatars aligned to left */}
            <Row gap={8} justify="flex-start">
              <Skeleton shape="avatar" size="sm" />
              <Skeleton shape="avatar" size="sm" />
              <Skeleton shape="avatar" size="sm" />
            </Row>
            
            {/* Small chips aligned to right */}
            <Row gap={8} justify="flex-end">
              <Skeleton shape="chip" size="sm" />
              <Skeleton shape="chip" size="sm" />
              <Skeleton shape="chip" size="sm" />
            </Row>
          </Flex>
        </Card>

      </Flex>
    </View>
  );
}
