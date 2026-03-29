export const useTooltipAggregator = () => ({
  entries: [
    {
      seriesId: 'series-1',
      label: 'Revenue',
      color: '#2563eb',
      point: { x: 1, y: 10, meta: { formattedValue: '$10' } },
    },
  ],
  anchorPixelX: 120,
});
