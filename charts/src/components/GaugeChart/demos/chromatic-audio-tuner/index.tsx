import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { GaugeChart } from '../../';
import type { GaugeChartMarker } from '../../types';

const DETECTED_NOTE = {
  name: 'E4',
  cents: -8,
  frequency: 329.6,
};

const RANGES = [
  { from: 0, to: 12, color: '#EF4444', label: 'Severely flat' },
  {
    from: 12,
    to: 32,
    label: 'Drifting flat',
    gradient: {
      angle: 200,
      stops: [
        { offset: 0, color: '#F97316' },
        { offset: 1, color: '#FACC15' },
      ],
    },
  },
  {
    from: 32,
    to: 68,
    color: '#22C55E',
    label: 'In tune window',
  },
  {
    from: 68,
    to: 88,
    label: 'Drifting sharp',
    gradient: {
      angle: -20,
      stops: [
        { offset: 0, color: '#FACC15' },
        { offset: 1, color: '#F97316' },
      ],
    },
  },
  { from: 88, to: 100, color: '#EF4444', label: 'Severely sharp' },
];

const MARKERS: GaugeChartMarker[] = [
  { value: 25, label: '25¢ flat', color: '#F97316', size: 18, labelOffset: 22 },
  {
    type: 'needle',
    value: 50,
    label: 'Concert A4',
    color: '#22C55E',
    needleLength: 0.98,
    needleWidth: 3,
    labelOffset: 28,
  },
  { value: 75, label: '25¢ sharp', color: '#F97316', size: 18, labelOffset: 22 },
];

export default function Demo() {
  const [focusedMarker, setFocusedMarker] = useState<GaugeChartMarker | null>(null);
  const [displayCents, setDisplayCents] = useState(DETECTED_NOTE.cents);
  const gaugeValue = Math.min(100, Math.max(0, DETECTED_NOTE.cents + 50));
  const gaugePercentage = gaugeValue / 100;

  return (
    <View style={{ width: 360, alignSelf: 'center', paddingVertical: 24, gap: 12 }}>
      <Text style={{ fontSize: 16, fontWeight: '600', textAlign: 'center' }}>{DETECTED_NOTE.name}</Text>
      <Text style={{ fontSize: 12, textAlign: 'center', color: '#64748b' }}>{DETECTED_NOTE.frequency.toFixed(1)} Hz</Text>
      <GaugeChart
        width={360}
        height={320}
        value={gaugeValue}
        min={0}
        max={100}
        startAngle={-60}
        endAngle={60}
        innerRadiusRatio={0.52}
        thickness={22}
        ranges={RANGES}
        markers={MARKERS}
        markerFocusStrategy="closest"
        markerFocusThreshold={15}
        ticks={{ major: 5, minor: 4, color: '#94A3B8', majorLength: 18, minorLength: 8 }}
        labels={{ positions: [0, 25, 50, 75, 100], formatter: (v) => `${v - 50}`, offset: 34, fontWeight: '600' }}
        needle={{ color: '#0EA5E9', length: 0.9, width: 4, centerSize: 8, showCenter: true }}
        centerLabel={{
          show: true,
          formatter: () => `${displayCents > 0 ? '+' : ''}${displayCents}¢`,
          secondaryText: focusedMarker?.label ?? 'Listening…',
        }}
        legend={{ show: true, position: 'bottom', align: 'center' }}
        onMarkerFocus={setFocusedMarker}
        onValueChange={(nextValue) => setDisplayCents(Math.round(nextValue - 50))}
        accessibilityLabel={`Chromatic tuner reading ${DETECTED_NOTE.name} at ${displayCents} cents`}
        accessibilityHint="Displays detuning relative to concert pitch"
      />
      <Text style={{ fontSize: 12, textAlign: 'center', color: '#0f172a' }}>
        {(gaugePercentage * 100).toFixed(0)}% of full deflection
      </Text>
    </View>
  );
}
