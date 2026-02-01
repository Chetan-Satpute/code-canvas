import { AlgorithmNotFoundError } from '#core/helpers/errors.tsx';
import type {
  CoreFunctionContext,
  CoreStepActionPayload,
} from '#core/helpers/types.tsx';

import { playPop } from './pop/play';
import { runPop } from './pop/run';
import { playPush } from './push/play';
import { runPush } from './push/run';
import { runRandomHeap } from './random-heap/run';

const RUN_FUNCTION_MAPPING: Record<
  string,
  (context: CoreFunctionContext) => void
> = {
  'random-heap': runRandomHeap,
  push: runPush,
  pop: runPop,
};

const PLAY_FUNCTION_MAPPING: Record<
  string,
  (context: CoreFunctionContext) => Generator<CoreStepActionPayload>
> = {
  pop: playPop,
  push: playPush,
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
