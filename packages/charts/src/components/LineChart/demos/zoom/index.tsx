import { LineChart } from '../../';

// A denser series so zooming reveals detail. Two years of weekly-ish points.
const makeSeries = (id: string, name: string, color: string, base: number, amp: number, phase: number) => ({
  id,
  name,
  color,
  data: Array.from({ length: 104 }, (_, i) => ({
    x: i,
    y: Math.round(
      base +
        amp * Math.sin(i / 6 + phase) +
        (i / 104) * amp * 1.5 +
        Math.sin(i / 2.3) * amp * 0.25
    ),
  })),
});

const SERIES = [
  makeSeries('sessions', 'Sessions', '#4C6EF5', 420, 90, 0),
  makeSeries('signups', 'Signups', '#20C997', 180, 55, 1.2),
];

export default function Demo() {
  return (
    <LineChart
      title="Product engagement"
      subtitle="Scroll to zoom · drag to pan · Shift-drag to box-zoom · double-click to reset"
      width={560}
      height={340}
      series={SERIES}
      xAxis={{ show: true, title: 'Week', labelFormatter: (value) => `W${value}` }}
      yAxis={{ show: true, title: 'Count' }}
      grid={{ show: true, style: 'dashed', color: '#E0E7FF' }}
      legend={{ show: true, position: 'bottom' }}
      tooltip={{ show: true }}
      enableCrosshair
      multiTooltip
      liveTooltip
      // Zoom & pan gestures (desktop web):
      enablePanZoom          // drag to pan (and gates wheel zoom)
      enableWheelZoom        // scroll wheel to zoom
      enableBrushZoom        // Shift + drag a box to zoom into it
      resetOnDoubleTap       // double-click to reset the view
      zoomMode="x"           // zoom the x-axis (time) only
      minZoom={0.15}
    />
  );
}
