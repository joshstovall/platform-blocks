export const toRadians = (deg: number) => {
  'worklet';
  return (deg * Math.PI) / 180;
};

export const polarToCartesian = (cx: number, cy: number, radius: number, angleDeg: number) => {
  const rad = toRadians(angleDeg);
  return {
    x: cx + Math.sin(rad) * radius,
    y: cy - Math.cos(rad) * radius,
  };
};

export const getPositionRadius = (
  ringRadius: number,
  ringThickness: number,
  position: 'inner' | 'center' | 'outer' = 'center',
  radiusOffset: number = 0
) => {
  const offset =
    position === 'inner'
      ? -ringThickness / 2
      : position === 'outer'
        ? ringThickness / 2
        : 0;
  return ringRadius + offset + radiusOffset;
};
