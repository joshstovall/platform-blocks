import React, { useRef, useEffect, useState } from 'react';
import type { SimulationNode, SimulationLink } from './useNetworkSimulation';

interface UseAnimatedNetworkRenderingProps {
  nodes: SimulationNode[];
  links: SimulationLink[];
  tick: number;
}

interface AnimatedLinkData {
  source: SimulationNode;
  target: SimulationNode;
  weight: number;
  index: number;
  color?: string;
  opacity?: number;
  width?: number;
  meta?: any;
  parallelIndex: number;
  parallelCount: number;
}

export const useAnimatedNetworkRendering = ({ nodes, links, tick }: UseAnimatedNetworkRenderingProps) => {
  const [renderNodes, setRenderNodes] = useState<SimulationNode[]>([]);
  const [renderLinks, setRenderLinks] = useState<AnimatedLinkData[]>([]);
  const frameRef = useRef<number | null>(null);
  const lastTickRef = useRef(tick);

  useEffect(() => {
    // Only update render state occasionally to reduce React updates
    if (tick !== lastTickRef.current && tick % 2 === 0) {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      
      frameRef.current = requestAnimationFrame(() => {
        const nodeMap = new Map<string, SimulationNode>();
        nodes.forEach((node) => nodeMap.set(node.id, node));

        const pairCounts = links.reduce<Map<string, number>>((acc, link) => {
          const key = `${link.source}|${link.target}`;
          acc.set(key, (acc.get(key) ?? 0) + 1);
          return acc;
        }, new Map());

        const pairOffsets = new Map<string, number>();

        const processedLinks = links.reduce<AnimatedLinkData[]>((acc, link, index) => {
          const source = nodeMap.get(link.source);
          const target = nodeMap.get(link.target);
          if (!source || !target) {
            return acc;
          }

          const key = `${link.source}|${link.target}`;
          const total = pairCounts.get(key) ?? 1;
          const currentOffset = pairOffsets.get(key) ?? 0;
          pairOffsets.set(key, currentOffset + 1);

          acc.push({
            source,
            target,
            weight: link.weight,
            index,
            color: link.color,
            opacity: link.opacity,
            width: link.width,
            meta: link.meta,
            parallelIndex: currentOffset,
            parallelCount: total,
          });
          return acc;
        }, []);

        setRenderNodes([...nodes]);
        setRenderLinks(processedLinks);
        lastTickRef.current = tick;
        frameRef.current = null;
      });
    }

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [nodes, links, tick]);

  return { renderNodes, renderLinks };
};