import { getRunFunction } from './mappings';
import { initContextStructure } from './structures';
import type { CoreFunctionContext } from './types';

export async function runAlgorithm(
  contextProps: Omit<CoreFunctionContext, 'board' | 'structure'>,
) {
  const context = initContextStructure(contextProps);
  const runFunction = await getRunFunction(context);

  if (!runFunction) return;

  runFunction(context);
}
