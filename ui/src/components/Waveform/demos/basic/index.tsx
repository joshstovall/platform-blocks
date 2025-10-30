import { Waveform, Column, Card, Text, Button, Row } from '../../../../components'
import { useState } from 'react'

export default function Demo() {
  const [progress, setProgress] = useState(0)

  const samplePeaks = [
    0, 0.002, 0.012, 0.006, -0.313, 0.151, 0.247, 0.114, -0.036, -0.097, -0.030,
    0.107, 0.240, 0.013, -0.124, 0.046, -0.016, 0.109, 0.067, 0.094, -0.171,
    -0.023, -0.104, 0.003, 0.081, 0.026, 0.187, 0.020, -0.150, 0.057, -0.001,
    0.275, 0.257, 0.076, 0.108, -0.066, 0.153, 0.071, 0.033, -0.090, 0.018,
    -0.049, -0.048, -0.007, 0.045, -0.024, -0.067, 0.123, -0.109, 0.038, -0.020,
    -0.031, 0.043, -0.092, 0.083, -0.004, 0.043, 0.076, -0.053, 0.035, -0.049,
    0.023, 0.008, 0.015, 0.008, 0.008
  ]

  return (
    // <Column gap={24}>
      // {/* <Text variant="h6">Basic Waveform</Text> */}
      <Card padding={16}>
        {/* <Column gap={16}> */}
          <Text variant="body" weight="medium">Audio Waveform</Text>
          <Waveform
            peaks={samplePeaks}
            progress={progress}
            // height={120}
            // width={400}
            fullWidth
          />
          <Row gap={12}>
            <Button
              title="Play"
              variant="filled"
              onPress={() => setProgress(Math.min(progress + 0.1, 1))}
            />
            <Button
              variant="outline"
              onPress={() => setProgress(0)}
              title="Reset"
            />
          </Row>
          <Text variant="caption">
            Progress: {Math.round(progress * 100)}%
          </Text>
        {/* </Column> */}
      </Card>
    // </Column>
  )
}
