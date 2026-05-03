import { Avatar, Column, Row, Text } from '@platform-blocks/ui';

export default function Demo() {
  return (
    <Column gap="lg">
      <Column gap="sm">
        <Text size="sm" colorVariant="muted">Default initials</Text>
        <Row gap="md">
          <Avatar fallback="JS" backgroundColor="#a855f7" />
          <Avatar fallback="MK" backgroundColor="#10b981" />
          <Avatar fallback="??" backgroundColor="#6b7280" />
        </Row>
      </Column>

      <Column gap="sm">
        <Text size="sm" colorVariant="muted">
          Brand serif initials (fallbackProps)
        </Text>
        <Row gap="md">
          <Avatar
            fallback="JS"
            backgroundColor="#0f172a"
            fallbackProps={{ ff: 'Georgia, serif', weight: '700' }}
          />
          <Avatar
            fallback="MK"
            backgroundColor="#7c3aed"
            fallbackProps={{ ff: 'monospace', weight: '600', tracking: 0.5 }}
          />
        </Row>
      </Column>

      <Column gap="sm">
        <Text size="sm" colorVariant="muted">
          Avatar + label + description with full slot styling
        </Text>
        <Avatar
          fallback="JD"
          backgroundColor="#a855f7"
          label="Jane Doe"
          description="Lead Designer"
          labelProps={{ weight: '700', size: 'md' }}
          descriptionProps={{ ff: 'monospace', size: 'xs', colorVariant: 'muted' }}
        />
        <Avatar
          fallback="MK"
          backgroundColor="#10b981"
          label="Mark Kim"
          description="@markk"
          labelProps={{ ff: 'Georgia, serif', size: 'lg' }}
          descriptionProps={{ ff: 'monospace', size: 'xs' }}
        />
      </Column>
    </Column>
  );
}
