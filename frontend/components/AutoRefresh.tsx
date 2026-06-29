'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useTransition } from 'react';

export default function AutoRefresh({ intervalMs = 15000 }: { intervalMs?: number }) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  useEffect(() => {
    const interval = setInterval(() => {
      // Only refresh if the tab is active to prevent background fetch errors
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        startTransition(() => {
          try {
            router.refresh();
          } catch (error) {
            // Ignore Next.js internal router refresh errors
          }
        });
      }
    }, intervalMs);
    
    return () => clearInterval(interval);
  }, [router, intervalMs]);

  return null;
}
