import { useState, useMemo } from 'react';
import { Text } from 'react-native';
import { NetworkChart } from '../../';
import type { NetworkLink, NetworkNode } from '../../types';

const TEAMS: NetworkNode[] = [
  { id: 'design-guild', name: 'Design Guild', group: 'product', value: 36, color: '#845EF7' },
  { id: 'frontend', name: 'Frontend', group: 'engineering', value: 52, color: '#4C6EF5' },
  { id: 'backend', name: 'Platform API', group: 'engineering', value: 58, color: '#228BE6' },
  { id: 'data-science', name: 'Data Science', group: 'analytics', value: 41, color: '#20C997' },
  { id: 'product-management', name: 'Product Management', group: 'product', value: 47, color: '#F59F00' },
  { id: 'customer-success', name: 'Customer Success', group: 'go-to-market', value: 33, color: '#FA5252' },
  { id: 'devrel', name: 'DevRel', group: 'growth', value: 26, color: '#9C36B5' },
];

const MENTORSHIPS: NetworkLink[] = [
  { source: 'frontend', target: 'design-guild', weight: 6.5, meta: { type: 'cross-team' } },
  { source: 'backend', target: 'frontend', weight: 7.2, meta: { type: 'pairing' } },
  { source: 'backend', target: 'data-science', weight: 4.1, meta: { type: 'cross-team' } },
  { source: 'product-management', target: 'design-guild', weight: 5.4, meta: { type: 'program' } },
  { source: 'product-management', target: 'customer-success', weight: 3.7, meta: { type: 'rotation' } },
  { source: 'devrel', target: 'frontend', weight: 2.9, meta: { type: 'cross-team' } },
  { source: 'devrel', target: 'customer-success', weight: 3.4, meta: { type: 'program' } },
  { source: 'data-science', target: 'product-management', weight: 4.6, meta: { type: 'pairing' } },
  { source: 'customer-success', target: 'design-guild', weight: 2.7, meta: { type: 'rotation' } },
];

const linkColorByType = (type: string | undefined) => {
  switch (type) {
    case 'cross-team':
      return '#5F3DC4';
    case 'program':
      return '#1971C2';
    case 'rotation':
      return '#FFA94D';
    case 'pairing':
      return '#15AABF';
    default:
      return '#ADB5BD';
  }
};

const linkOpacityByType = (type: string | undefined) => {
  switch (type) {
    case 'cross-team':
      return 0.72;
    case 'program':
      return 0.6;
    case 'rotation':
      return 0.55;
    case 'pairing':
      return 0.5;
    default:
      return 0.45;
  }
};

export default function Demo() {
  const [focusDetail, setFocusDetail] = useState<string | null>(null);

  const highlightText = useMemo(() => focusDetail, [focusDetail]);

  return (
    <>
      <NetworkChart
        title="Knowledge sharing mentorship graph"
        subtitle="Monthly mentorship hours across guild programs"
        width={660}
        height={440}
        layout="radial"
        nodes={TEAMS}
        links={MENTORSHIPS}
        showLabels
        nodeRadius={14}
        nodeRadiusRange={[12, 26]}
        linkWidthRange={[1.1, 3.8]}
        linkShape="curved"
        linkCurveStrength={0.38}
        linkPalette={["#7048E8", "#4263EB", "#0CA678", "#F08C00"]}
        linkColorAccessor={(link) => linkColorByType(link.meta?.type)}
        linkOpacityAccessor={(link) => linkOpacityByType(link.meta?.type)}
        onNodeFocus={(event) =>
          setFocusDetail(
            `${event.node.name ?? event.node.id} • ${Math.round(event.node.value ?? 0)} active mentorship hours`
          )
        }
        onNodeBlur={() => setFocusDetail(null)}
        onLinkFocus={(event) => {
          const sourceName = event.source.node?.name ?? event.link.source;
          const targetName = event.target.node?.name ?? event.link.target;
          setFocusDetail(`${sourceName} mentoring ${targetName}`);
        }}
        onLinkBlur={() => setFocusDetail(null)}
      />
      {highlightText && (
        <Text style={{ marginTop: 12, fontSize: 12, color: '#495057' }}>{highlightText}</Text>
      )}
    </>
  );
}
