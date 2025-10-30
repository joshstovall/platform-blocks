import { ChartDataPoint } from '../types';

/**
 * Spatial indexing for efficient nearest neighbor searches
 * Uses a simple grid-based approach for O(1) average lookup
 */
export class SpatialIndex {
  /** Grid map storing points by grid cell */
  private grid: Map<string, ChartDataPoint[]>;
  /** Size of each grid cell */
  private gridSize: number;
  /** Bounds of the data space */
  private bounds: { minX: number; maxX: number; minY: number; maxY: number };

  /**
   * Creates a new spatial index
   * @param data - Array of data points to index
   * @param gridSize - Size of grid cells (default 20)
   */
  constructor(
    data: ChartDataPoint[],
    gridSize: number = 20
  ) {
    this.grid = new Map();
    this.gridSize = gridSize;
    this.bounds = this.calculateBounds(data);
    this.buildIndex(data);
  }

  private calculateBounds(data: ChartDataPoint[]) {
    if (data.length === 0) {
      return { minX: 0, maxX: 1, minY: 0, maxY: 1 };
    }

    return data.reduce(
      (bounds, point) => ({
        minX: Math.min(bounds.minX, point.x),
        maxX: Math.max(bounds.maxX, point.x),
        minY: Math.min(bounds.minY, point.y),
        maxY: Math.max(bounds.maxY, point.y),
      }),
      { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity }
    );
  }

  private getGridKey(x: number, y: number): string {
    const gridX = Math.floor((x - this.bounds.minX) / this.gridSize);
    const gridY = Math.floor((y - this.bounds.minY) / this.gridSize);
    return `${gridX},${gridY}`;
  }

  private buildIndex(data: ChartDataPoint[]) {
    data.forEach(point => {
      const key = this.getGridKey(point.x, point.y);
      if (!this.grid.has(key)) {
        this.grid.set(key, []);
      }
      this.grid.get(key)!.push(point);
    });
  }

  /**
   * Find closest point within maxDistance
   * O(1) average case vs O(n) linear search
   */
  findClosest(
    x: number, 
    y: number, 
    maxDistance: number = 20
  ): { dataPoint: ChartDataPoint; distance: number } | null {
    const gridX = Math.floor((x - this.bounds.minX) / this.gridSize);
    const gridY = Math.floor((y - this.bounds.minY) / this.gridSize);
    
    let closestPoint: ChartDataPoint | null = null;
    let closestDistance = Infinity;

    // Check current and neighboring grid cells
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const key = `${gridX + dx},${gridY + dy}`;
        const points = this.grid.get(key);
        
        if (points) {
          for (const point of points) {
            const distance = Math.sqrt(
              Math.pow(x - point.x, 2) + Math.pow(y - point.y, 2)
            );
            
            if (distance < closestDistance && distance <= maxDistance) {
              closestDistance = distance;
              closestPoint = point;
            }
          }
        }
      }
    }

    return closestPoint ? { dataPoint: closestPoint, distance: closestDistance } : null;
  }
}
