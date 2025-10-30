import { Alert, Column, Icon } from '@platform-blocks/ui'

export default function IconsAlertDemo() {
  return (
    <Column gap={16}>

      {/* Default severity icons */}
      <Alert sev="info" title="Information">
        Uses default info icon automatically.
      </Alert>
      <Alert sev="success" title="Success">
        Uses default success icon automatically.
      </Alert>
      <Alert sev="warning" title="Warning">
        Uses default warning icon automatically.
      </Alert>
      <Alert sev="error" title="Error">
        Uses default error icon automatically.
      </Alert>

      {/* String icon names */}
      <Alert
        icon="heart"
        color="error"
        title="String Icon"
      >
        Using icon="heart" as string - automatically creates Icon component.
      </Alert>
      <Alert
        icon="star"
        color="warning"
        title="Another String Icon"
      >
        Using icon="star" as string.
      </Alert>

      {/* React component icons */}
      <Alert
        icon={<Icon name="knobs" />}
        color="primary"
        title="React Component Icon"
      >
        Custom Icon component passed as React element.
      </Alert>
      <Alert
        icon={<Icon name="paper" />}
        color="gray"
        title="Documentation"
      >
        Another React component icon for documentation notices.
      </Alert>

      {/* Explicitly no icon */}
      <Alert
        icon={false}
        sev="warning"
        title="No Icon"
      >
        Using icon=false to explicitly hide icon, even with severity.
      </Alert>

      {/* Null icon with severity (shows default) */}
      <Alert
        icon={null}
        sev="error"
        title="Null Icon with Severity"
      >
        Using icon=null with severity shows default severity icon.
      </Alert>

      {/* No icon prop, no severity (no icon) */}
      <Alert
        color="primary"
        title="No Icon Prop"
      >
        No icon prop and no severity means no icon is shown.
      </Alert>
    </Column>
  )
}
