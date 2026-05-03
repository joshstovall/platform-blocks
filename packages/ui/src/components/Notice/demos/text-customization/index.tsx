import { Column, Notice, Text } from '@platform-blocks/ui';

export default function Demo() {
  return (
    <Column gap="lg">
      <Text weight="semibold">titleProps & bodyProps</Text>

      <Notice
        sev="info"
        title="Default"
      >
        Default title and body styling.
      </Notice>

      <Notice
        sev="success"
        title="Operation succeeded"
        titleProps={{ uppercase: true, tracking: 1, size: 'sm', weight: '700' }}
        bodyProps={{ size: 'sm' }}
      >
        Bold tracked uppercase title with smaller body text.
      </Notice>

      <Notice
        sev="warning"
        title="Heads up"
        titleProps={{ ff: 'Georgia, serif', size: 'lg' }}
        bodyProps={{ ff: 'monospace', size: 'sm' }}
      >
        Title in serif, body in monospace.
      </Notice>

      <Notice
        sev="error"
        title="Critical issue"
        titleProps={{ weight: '700', colorVariant: 'error' }}
        bodyProps={{ colorVariant: 'muted' }}
      >
        Override the title color via `colorVariant`. Body falls back to muted.
      </Notice>
    </Column>
  );
}
