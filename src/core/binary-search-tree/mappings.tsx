import { AlgorithmNotFoundError } from '#core/helpers/errors.tsx';
import type {
  CoreFunctionContext,
  CoreStepActionPayload,
} from '#core/helpers/types.tsx';

import { playInsert } from './insert/play';
import { runInsert } from './insert/run';
import { runRandomBST } from './random-bst/run';
import { playRemove } from './remove/play';
import { runRemove } from './remove/run';

const RUN_FUNCTION_MAPPING: Record<
  string,
  (context: CoreFunctionContext) => void
> = {
  'random-bst': runRandomBST,
  insert: runInsert,
  remove: runRemove,
};

const PLAY_FUNCTION_MAPPING: Record<
  string,
  (context: CoreFunctionContext) => Generator<CoreStepActionPayload>
> = {
  insert: playInsert,
  remove: playRemove,
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
