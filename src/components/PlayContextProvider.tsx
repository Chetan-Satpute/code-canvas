import { type PropsWithChildren, useRef } from 'react';

import {
  type PlayContext,
  PlayContextContext,
} from '#context/playGenerator.tsx';

function PlayContextProvider(props: PropsWithChildren) {
  const playGeneratorRef = useRef<PlayContext>(null);

  return (
    <PlayContextContext.Provider value={playGeneratorRef}>
      {props.children}
    </PlayContextContext.Provider>
  );
}

export default PlayContextProvider;
