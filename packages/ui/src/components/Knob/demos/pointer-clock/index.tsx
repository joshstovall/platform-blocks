import { useMemo, useState } from 'react';

import { Column, Knob, Text } from '@platform-blocks/ui';

const HOURS = Array.from({ length: 12 }, (_, index) => index * 60);
const HOUR_LABELS = ['12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];

const formatTime = (value: number) => {
  const totalMinutes = Math.round(value);
  const hour = Math.floor(totalMinutes / 60) % 12;
  const minute = totalMinutes % 60;
  const displayHour = hour === 0 ? 12 : hour;
  const paddedMinutes = minute.toString().padStart(2, '0');
  return `${displayHour}:${paddedMinutes}`;
};

export default function Demo() {
  const [minutes, setMinutes] = useState(150);
  const clockLabel = useMemo(() => formatTime(minutes), [minutes]);

  return (
    <Column gap="sm" align="center">
      <Knob.Root
        min={0}
        max={720}
        value={minutes}
        onChange={setMinutes}
        step={5}
        size={240}
        appearance={{
          arc: { startAngle: -90, sweepAngle: 360, clampInput: true },
        }}
      >
        <Knob.Fill color="#020617" radiusOffset={-18} borderWidth={2} borderColor="rgba(15, 23, 42, 0.8)" />
        <Knob.Ring thickness={18} color="#0f172a" trailColor="#1f2937" />
        <Knob.Progress visible={false} />
        <Knob.TickLayer
          source="values"
          values={HOURS}
          shape="line"
          length={18}
          width={3}
          position="outer"
          label={{
            show: true,
            formatter: (_, index) => HOUR_LABELS[index],
            offset: 18,
            style: { color: '#f8fafc', fontSize: 12, fontWeight: '600' },
          }}
        />
        <Knob.Pointer
          visible
          length={84}
          width={3}
          color="#fde047"
          counterweight={{ size: 10, color: '#facc15' }}
        />
        <Knob.Thumb size={14} color="#fde047" strokeWidth={0} offset={-12} />
        <Knob.ValueLabel
          position="bottom"
          formatter={formatTime}
          textStyle={{ fontSize: 24, fontWeight: '700', color: '#f8fafc' }}
          secondary={{
            formatter: () => 'Analog clock',
            position: 'bottom',
            textStyle: { fontSize: 14, color: '#94a3b8', marginTop: 4 },
          }}
        />
      </Knob.Root>
      <Text size="sm" colorVariant="secondary">
        Drag to reposition the hour hand ({clockLabel})
      </Text>
    </Column>
  );
}
