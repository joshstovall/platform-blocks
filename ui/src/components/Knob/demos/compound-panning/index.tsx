import { useMemo, useState } from 'react';

import { Column, Knob, Text } from '@platform-blocks/ui';

const PAN_MARKS = [-100, -50, 0, 50, 100].map((value) => ({
  value,
  label:
    value === 0 ? 'C' : value < 0 ? `L${Math.abs(value)}` : `R${Math.abs(value)}`,
}));

export default function Demo() {
  const [pan, setPan] = useState(-18);

  const readout = useMemo(() => {
    if (pan === 0) return 'Center';
    return pan > 0 ? `Right ${Math.abs(pan)}` : `Left ${Math.abs(pan)}`;
  }, [pan]);

  return (
    <Column gap="sm" align="center">
      <Knob.Root
        min={-100}
        max={100}
        value={pan}
        onChange={setPan}
        step={1}
        size={220}
        marks={PAN_MARKS}
        appearance={{
          arc: { startAngle: -135, sweepAngle: 270, clampInput: true },
          panning: {
            pivotValue: 0,
            positiveColor: '#4ade80',
            negativeColor: '#fb7185',
            showZeroIndicator: true,
          },
        }}
      >
        <Knob.Fill
          radiusOffset={-28}
          color="#0f172a"
          borderWidth={2}
          borderColor="rgba(148, 163, 184, 0.4)"
        />
        <Knob.Ring thickness={22} color="#0f172a" trailColor="#1f2937" />
        <Knob.Progress mode="split" thickness={14} roundedCaps />
        <Knob.TickLayer
          source="marks"
          shape="line"
          length={20}
          width={4}
          position="outer"
          radiusOffset={8}
          label={{
            show: true,
            position: 'outer',
            offset: 18,
            style: { color: '#e2e8f0', fontSize: 12, fontWeight: '600' },
          }}
        />
        <Knob.Thumb size={26} color="#f8fafc" strokeWidth={3} strokeColor="#0f172a" offset={6} />
        <Knob.ValueLabel
          position="center"
          formatter={(value) => `${value > 0 ? 'R' : value < 0 ? 'L' : ''}${Math.abs(Math.round(value))}`}
          textStyle={{ fontSize: 30, fontWeight: '700', color: '#f8fafc' }}
        />
      </Knob.Root>
      <Text size="sm" colorVariant="secondary">
        Stereo balance · {readout}
      </Text>
    </Column>
  );
}
