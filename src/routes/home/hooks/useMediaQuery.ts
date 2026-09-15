import { useCallback, useSyncExternalStore } from 'react';

// Whether the viewport currently matches a CSS media query, and re-renders
// when that changes. Tailwind's breakpoints cover anything that is purely a
// matter of styling; this is for the cases where a component should not be
// mounted at all on a narrow screen rather than mounted and hidden.
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const list = window.matchMedia(query);

      list.addEventListener('change', onStoreChange);

      return () => list.removeEventListener('change', onStoreChange);
    },
    [query],
  );

  const getSnapshot = useCallback(
    () => window.matchMedia(query).matches,
    [query],
  );

  return useSyncExternalStore(subscribe, getSnapshot);
}
