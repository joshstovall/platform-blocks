import { useState } from 'react'
import { Alert, Column, Button } from '@platform-blocks/ui'

export default function InteractiveAlertDemo() {
  const [alerts, setAlerts] = useState([
    { id: 1, message: 'This alert can be dismissed', color: 'primary' as const },
    { id: 2, message: 'Success message that can be closed', color: 'success' as const },
    { id: 3, message: 'Warning that can be dismissed', color: 'warning' as const }
  ])

  const [showNewAlert, setShowNewAlert] = useState(false)

  const dismissAlert = (id: number) => {
    setAlerts(alerts.filter(alert => alert.id !== id))
  }

  const addAlert = () => {
    setShowNewAlert(true)
    setTimeout(() => setShowNewAlert(false), 3000)
  }

  return (
    <Column gap={16}>
      {alerts.map((alert) => (
        <Alert
          key={alert.id}
          color={alert.color}
          withCloseButton
          onClose={() => dismissAlert(alert.id)}
        >
          {alert.message}
        </Alert>
      ))}
      
      {showNewAlert && (
        <Alert color="info" title="New Alert!">
          This alert will auto-dismiss in 3 seconds.
        </Alert>
      )}
      
      <Button
        title="Add Temporary Alert"
        variant="outline"
        onPress={addAlert}
        disabled={showNewAlert}
      />
    </Column>
  )
}
