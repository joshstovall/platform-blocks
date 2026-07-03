import { FunnelChart } from '../../';

type CheckoutMeta = {
  insight?: string;
  paymentSplit?: {
    stripe: number;
    paypal: number;
    bnpl: number;
  };
};

const compact = (value: number) => {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (abs >= 1_000) return `${(value / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
  return `${value}`;
};

const CHECKOUT_FUNNEL = {
  id: 'checkout-flow',
  name: 'Checkout completion',
  steps: [
    { label: 'Product views', value: 158_000, color: '#7c3aed' },
    { label: 'Carts', value: 89_400, color: '#8b5cf6', meta: { insight: 'Shipping cost surprises prompt abandon' } as CheckoutMeta },
    { label: 'Shipping', value: 74_200, color: '#a855f7', meta: { insight: 'Address autocomplete boosted completion +12%' } as CheckoutMeta },
    { label: 'Payment', value: 51_200, color: '#c084fc', meta: { insight: 'Card validations reject 28% due to CVV retries' } as CheckoutMeta },
    { label: 'Orders', value: 38_600, color: '#d8b4fe', meta: { paymentSplit: { stripe: 0.52, paypal: 0.31, bnpl: 0.17 } } as CheckoutMeta },
  ],
};

const formatPaymentSplit = (split: CheckoutMeta['paymentSplit']) => {
  if (!split) return undefined;
  return `Payment mix: ${Math.round(split.stripe * 100)}% Stripe • ${Math.round(split.paypal * 100)}% PayPal • ${Math.round(split.bnpl * 100)}% BNPL`;
};

export default function Demo() {
  return (
    <FunnelChart
      title="Ecommerce checkout conversion"
      subtitle="Drop-off by stage"
      width={520}
      height={440}
      series={CHECKOUT_FUNNEL}
      layout={{
        shape: 'trapezoid',
        gap: 8,
        align: 'center',
        showConversion: false,
        connectors: { show: false },
      }}
      valueFormatter={(value) => compact(value)}
      legend={{ show: false }}
      tooltip={{
        show: true,
        formatter: (step) => {
          const idx = CHECKOUT_FUNNEL.steps.findIndex((candidate) => candidate.label === step.label);
          const previous = idx > 0 ? CHECKOUT_FUNNEL.steps[idx - 1] : undefined;
          const dropValue = previous ? previous.value - step.value : 0;
          const dropRate = previous && previous.value > 0 ? (dropValue / previous.value) * 100 : 0;
          const meta = step.meta as CheckoutMeta | undefined;
          const paymentSplit = formatPaymentSplit(meta?.paymentSplit);
          return [
            step.label,
            `${step.value.toLocaleString()} sessions`,
            previous ? `Drop: ${dropValue.toLocaleString()} (${dropRate.toFixed(1)}%)` : 'Entry point',
            meta?.insight,
            paymentSplit,
          ]
            .filter(Boolean)
            .join('\n');
        },
      }}
    />
  );
}
