import { useContext } from 'react';

import { PlayContextContext } from '#context/playGenerator.tsx';

export function usePlayContextRef() {
  return useContext(PlayContextContext);
}
