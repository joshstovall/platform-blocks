import { useMemo, useRef, useEffect } from 'react';
import type { RegisteredSeries } from '../../interaction/ChartInteractionContext';

export interface NetworkRegistrationNode {
  id: string;
  name?: string;
  group?: string | number;
  value?: number;
  color?: string;
  x: number;
  y: number;
  meta?: any;
}

interface UseNetworkSeriesRegistrationOptions {
  nodes: NetworkRegistrationNode[];
  registerSeries?: (series: RegisteredSeries) => void;
}

const buildSignature = (series: RegisteredSeries[]) => {
  if (!series.length) return null;
  return series
    .map((entry) => {
      const pointsSignature = entry.points
        .map((point) => `${point.x.toFixed(2)}:${point.y.toFixed(2)}:${point.meta?.group ?? ''}`)
        .join('|');
      return `${entry.id}:${entry.name ?? ''}:${entry.color ?? ''}:${entry.visible ? 1 : 0}:${pointsSignature}`;
    })
    .join('||');
};

export const useNetworkSeriesRegistration = ({ nodes, registerSeries }: UseNetworkSeriesRegistrationOptions) => {
  const seriesPayload = useMemo<RegisteredSeries[]>(() => {
    if (!nodes.length) return [];

    const baseSeries: RegisteredSeries[] = [
      {
        id: 'network-nodes',
        name: 'Nodes',
        color: nodes[0]?.color,
        points: nodes.map((node) => ({
          x: node.x,
          y: node.y,
          meta: node,
        })),
        visible: true,
      },
    ];

    const clusters = nodes.reduce<Map<string | number, NetworkRegistrationNode[]>>((map, node) => {
      const key = node.group ?? 'ungrouped';
      const groupNodes = map.get(key) || [];
      groupNodes.push(node);
      map.set(key, groupNodes);
      return map;
    }, new Map());

    clusters.forEach((groupNodes, key) => {
      if (groupNodes.length <= 1) return;
      baseSeries.push({
        id: `network-cluster-${key}`,
        name: `Cluster ${String(key)}`,
        color: groupNodes[0]?.color,
        points: groupNodes.map((node) => ({
          x: node.x,
          y: node.y,
          meta: node,
        })),
        visible: true,
      });
    });

    return baseSeries;
  }, [nodes]);

  const signature = useMemo(() => buildSignature(seriesPayload), [seriesPayload]);
  const lastSignatureRef = useRef<string | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!registerSeries || !signature) return;
    if (lastSignatureRef.current === signature) return;

    if (rafRef.current != null && typeof cancelAnimationFrame === 'function') {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    if (typeof requestAnimationFrame === 'function') {
      rafRef.current = requestAnimationFrame(() => {
        seriesPayload.forEach((entry) => registerSeries(entry));
        lastSignatureRef.current = signature;
        rafRef.current = null;
      });
    } else {
      seriesPayload.forEach((entry) => registerSeries(entry));
      lastSignatureRef.current = signature;
    }

    return () => {
      if (rafRef.current != null && typeof cancelAnimationFrame === 'function') {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [signature, registerSeries, seriesPayload]);

  useEffect(() => {
    if (!signature) {
      lastSignatureRef.current = null;
    }
  }, [signature]);
};
