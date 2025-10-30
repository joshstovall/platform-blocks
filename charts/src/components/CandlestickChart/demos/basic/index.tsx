import { CandlestickChart } from '../../';

const PRICE_SERIES = [
  { x: new Date('2023-10-02'), open: 154, high: 158, low: 153, close: 157 },
  { x: new Date('2023-10-03'), open: 157, high: 161, low: 156, close: 160 },
  { x: new Date('2023-10-04'), open: 160, high: 164, low: 159, close: 162 },
  { x: new Date('2023-10-05'), open: 162, high: 166, low: 161, close: 165 },
  { x: new Date('2023-10-06'), open: 165, high: 168, low: 163, close: 164 },
  { x: new Date('2023-10-09'), open: 164, high: 167, low: 162, close: 166 },
  { x: new Date('2023-10-10'), open: 166, high: 170, low: 165, close: 169 },
  { x: new Date('2023-10-11'), open: 169, high: 172, low: 167, close: 168 },
];

export default function Demo() {
  return (
    <CandlestickChart
      title="AAPL daily candles"
      subtitle="Includes 3 & 5-day moving averages"
      width={520}
      height={360}
      series={[
        {
          id: 'apple',
          name: 'Apple Inc.',
          data: PRICE_SERIES,
          colorBull: '#34C38F',
          colorBear: '#F56565',
          wickColor: '#6B7280',
        },
      ]}
      movingAveragePeriods={[3, 5]}
      gap={0.3}
      barWidth={12}
      xAxis={{
        show: true,
        labelFormatter: (value) => new Date(value).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        title: 'Trading day',
      }}
      yAxis={{
        show: true,
        title: 'Price (USD)',
        labelFormatter: (value) => `$${value.toFixed(0)}`,
      }}
      grid={{ show: true, color: '#E5EAF7' }}
      legend={{ show: true }}
      tooltip={{
        show: true,
        formatter: (candle) =>
          `O: $${candle.open.toFixed(2)} • H: $${candle.high.toFixed(2)} • L: $${candle.low.toFixed(2)} • C: $${candle.close.toFixed(2)}`,
      }}
      enableCrosshair
      liveTooltip
      animation={{ duration: 400 }}
      enablePanZoom
      zoomMode="both"
      minZoom={0.2}
      resetOnDoubleTap
      clampToInitialDomain
      xScaleType="time"
    />
  );
}
