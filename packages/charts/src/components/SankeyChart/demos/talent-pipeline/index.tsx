import { SankeyChart } from '../../';

const NODES = [
  { id: 'campus', name: 'Campus Recruiting', color: '#60A5FA' },
  { id: 'bootcamp', name: 'Bootcamp Partners', color: '#34D399' },
  { id: 'referrals', name: 'Employee Referrals', color: '#FACC15' },
  { id: 'internal', name: 'Internal Mobility', color: '#F472B6' },
  { id: 'screening', name: 'Recruiter Screen', color: '#818CF8' },
  { id: 'technical', name: 'Technical Interview', color: '#A855F7' },
  { id: 'onsite', name: 'Onsite Panel', color: '#22D3EE' },
  { id: 'offer', name: 'Offer Stage', color: '#F97316' },
  { id: 'accepted', name: 'Accepted Offers', color: '#10B981' },
  { id: 'screening-drop', name: 'Screen Drops', color: '#EF4444' },
  { id: 'technical-drop', name: 'Technical Drops', color: '#DC2626' },
  { id: 'onsite-drop', name: 'Onsite Declines', color: '#B91C1C' },
  { id: 'offer-decline', name: 'Offer Declined', color: '#F43F5E' },
  { id: 'product-eng', name: 'Product Engineering', color: '#2563EB' },
  { id: 'platform-eng', name: 'Platform Engineering', color: '#7C3AED' },
  { id: 'data-science', name: 'Data Science', color: '#0EA5E9' },
];

const LINKS = [
  { source: 'campus', target: 'screening', value: 120 },
  { source: 'bootcamp', target: 'screening', value: 80 },
  { source: 'referrals', target: 'technical', value: 60 },
  { source: 'internal', target: 'technical', value: 30 },
  { source: 'screening', target: 'technical', value: 190 },
  { source: 'screening', target: 'screening-drop', value: 10 },
  { source: 'technical', target: 'onsite', value: 210 },
  { source: 'technical', target: 'technical-drop', value: 70 },
  { source: 'onsite', target: 'offer', value: 180 },
  { source: 'onsite', target: 'onsite-drop', value: 30 },
  { source: 'offer', target: 'accepted', value: 140 },
  { source: 'offer', target: 'offer-decline', value: 40 },
  { source: 'accepted', target: 'product-eng', value: 60 },
  { source: 'accepted', target: 'platform-eng', value: 45 },
  { source: 'accepted', target: 'data-science', value: 35 },
];

export default function Demo() {
  return (
    <SankeyChart
      title="Engineering talent pipeline"
      subtitle="Campus + lateral hiring"
      width={760}
      height={420}
      nodes={NODES}
      links={LINKS}
    />
  );
}
