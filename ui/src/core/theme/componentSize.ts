const COMPONENT_SIZE_BASE = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] as const;

export const COMPONENT_SIZE_ORDER = COMPONENT_SIZE_BASE;
export type ComponentSize = (typeof COMPONENT_SIZE_ORDER)[number];
export type ComponentSizeValue = ComponentSize | number;

export const DEFAULT_COMPONENT_SIZE: ComponentSize = 'md';

const ORDER_LOOKUP: Record<ComponentSize, number> = COMPONENT_SIZE_ORDER.reduce((acc, size, index) => {
  acc[size] = index;
  return acc;
}, {} as Record<ComponentSize, number>);

export function isComponentSize(value: unknown): value is ComponentSize {
  return typeof value === 'string' && (COMPONENT_SIZE_ORDER as readonly string[]).includes(value);
}

export function clampComponentSize(
  value: ComponentSizeValue | undefined,
  allowedSizes: ReadonlyArray<ComponentSize> = COMPONENT_SIZE_ORDER,
  fallback: ComponentSize = DEFAULT_COMPONENT_SIZE
): ComponentSizeValue {
  if (value === undefined) {
    return allowedSizes.length > 0 ? normalizeToAllowed(fallback, allowedSizes) : fallback;
  }

  if (typeof value === 'number') {
    return value;
  }

  if (!allowedSizes.length) {
    return value;
  }

  const normalizedAllowed = normalizeAllowed(allowedSizes);

  if (normalizedAllowed.set.has(value)) {
    return value;
  }

  const requestedIndex = ORDER_LOOKUP[value];
  if (requestedIndex === undefined) {
    return normalizedAllowed.sorted[0] ?? fallback;
  }

  for (const candidate of normalizedAllowed.sorted) {
    if (ORDER_LOOKUP[candidate] >= requestedIndex) {
      return candidate;
    }
  }

  return normalizedAllowed.sorted[normalizedAllowed.sorted.length - 1] ?? fallback;
}

export function resolveComponentSize<T>(
  value: ComponentSizeValue | undefined,
  scale: Partial<Record<ComponentSize, T>>,
  options: {
    fallback?: ComponentSize;
    allowedSizes?: ComponentSize[];
  } = {}
): T | number {
  const fallback = options.fallback ?? DEFAULT_COMPONENT_SIZE;
  const allowed = options.allowedSizes ?? (Object.keys(scale) as ComponentSize[]);

  const normalized = clampComponentSize(value ?? fallback, allowed, fallback);

  if (typeof normalized === 'number') {
    return normalized;
  }

  const resolved = scale[normalized];
  if (resolved !== undefined) {
    return resolved;
  }

  const fallbackValue = scale[fallback];
  if (fallbackValue !== undefined) {
    return fallbackValue;
  }

  const firstAvailable = allowed.find(key => scale[key] !== undefined);
  if (firstAvailable && scale[firstAvailable] !== undefined) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return scale[firstAvailable]!;
  }

  throw new Error('resolveComponentSize: no matching size found in provided scale.');
}

function normalizeAllowed(sizes: ReadonlyArray<ComponentSize>) {
  const unique = Array.from(new Set(sizes));
  const sorted = unique.sort((a, b) => ORDER_LOOKUP[a] - ORDER_LOOKUP[b]);
  const set = new Set(sorted);
  return { sorted, set } as const;
}

function normalizeToAllowed(value: ComponentSize, allowed: ReadonlyArray<ComponentSize>) {
  if (!allowed.length) {
    return value;
  }

  const { set, sorted } = normalizeAllowed(allowed);
  if (set.has(value)) {
    return value;
  }

  const fallbackIndex = ORDER_LOOKUP[value] ?? ORDER_LOOKUP[DEFAULT_COMPONENT_SIZE];
  for (const candidate of sorted) {
    if (ORDER_LOOKUP[candidate] >= fallbackIndex) {
      return candidate;
    }
  }
  return sorted[sorted.length - 1];
}
