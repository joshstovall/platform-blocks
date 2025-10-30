import * as React from 'react';

interface HapticsContextValue {
  enabled: boolean;
  setEnabled: (v: boolean) => void;
  temporarilyDisable: (ms: number) => void;
}

const HapticsContext = React.createContext<HapticsContextValue | undefined>(undefined);

export interface HapticsProviderProps {
  children: React.ReactNode;
  defaultEnabled?: boolean;
}

export const HapticsProvider: React.FC<HapticsProviderProps> = ({ children, defaultEnabled = true }) => {
  const [enabled, setEnabled] = React.useState(defaultEnabled);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const temporarilyDisable = React.useCallback((ms: number) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setEnabled(false);
    timeoutRef.current = setTimeout(() => setEnabled(true), ms);
  }, []);

  React.useEffect(() => () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }, []);

  return (
    <HapticsContext.Provider value={{ enabled, setEnabled, temporarilyDisable }}>
      {children}
    </HapticsContext.Provider>
  );
};

export function useHapticsSettings(): HapticsContextValue {
  const ctx = React.useContext(HapticsContext);
  if (!ctx) throw new Error('useHapticsSettings must be used within <HapticsProvider>');
  return ctx;
}

export function useOptionalHapticsSettings(): HapticsContextValue | undefined {
  return React.useContext(HapticsContext);
}
