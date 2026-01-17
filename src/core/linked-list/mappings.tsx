import { AlgorithmNotFoundError } from '#core/helpers/errors.tsx';
import type {
  CoreFunctionContext,
  CoreStepActionPayload,
} from '#core/helpers/types.tsx';

import { runRandomLinkedList } from './random-linked-list/run';

const RUN_FUNCTION_MAPPING: Record<
  string,
  (context: CoreFunctionContext) => void
> = {
  'random-linked-list': runRandomLinkedList,
};

const PLAY_FUNCTION_MAPPING: Record<
  string,
  (context: CoreFunctionContext) => Generator<CoreStepActionPayload>
> = {};

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
