import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface TitleItem {
  id: string;
  text: string;
  order: number; // 1-6, maps to depth
  ref?: React.RefObject<any>;
}

interface TitleRegistryContextType {
  titles: TitleItem[];
  registerTitle: (title: TitleItem) => void;
  unregisterTitle: (id: string) => void;
  clearTitles: () => void;
}

const TitleRegistryContext = createContext<TitleRegistryContextType | null>(null);

export const useTitleRegistry = () => {
  const context = useContext(TitleRegistryContext);
  if (!context) {
    throw new Error('useTitleRegistry must be used within a TitleRegistryProvider');
  }
  return context;
};

export const useTitleRegistryOptional = () => {
  return useContext(TitleRegistryContext);
};

interface TitleRegistryProviderProps {
  children: ReactNode;
}

export const TitleRegistryProvider: React.FC<TitleRegistryProviderProps> = ({ children }) => {
  const [titles, setTitles] = useState<TitleItem[]>([]);

  const registerTitle = useCallback((title: TitleItem) => {
    setTitles(prev => {
      // Remove existing title with same id, then add new one
      const filtered = prev.filter(t => t.id !== title.id);
      return [...filtered, title].sort((a, b) => {
        // Sort by order first (depth), then by registration order
        if (a.order !== b.order) return a.order - b.order;
        return 0;
      });
    });
  }, []);

  const unregisterTitle = useCallback((id: string) => {
    setTitles(prev => prev.filter(t => t.id !== id));
  }, []);

  const clearTitles = useCallback(() => {
    setTitles([]);
  }, []);

  return (
    <TitleRegistryContext.Provider value={{
      titles,
      registerTitle,
      unregisterTitle,
      clearTitles
    }}>
      {children}
    </TitleRegistryContext.Provider>
  );
};