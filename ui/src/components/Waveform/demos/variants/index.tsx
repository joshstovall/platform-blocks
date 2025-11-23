import { Column, Text, Waveform } from '@platform-blocks/ui';

import { QUIET_WAVEFORM_PEAKS, WAVEFORM_DEMO_PEAKS } from '../data';

export default function Demo() {
  return (
    <Column gap="lg">
      <Column gap="sm">
        <Text variant="small" weight="medium">
          Semantic colors
        </Text>
        <Waveform peaks={WAVEFORM_DEMO_PEAKS} height={56} progress={0.25} color="primary" />
        <Waveform peaks={WAVEFORM_DEMO_PEAKS} height={56} progress={0.5} color="success" />
        <Waveform peaks={WAVEFORM_DEMO_PEAKS} height={56} progress={0.75} color="warning" />
      </Column>

      <Column gap="sm">
        <Text variant="small" weight="medium">
          Variant styles
        </Text>
        <Waveform
          peaks={WAVEFORM_DEMO_PEAKS}
          height={72}
          progress={0.4}
          variant="line"
          color="primary"
        />
        <Waveform
          peaks={WAVEFORM_DEMO_PEAKS}
          height={72}
          progress={0.4}
          variant="rounded"
          color="success"
        />
      </Column>

      <Column gap="sm">
        <Text variant="small" weight="medium">
          Normalized quiet tracks
        </Text>
        <Waveform peaks={QUIET_WAVEFORM_PEAKS} height={56} progress={0.45} color="surface" />
        <Waveform
          peaks={QUIET_WAVEFORM_PEAKS}
          height={56}
          progress={0.45}
          normalize
          color="surface"
        />
      </Column>
    </Column>
  );
}


