import { useEffect } from 'react';
import { useChartInteractionContext } from '../interaction/ChartInteractionContext';

/**
 * Options for useDomains hook
 */
export interface UseDomainsOpts {
  /** X-axis domain range */
  xDomain: [number, number];
  /** Y-axis domain range */
  yDomain: [number, number];
}

/**
 * Hook that initializes and returns the current chart domains
 * @param opts - Domain configuration options
 * @returns Current domain state (either from context or initial values)
 */
export const useDomains = (opts: UseDomainsOpts) => {
  const { domains, initializeDomains } = useChartInteractionContext();
  useEffect(() => {
    if (!domains) {
      initializeDomains({ x: opts.xDomain, y: opts.yDomain });
    }
  }, [domains, opts.xDomain[0], opts.xDomain[1], opts.yDomain[0], opts.yDomain[1]]);
  return domains?.current || { x: opts.xDomain, y: opts.yDomain };
};
