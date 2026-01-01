import { AlgorithmNotFoundError } from '#core/helpers/errors.tsx';
import type {
  CoreFunctionContext,
  CoreStepActionPayload,
} from '#core/helpers/types.tsx';

import { playInsertValue } from './insert-value/play.tsx';
import { runInsertValue } from './insert-value/run.tsx';
import { playLinearSearch } from './linear-search/play.tsx';
import { playRemoveValue } from './remove-value/play.tsx';
import { runRemoveValue } from './remove-value/run.tsx';

const RUN_FUNCTION_MAPPING: Record<
  string,
  (context: CoreFunctionContext) => void
> = {
  'insert-value': runInsertValue,
  'remove-value': runRemoveValue,
};

const PLAY_FUNCTION_MAPPING: Record<
  string,
  (context: CoreFunctionContext) => Generator<CoreStepActionPayload>
> = {
  'insert-value': playInsertValue,
  'remove-value': playRemoveValue,
  'linear-search': playLinearSearch,
};

export async function getRunFunction(context: CoreFunctionContext) {
  const { algorithmID } = context;

  const runFunction = RUN_FUNCTION_MAPPING[algorithmID];

  if (!runFunction) throw new AlgorithmNotFoundError();

  return runFunction;
}

export async function getPlayFunction(context: CoreFunctionContext) {
  const { algorithmID } = context;

  const playFunction = PLAY_FUNCTION_MAPPING[algorithmID];

  if (!playFunction) throw new AlgorithmNotFoundError();

  return playFunction;
}
