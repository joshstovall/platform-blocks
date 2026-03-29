// Kernel Density Estimation utilities shared by Ridge & Violin charts

/**
 * Options for kernel density estimation
 */
export interface KDEOptions {
  /** Bandwidth parameter (if omitted, uses Silverman's rule) */
  bandwidth?: number;
  /** Number of x positions to sample */
  samples?: number;
  /** Kernel function type */
  kernel?: 'gaussian';
}

/**
 * Gaussian kernel function
 * @param u - Normalized distance
 * @returns Kernel weight
 */
const gaussian = (u:number) => Math.exp(-0.5*u*u) / Math.sqrt(2*Math.PI);

/**
 * Calculates bandwidth using Silverman's rule of thumb
 * @param values - Array of data values
 * @returns Calculated bandwidth
 */
export function silvermanBandwidth(values:number[]) {
  const n = values.length;
  if(n<2) return 1;
  const mean = values.reduce((a,b)=>a+b,0)/n;
  const variance = values.reduce((a,b)=> a + (b-mean)*(b-mean),0)/ (n-1);
  const sd = Math.sqrt(Math.max(variance, 1e-9));
  const iqrVals = [...values].sort((a,b)=>a-b);
  const q1 = iqrVals[Math.floor(0.25*(n-1))];
  const q3 = iqrVals[Math.floor(0.75*(n-1))];
  const iqr = q3 - q1 || sd; // fallback
  const sigma = Math.min(sd, iqr/1.34) || sd || 1;
  return 1.06 * sigma * Math.pow(n, -1/5);
}

/**
 * Performs kernel density estimation on a dataset
 * @param values - Array of data values
 * @param domain - Range to evaluate the density over [min, max]
 * @param opts - KDE options
 * @returns Array of {x, y} density curve points
 */
export function kde(values:number[], domain:[number,number], opts:KDEOptions={}): { x:number; y:number }[] {
  if(!values.length) return [];
  const { bandwidth, samples=64 } = opts;
  const bw = bandwidth ?? silvermanBandwidth(values);
  const [min,max] = domain;
  const step = (max-min)/(samples-1);
  const coeff = 1/(values.length * bw);
  const out: {x:number;y:number}[] = [];
  for(let i=0;i<samples;i++){
    const x = min + i*step;
    let sum = 0;
    for(let j=0;j<values.length;j++){
      sum += gaussian((x - values[j])/bw);
    }
    out.push({ x, y: coeff * sum });
  }
  return out;
}

/**
 * Normalizes density values to 0-1 range
 * @param points - Array of density curve points
 * @returns Normalized points
 */
export function normalizeDensity(points:{x:number;y:number}[]): {x:number;y:number}[] {
  if(!points.length) return points;
  const max = points.reduce((m,p)=> p.y>m?p.y:m, 0) || 1;
  return points.map(p=> ({ x:p.x, y: p.y / max }));
}
