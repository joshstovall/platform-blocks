import { useEffect, useRef } from 'react';
import { useTitleRegistryOptional, TitleItem } from '../contexts/TitleRegistryContext';

export interface UseTitleRegistrationOptions {
  /** Text content of the title */
  text: string;
  /** Order for sorting titles, lower numbers appear first */
  order: number;
  /** Optional ID, if not provided it will be generated from text */
  id?: string;
  /** Whether to automatically register/unregister the title */
  autoRegister?: boolean;
}

export const useTitleRegistration = (options: UseTitleRegistrationOptions) => {
  const registry = useTitleRegistryOptional();
  const elementRef = useRef<any>(null);
  const { text, order, id: providedId, autoRegister = true } = options;

  // Generate ID from text if not provided
  const id = providedId || text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  useEffect(() => {
    if (!registry || !autoRegister || !text) return;

    const titleItem: TitleItem = {
      id,
      text,
      order,
      ref: elementRef,
    };

    registry.registerTitle(titleItem);

    return () => {
      registry.unregisterTitle(id);
    };
  }, [registry, id, text, order, autoRegister]);

  return { elementRef, id };
};