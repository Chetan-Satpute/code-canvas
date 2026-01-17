import type { CoreFunctionContext } from './types';

export async function getRunFunction(context: CoreFunctionContext) {
  const { structureID } = context;

  switch (structureID) {
    case 'array':
      return import('#core/array/mappings.tsx').then((module) =>
        module.getRunFunction(context),
      );
    case 'linked-list':
      return import('#core/linked-list/mappings.tsx').then((module) =>
        module.getRunFunction(context),
      );
  }
}

export async function getPlayFunction(context: CoreFunctionContext) {
  const { structureID } = context;

  switch (structureID) {
    case 'array':
      return import('#core/array/mappings.tsx').then((module) =>
        module.getPlayFunction(context),
      );
    case 'linked-list':
      return import('#core/linked-list/mappings.tsx').then((module) =>
        module.getPlayFunction(context),
      );
  }
}
