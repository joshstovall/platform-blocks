import { Badge, Card, Column, Divider, Flex, Text } from '@platform-blocks/ui';
import { useOverlayMode } from '../..';

export default function Demo() {
  const { shouldUseModal, shouldUseOverlay, isMobileExperience, isDesktopExperience, isWeb } = useOverlayMode();

  return (
    <Column gap="md" fullWidth>
      <Text weight="semibold">Decide between modal and overlay surfaces</Text>
      <Text size="sm" colorVariant="muted">
        The hook inspects platform + device heuristics and returns booleans you can plug into dialogs, popovers,
        or sheets. Resize the preview or switch platforms to see the recommendation change.
      </Text>
      <Card variant="outline" style={{ padding: 20, gap: 12, maxWidth: 520 }}>
        <Column gap="sm">
          <Text size="sm" colorVariant="secondary">Recommended surface</Text>
          <Badge color={shouldUseModal ? 'primary' : 'teal'} variant="subtle">
            {shouldUseModal ? 'Fullscreen/modal' : 'Anchored overlay/portal'}
          </Badge>
        </Column>
        <Divider />
        <Column gap="xs">
          <Flex justify="space-between" align="center">
            <Text size="sm">Mobile experience</Text>
            <Badge variant="subtle" color={isMobileExperience ? 'primary' : 'gray'}>
              {isMobileExperience ? 'Yes' : 'No'}
            </Badge>
          </Flex>
          <Flex justify="space-between" align="center">
            <Text size="sm">Desktop experience</Text>
            <Badge variant="subtle" color={isDesktopExperience ? 'primary' : 'gray'}>
              {isDesktopExperience ? 'Yes' : 'No'}
            </Badge>
          </Flex>
          <Flex justify="space-between" align="center">
            <Text size="sm">Web platform</Text>
            <Badge variant="subtle" color={isWeb ? 'primary' : 'gray'}>
              {isWeb ? 'Web' : 'Native'}
            </Badge>
          </Flex>
        </Column>
        <Divider />
        <Flex justify="space-between" align="center">
          <Text size="sm">Overlay available</Text>
          <Badge variant="subtle" color={shouldUseOverlay ? 'teal' : 'gray'}>
            {shouldUseOverlay ? 'Yes' : 'No'}
          </Badge>
        </Flex>
      </Card>
    </Column>
  );
}
