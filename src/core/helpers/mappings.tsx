import type { CoreFunctionContext } from './types';

export async function getRunFunction(context: CoreFunctionContext) {
  const { algorithmID, structureID } = context;

  switch (structureID) {
    case 'array':
      switch (algorithmID) {
        case 'insert-value':
          return import('#core/array/insert-value/run.tsx').then(
            (module) => module.runInsertValue,
          );
      }
  }
}
