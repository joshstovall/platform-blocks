// Basic plugin registry scaffold for future annotation system.
// Allows registering custom renderers keyed by shape or type.
export type AnnotationRenderer = (ctx: {
  annotation: any;
  scaleX: (v:number)=>number;
  scaleY: (v:number)=>number;
  plotWidth: number;
  plotHeight: number;
}) => any; // returns React element(s)

const registry: Record<string, AnnotationRenderer> = {};

export function registerAnnotationRenderer(shape: string, renderer: AnnotationRenderer) {
  registry[shape] = renderer;
}

export function getAnnotationRenderer(shape: string): AnnotationRenderer | undefined {
  return registry[shape];
}

export function renderAnnotation(a: any, helpers: Omit<Parameters<AnnotationRenderer>[0], 'annotation'>) {
  const r = registry[a.shape];
  return r ? r({ annotation: a, ...helpers }) : null;
}

// Pre-register simple vertical-line example (others can be added later)
registerAnnotationRenderer('vertical-line', ({ annotation, scaleX, plotHeight }) => {
  if (annotation.x == null) return null;
  const x = scaleX(annotation.x);
  return { type: 'line', x, height: plotHeight, color: annotation.color || '#6366f1' };
});