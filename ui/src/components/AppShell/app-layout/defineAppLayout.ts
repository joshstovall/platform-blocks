import type { AppLayoutBlueprint } from './types';

export const defineAppLayout = <T extends AppLayoutBlueprint>(blueprint: T): T => {
  if (!blueprint || typeof blueprint !== 'object') {
    throw new Error('defineAppLayout expects a blueprint object');
  }
  if (!blueprint.id) {
    throw new Error('App layout blueprint must include an "id"');
  }
  return Object.freeze({ ...blueprint });
};
