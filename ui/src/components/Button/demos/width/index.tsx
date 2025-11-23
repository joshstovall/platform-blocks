import { useEffect, useRef, useState } from 'react';
import { Button, Column, Row, Text } from '@platform-blocks/ui';

const LOADING_DURATION_MS = 2000;

export default function Demo() {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [loadingKey, setLoadingKey] = useState<string | null>(null);

  useEffect(() => () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  const triggerLoading = (key: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setLoadingKey(key);
    timeoutRef.current = setTimeout(() => {
      setLoadingKey(null);
      timeoutRef.current = null;
    }, LOADING_DURATION_MS);
  };

  return (
    <Column gap="xl">
      <Column gap="sm">
        <Text weight="medium">Width controls</Text>

        <Column gap="xs">
          <Text>Default width</Text>
          <Button>Default width</Button>
          <Text variant="small" colorVariant="muted">
            Buttons size themselves to the label length by default.
          </Text>
        </Column>

        <Column gap="xs">
          <Text>Fixed width (200px)</Text>
          <Button w={200}>Fixed width 200</Button>
          <Text variant="small" colorVariant="muted">
            Provide an exact `w` value for pixel-perfect toolbars.
          </Text>
        </Column>

        <Column gap="xs">
          <Text>50% width</Text>
          <Button w="50%">50% width</Button>
          <Text variant="small" colorVariant="muted">
            Percentage widths respect the parent container.
          </Text>
        </Column>

        <Column gap="xs">
          <Text>Full width</Text>
          <Button fullWidth>Full width</Button>
          <Text variant="small" colorVariant="muted">
            `fullWidth` stretches the trigger edge-to-edge for forms.
          </Text>
        </Column>
      </Column>

      <Column gap="sm">
        <Text weight="medium">Loading width preservation</Text>
        <Row gap="md" wrap="wrap" align="flex-start">
          <Button
            loading={loadingKey === 'long'}
            loadingTitle="Loading…"
            onPress={() => triggerLoading('long')}
          >
            Preserve width while loading
          </Button>
          <Button loading={loadingKey === 'short'} onPress={() => triggerLoading('short')}>
            Short text
          </Button>
        </Row>
        <Text variant="small" colorVariant="muted">
          When `loading` is true, the button keeps its original width so layouts stay stable.
        </Text>
      </Column>
    </Column>
  );
}
