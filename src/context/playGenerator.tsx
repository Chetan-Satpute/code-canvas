import React from 'react';

import type { CoreStepActionPayload } from '#core/helpers/types.tsx';

export interface PlayContext {
  generator: Generator<CoreStepActionPayload>;
  structureData: unknown;
}

export const PlayContextContext = React.createContext(
  React.createRef<PlayContext>(),
);
