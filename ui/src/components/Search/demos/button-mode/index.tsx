import { Column, KeyCap, Row, Search, Text, useToast } from '@platform-blocks/ui';

export default function Demo() {
  const toast = useToast();

  const handleCustomPress = () => {
    toast.show({ message: 'Launching saved search…' });
  };

  return (
    <Column gap="lg" maxW={420} w="100%">
      <Column gap="sm">
        <Text size="xs" colorVariant="muted">
          Default Spotlight launcher
        </Text>
        <Search
          buttonMode
          placeholder="Search the workspace"
          rightComponent={(
            <Row gap="xs" align="center">
              <KeyCap size="xs">⌘</KeyCap>
              <KeyCap size="xs">K</KeyCap>
            </Row>
          )}
        />
      </Column>

      <Column gap="sm">
        <Text size="xs" colorVariant="muted">
          Custom handler with shortcut hint
        </Text>
        <Search
          buttonMode
          placeholder="Search analytics"
          onPress={handleCustomPress}
          rightComponent={(
            <Row gap="xs" align="center">
              <KeyCap size="xs" variant="outline">
                Ctrl
              </KeyCap>
              <KeyCap size="xs" variant="outline">
                F
              </KeyCap>
            </Row>
          )}
        />
      </Column>
    </Column>
  );
}