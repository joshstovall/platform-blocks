import { Waveform, Text, Card, Column } from '@platform-blocks/ui';

const samplePeaks = [
  0, 0.15, 0.3, 0.1, -0.31, 0.15, 0.25, 0.11, -0.04, -0.1, -0.03, 0.11, 0.24, 0.01, -0.12, 0.05,
  -0.02, 0.11, 0.07, 0.09, -0.17, -0.02, -0.1, 0.003, 0.08, 0.03, 0.19, 0.02, -0.15, 0.06, 0,
  0.27, 0.26, 0.08, 0.11, -0.07, 0.15, 0.07, 0.03, -0.09, 0.02, -0.05, -0.05, -0.007, 0.05, -0.02,
];

// Quiet waveform with smaller peaks for normalization demo
const quietPeaks = [
  0, 0.05, 0.08, 0.03, -0.09, 0.04, 0.07, 0.02, -0.01, -0.03, -0.01, 0.04, 0.06, 0.01, -0.04, 0.02,
  -0.01, 0.03, 0.02, 0.03, -0.05, -0.01, -0.03, 0.001, 0.02, 0.01, 0.05, 0.01, -0.04, 0.02, 0,
  0.07, 0.06, 0.02, 0.03, -0.02, 0.04, 0.02, 0.01, -0.02, 0.01, -0.01, -0.01, -0.002, 0.01, -0.01,
];

export default function Demo() {
  return (
    <Column gap={24}>
      <Text variant="h6">Waveform Variants</Text>
      
      <Card padding={16}>
        <Column gap={16}>
          <Text variant="body" weight="medium">Color Variants</Text>
          
          <Column gap={12}>
            <Text variant="caption">Primary Color</Text>
            <Waveform 
              peaks={samplePeaks}
              width={300}
              height={60}
              color="#3b82f6"
              progress={0.3}
            />
          </Column>
          
          <Column gap={12}>
            <Text variant="caption">Success Color</Text>
            <Waveform 
              peaks={samplePeaks}
              width={300}
              height={60}
              color="#10b981"
              progress={0.5}
            />
          </Column>
          
          <Column gap={12}>
            <Text variant="caption">Error Color</Text>
            <Waveform 
              peaks={samplePeaks}
              width={300}
              height={60}
              color="#ef4444"
              progress={0.7}
            />
          </Column>
        </Column>
      </Card>
      
      <Card padding={16}>
        <Column gap={16}>
          <Text variant="body" weight="medium">Height Variants</Text>
          
          <Column gap={12}>
            <Text variant="caption">Small (40px)</Text>
            <Waveform 
              peaks={samplePeaks}
              width={300}
              height={40}
              progress={0.4}
            />
          </Column>
          
          <Column gap={12}>
            <Text variant="caption">Medium (80px)</Text>
            <Waveform 
              peaks={samplePeaks}
              width={300}
              height={80}
              progress={0.4}
            />
          </Column>
          
          <Column gap={12}>
            <Text variant="caption">Large (120px)</Text>
            <Waveform 
              peaks={samplePeaks}
              width={300}
              height={120}
              progress={0.4}
            />
          </Column>
        </Column>
      </Card>

      <Card padding={16}>
        <Column gap={16}>
          <Text variant="body" weight="medium">Height Normalization</Text>
          <Text variant="caption">
            Normalize makes quiet waveforms more visible by scaling the tallest bar to full height
          </Text>
          
          <Column gap={12}>
            <Text variant="caption">Quiet Waveform (Original)</Text>
            <Waveform 
              peaks={quietPeaks}
              width={300}
              height={80}
              color="#6366f1"
              progress={0.4}
            />
          </Column>
          
          <Column gap={12}>
            <Text variant="caption">Quiet Waveform (Normalized)</Text>
            <Waveform 
              peaks={quietPeaks}
              width={300}
              height={80}
              color="#6366f1"
              progress={0.4}
              normalize
            />
          </Column>
          
          <Column gap={12}>
            <Text variant="caption">Normal Waveform (No Normalization Needed)</Text>
            <Waveform 
              peaks={samplePeaks}
              width={300}
              height={80}
              color="#10b981"
              progress={0.4}
            />
          </Column>
          
          <Column gap={12}>
            <Text variant="caption">Normal Waveform (With Normalization)</Text>
            <Waveform 
              peaks={samplePeaks}
              width={300}
              height={80}
              color="#10b981"
              progress={0.4}
              normalize
            />
          </Column>
        </Column>
      </Card>
    </Column>
  );
}


