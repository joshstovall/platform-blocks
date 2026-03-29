export const useChartInteractionContext = () => ({
  config: { liveTooltip: true },
  pointer: { inside: true, x: 50, y: 60, pageX: 100, pageY: 110, data: null },
  rootOffset: { left: 10, top: 20 },
  crosshair: { pixelX: 140 },
  series: [{ id: 'series-1', color: '#2563eb' }],
});
