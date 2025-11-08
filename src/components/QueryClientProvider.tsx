import type { PropsWithChildren } from 'react';

import { QueryClientProvider as TanstackQueryClientProvider } from '@tanstack/react-query';

import { client } from '#queries/client.tsx';

function QueryClientProvider({ children }: PropsWithChildren) {
  return (
    <TanstackQueryClientProvider client={client}>
      {children}
    </TanstackQueryClientProvider>
  );
}

export default QueryClientProvider;
