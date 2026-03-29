import { FunnelChart } from '../../';

type CheckoutMeta = {
  insight?: string;
  paymentSplit?: {
    stripe: number;
    paypal: number;
    bnpl: number;
  };
};

const CHECKOUT_FUNNEL = {
  id: 'checkout-flow',
  name: 'Checkout completion',
  steps: [
    { label: 'Sessions with product views', value: 158_000, color: '#7c3aed' },
    { label: 'Carts created', value: 89_400, color: '#8b5cf6', meta: { insight: 'Shipping cost surprises prompt abandon' } as CheckoutMeta },
    { label: 'Shipping details submitted', value: 74_200, color: '#a855f7', meta: { insight: 'Address autocomplete boosted completion +12%' } as CheckoutMeta },
    { label: 'Payment initiated', value: 51_200, color: '#c084fc', meta: { insight: 'Card validations reject 28% due to CVV retries' } as CheckoutMeta },
    { label: 'Orders completed', value: 38_600, color: '#d8b4fe', meta: { paymentSplit: { stripe: 0.52, paypal: 0.31, bnpl: 0.17 } } as CheckoutMeta },
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
      subtitle="Drop-off insights by stage with payment provider mix"
      width={660}
      height={500}
      series={CHECKOUT_FUNNEL}
      layout={{
        shape: 'trapezoid',
        gap: 14,
        align: 'center',
        minSegmentHeight: 60,
        showConversion: false,
      }}
      valueFormatter={(value, index, context) => {
        const step = CHECKOUT_FUNNEL.steps[index];
        const meta = step.meta as CheckoutMeta | undefined;
        const lines: string[] = [`${value.toLocaleString()} sessions`];
        if (context?.previousValue) {
          const dropRate = (context.dropRate * 100).toFixed(1);
          lines.push(`Drop ${context.dropValue.toLocaleString()} (${dropRate}%)`);
        } else {
          lines.push('Discovery traffic');
        }
        if (meta?.insight) {
          lines.push(meta.insight);
        }
        const paymentSplit = formatPaymentSplit(meta?.paymentSplit);
        if (paymentSplit) {
          lines.push(paymentSplit);
        }
        if (context) {
          lines.push(`Retention ${(context.conversion * 100).toFixed(1)}% of product views`);
        }
        return lines;
      }}
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
