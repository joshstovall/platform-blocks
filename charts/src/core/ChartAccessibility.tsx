import React from 'react';
import { View, Text } from 'react-native';
import { ChartDataPoint, PieChartDataPoint, BarChartDataPoint } from '../types';

interface ChartAccessibilityProps {
  title?: string;
  description?: string;
  data: ChartDataPoint[] | PieChartDataPoint[] | BarChartDataPoint[];
  chartType: 'line' | 'bar' | 'pie' | 'scatter';
  summaryFormatter?: (data: any[]) => string;
}

/**
 * Accessibility wrapper for charts
 * Provides screen reader support and keyboard navigation
 */
export const ChartAccessibility: React.FC<ChartAccessibilityProps> = ({
  title,
  description,
  data,
  chartType,
  summaryFormatter,
}) => {
  const generateSummary = () => {
    if (summaryFormatter) {
      return summaryFormatter(data);
    }

    switch (chartType) {
      case 'line':
      case 'scatter':
        const chartData = data as ChartDataPoint[];
        const xValues = chartData.map(d => d.x);
        const yValues = chartData.map(d => d.y);
        return `Chart with ${chartData.length} data points. X values range from ${Math.min(...xValues)} to ${Math.max(...xValues)}. Y values range from ${Math.min(...yValues)} to ${Math.max(...yValues)}.`;
      
      case 'bar':
        const barData = data as BarChartDataPoint[];
        const categories = barData.map(d => d.category).join(', ');
        const maxValue = Math.max(...barData.map(d => d.value));
        return `Bar chart with ${barData.length} categories: ${categories}. Maximum value is ${maxValue}.`;
      
      case 'pie':
        const pieData = data as PieChartDataPoint[];
        const total = pieData.reduce((sum, d) => sum + d.value, 0);
        const percentages = pieData.map(d => `${d.label}: ${((d.value / total) * 100).toFixed(1)}%`).join(', ');
        return `Pie chart with ${pieData.length} slices. ${percentages}`;
      
      default:
        return `Chart with ${data.length} data points.`;
    }
  };

  const generateDataTable = () => {
    switch (chartType) {
      case 'line':
      case 'scatter':
        return (data as ChartDataPoint[]).map((point, index) => (
          <Text key={index} accessibilityLabel={`Data point ${index + 1}: X ${point.x}, Y ${point.y}${point.label ? `, ${point.label}` : ''}`}>
            Point {index + 1}: ({point.x}, {point.y}) {point.label && `- ${point.label}`}
          </Text>
        ));
      
      case 'bar':
        return (data as BarChartDataPoint[]).map((point, index) => (
          <Text key={index} accessibilityLabel={`${point.category}: ${point.value}`}>
            {point.category}: {point.value}
          </Text>
        ));
      
      case 'pie':
        const total = (data as PieChartDataPoint[]).reduce((sum, d) => sum + d.value, 0);
        return (data as PieChartDataPoint[]).map((point, index) => {
          const percentage = ((point.value / total) * 100).toFixed(1);
          return (
            <Text key={index} accessibilityLabel={`${point.label}: ${point.value} (${percentage}%)`}>
              {point.label}: {point.value} ({percentage}%)
            </Text>
          );
        });
      
      default:
        return null;
    }
  };

  return (
    <View 
      accessible={true}
      accessibilityLabel={title}
      accessibilityHint={description || generateSummary()}
    >
      {/* Hidden text content for screen readers */}
      <View style={{ position: 'absolute', left: -10000, top: -10000 }}>
        {title && <Text accessibilityRole="header">{title}</Text>}
        {description && <Text>{description}</Text>}
        <Text>{generateSummary()}</Text>
        
        {/* Data table for screen readers */}
        <View accessible={true}>
          <Text accessibilityRole="header">Chart Data</Text>
          {generateDataTable()}
        </View>
      </View>
    </View>
  );
};

/**
 * Hook for keyboard navigation support
 */
export function useChartKeyboardNavigation(
  data: any[],
  onDataPointSelect?: (point: any, index: number) => void
) {
  const [selectedIndex, setSelectedIndex] = React.useState(-1);

  const handleKeyPress = React.useCallback((event: any) => {
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex(prev => {
          const newIndex = Math.min(prev + 1, data.length - 1);
          onDataPointSelect?.(data[newIndex], newIndex);
          return newIndex;
        });
        break;
      
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex(prev => {
          const newIndex = Math.max(prev - 1, 0);
          onDataPointSelect?.(data[newIndex], newIndex);
          return newIndex;
        });
        break;
      
      case 'Home':
        event.preventDefault();
        setSelectedIndex(0);
        onDataPointSelect?.(data[0], 0);
        break;
      
      case 'End':
        event.preventDefault();
        const lastIndex = data.length - 1;
        setSelectedIndex(lastIndex);
        onDataPointSelect?.(data[lastIndex], lastIndex);
        break;
    }
  }, [data, onDataPointSelect]);

  return {
    selectedIndex,
    setSelectedIndex,
    handleKeyPress,
  };
}
