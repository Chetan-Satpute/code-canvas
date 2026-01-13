import { AlgorithmNotFoundError } from '#core/helpers/errors.tsx';
import type {
  CoreFunctionContext,
  CoreStepActionPayload,
} from '#core/helpers/types.tsx';

import { playBinarySearch } from './binary-search/play.tsx';
import { playInsertValue } from './insert-value/play.tsx';
import { runInsertValue } from './insert-value/run.tsx';
import { playLinearSearch } from './linear-search/play.tsx';
import { playMergeSort } from './merge-sort/play.tsx';
import { runRandomArray } from './random-array/run.tsx';
import { playRemoveValue } from './remove-value/play.tsx';
import { runRemoveValue } from './remove-value/run.tsx';
import { runSortArray } from './sort-array/run.tsx';

const RUN_FUNCTION_MAPPING: Record<
  string,
  (context: CoreFunctionContext) => void
> = {
  'random-array': runRandomArray,
  'insert-value': runInsertValue,
  'remove-value': runRemoveValue,
  'sort-array': runSortArray,
};

const PLAY_FUNCTION_MAPPING: Record<
  string,
  (context: CoreFunctionContext) => Generator<CoreStepActionPayload>
> = {
  'insert-value': playInsertValue,
  'remove-value': playRemoveValue,
  'linear-search': playLinearSearch,
  'binary-search': playBinarySearch,
  'merge-sort': playMergeSort,
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
