'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { SmoothScrollProvider } from './SmoothScrollProvider';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { LoadingScreen } from '@/components/LoadingScreen';
import { SourceProtection } from './SourceProtection';

const AppReadyContext = createContext(false);

/** Hard ceiling: the homepage must never stay gated behind the loading screen, no matter what. */
const READY_FAILSAFE_MS = 12000;

/** True once the loading screen has finished, gates the hero's one-shot entrance animations. */
export function useAppReady(): boolean {
  return useContext(AppReadyContext);
}

export function AppShell({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (ready) return;
    const failsafe = window.setTimeout(() => setReady(true), READY_FAILSAFE_MS);
    return () => window.clearTimeout(failsafe);
  }, [ready]);

  return (
    <AppReadyContext.Provider value={ready}>
      <LoadingScreen onComplete={() => setReady(true)} />
      <SourceProtection />
      <SmoothScrollProvider>
        <CustomCursor />
        {children}
      </SmoothScrollProvider>
    </AppReadyContext.Provider>
  );
}
