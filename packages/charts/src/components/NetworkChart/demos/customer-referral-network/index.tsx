import { NetworkChart } from '../../';
import type { NetworkLink, NetworkNode } from '../../types';

const COHORTS: NetworkNode[] = [
  { id: 'seed-advocates', name: 'Seed Advocates', group: 'seed', value: 38, color: '#12B886' },
  { id: 'growth-us', name: 'Growth - US', group: 'growth', value: 44, color: '#228BE6' },
  { id: 'growth-eu', name: 'Growth - EU', group: 'growth', value: 36, color: '#15AABF' },
  { id: 'enterprise-wave', name: 'Enterprise Wave', group: 'enterprise', value: 29, color: '#F76707' },
  { id: 'partner-ecosystem', name: 'Partner Ecosystem', group: 'partners', value: 24, color: '#845EF7' },
  { id: 'freemium-community', name: 'Freemium Community', group: 'seed', value: 50, color: '#5C7CFA' },
  { id: 'latam-expansion', name: 'LATAM Expansion', group: 'growth', value: 31, color: '#FF922B' },
];

const REFERRALS: NetworkLink[] = [
  { source: 'seed-advocates', target: 'freemium-community', weight: 6.4, meta: { wave: 1 } },
  { source: 'seed-advocates', target: 'growth-us', weight: 4.7, meta: { wave: 1 } },
  { source: 'freemium-community', target: 'growth-eu', weight: 3.8, meta: { wave: 2 } },
  { source: 'growth-us', target: 'enterprise-wave', weight: 3.3, meta: { wave: 2 } },
  { source: 'growth-eu', target: 'enterprise-wave', weight: 2.6, meta: { wave: 3 } },
  { source: 'partner-ecosystem', target: 'enterprise-wave', weight: 3.9, meta: { wave: 1 } },
  { source: 'partner-ecosystem', target: 'growth-us', weight: 2.4, meta: { wave: 2 } },
  { source: 'latam-expansion', target: 'growth-eu', weight: 3.2, meta: { wave: 2 } },
  { source: 'latam-expansion', target: 'freemium-community', weight: 2.7, meta: { wave: 3 } },
];

const waveToColor = (wave?: number) => {
  if (wave === 1) return '#34C759';
  if (wave === 2) return '#4DABF7';
  if (wave === 3) return '#FF922B';
  return '#ADB5BD';
};

const waveToOpacity = (wave?: number) => {
  if (wave === 1) return 0.7;
  if (wave === 2) return 0.6;
  if (wave === 3) return 0.55;
  return 0.45;
};

export default function Demo() {
  return (
    <NetworkChart
      title="Customer referral influence network"
      subtitle="Referral pathways by activation wave"
      width={660}
      height={430}
      nodes={COHORTS}
      links={REFERRALS}
      showLabels
      nodeRadius={13}
      nodeRadiusRange={[11, 25]}
      linkWidthRange={[1, 3.6]}
      linkColorAccessor={(link) => waveToColor(typeof link.meta?.wave === 'number' ? link.meta.wave : Number(link.meta?.wave))}
      linkOpacityAccessor={(link) => waveToOpacity(typeof link.meta?.wave === 'number' ? link.meta.wave : Number(link.meta?.wave))}
    />
  );
}
