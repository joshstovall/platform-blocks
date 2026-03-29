import { ChartDataPoint, LineChartSeries, PieChartDataPoint, BarChartDataPoint } from '../types';

/**
 * Utility class for validating and sanitizing chart data
 */
export class ChartDataValidator {
  /**
   * Validate and sanitize chart data points
   * @param data - Array of chart data points to validate
   * @returns Validation result with errors and sanitized data
   */
  static validateChartData(data: ChartDataPoint[]): {
    isValid: boolean;
    errors: string[];
    sanitizedData: ChartDataPoint[];
  } {
    const errors: string[] = [];
    const sanitizedData: ChartDataPoint[] = [];

    if (!Array.isArray(data)) {
      return {
        isValid: false,
        errors: ['Data must be an array'],
        sanitizedData: [],
      };
    }

    data.forEach((point, index) => {
      const pointErrors: string[] = [];

      // Validate required fields
      if (typeof point.x !== 'number' || !isFinite(point.x)) {
        pointErrors.push(`Point ${index}: x must be a finite number`);
      }
      
      if (typeof point.y !== 'number' || !isFinite(point.y)) {
        pointErrors.push(`Point ${index}: y must be a finite number`);
      }

      if (pointErrors.length === 0) {
        sanitizedData.push({
          id: point.id || `point-${index}`,
          x: point.x,
          y: point.y,
          label: point.label || `Point ${index + 1}`,
          color: point.color,
          size: point.size && point.size > 0 ? point.size : undefined,
          data: point.data,
        });
      } else {
        errors.push(...pointErrors);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedData,
    };
  }

  /**
   * Validate line chart series
   */
  static validateLineChartSeries(series: LineChartSeries[]): {
    isValid: boolean;
    errors: string[];
    sanitizedSeries: LineChartSeries[];
  } {
    const errors: string[] = [];
    const sanitizedSeries: LineChartSeries[] = [];

    if (!Array.isArray(series)) {
      return {
        isValid: false,
        errors: ['Series must be an array'],
        sanitizedSeries: [],
      };
    }

    series.forEach((seriesItem, index) => {
      const seriesErrors: string[] = [];

      if (!seriesItem.data || !Array.isArray(seriesItem.data)) {
        seriesErrors.push(`Series ${index}: data must be an array`);
      } else {
        const dataValidation = this.validateChartData(seriesItem.data);
        if (!dataValidation.isValid) {
          seriesErrors.push(...dataValidation.errors.map(err => `Series ${index}: ${err}`));
        } else {
          sanitizedSeries.push({
            id: seriesItem.id || `series-${index}`,
            name: seriesItem.name || `Series ${index + 1}`,
            data: dataValidation.sanitizedData,
            color: seriesItem.color,
            thickness: seriesItem.thickness && seriesItem.thickness > 0 ? seriesItem.thickness : 2,
            style: seriesItem.style || 'solid',
            showPoints: seriesItem.showPoints !== false,
            pointSize: seriesItem.pointSize && seriesItem.pointSize > 0 ? seriesItem.pointSize : 4,
            pointColor: seriesItem.pointColor,
            visible: seriesItem.visible !== false,
            metadata: seriesItem.metadata,
          });
        }
      }

      errors.push(...seriesErrors);
    });

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedSeries,
    };
  }

  /**
   * Validate pie chart data
   */
  static validatePieChartData(data: PieChartDataPoint[]): {
    isValid: boolean;
    errors: string[];
    sanitizedData: PieChartDataPoint[];
  } {
    const errors: string[] = [];
    const sanitizedData: PieChartDataPoint[] = [];

    if (!Array.isArray(data)) {
      return {
        isValid: false,
        errors: ['Data must be an array'],
        sanitizedData: [],
      };
    }

    data.forEach((point, index) => {
      const pointErrors: string[] = [];

      if (typeof point.value !== 'number' || !isFinite(point.value) || point.value < 0) {
        pointErrors.push(`Point ${index}: value must be a non-negative finite number`);
      }

      if (!point.label || typeof point.label !== 'string') {
        pointErrors.push(`Point ${index}: label must be a non-empty string`);
      }

      if (pointErrors.length === 0) {
        sanitizedData.push({
          id: point.id || `slice-${index}`,
          value: point.value,
          label: point.label,
          color: point.color,
          data: point.data,
        });
      } else {
        errors.push(...pointErrors);
      }
    });

    // Check if total value is reasonable
    const totalValue = sanitizedData.reduce((sum, point) => sum + point.value, 0);
    if (totalValue === 0) {
      errors.push('Total value of all slices cannot be zero');
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedData,
    };
  }
}
