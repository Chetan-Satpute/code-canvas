import { AlgorithmNotFoundError } from './errors';
import { getPlayFunction, getRunFunction } from './mappings';
import { initContextStructure } from './structures';
import type { CoreFunctionContext } from './types';

export async function runAlgorithm(
  contextProps: Omit<CoreFunctionContext, 'board' | 'structure'>,
) {
  const context = initContextStructure(contextProps);
  const runFunction = await getRunFunction(context);

  if (!runFunction) throw new AlgorithmNotFoundError();

  runFunction(context);
}

export async function playAlgorithm(
  contextProps: Omit<CoreFunctionContext, 'board' | 'structure'>,
) {
  const context = initContextStructure(contextProps);
  const playFunction = await getPlayFunction(context);

  if (!playFunction) throw new AlgorithmNotFoundError();

  return playFunction(context);
}
