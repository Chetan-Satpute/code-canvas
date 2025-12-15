import { type PropsWithChildren, useRef } from 'react';

import { PlayContextContext, type PlayContext } from '#context/playGenerator.tsx';

function PlayContextProvider(props: PropsWithChildren) {
  const playGeneratorRef = useRef<PlayContext>(null);

  return (
    <PlayContextContext.Provider value={playGeneratorRef}>
      {props.children}
    </PlayContextContext.Provider>
  );
}

export default PlayContextProvider;
