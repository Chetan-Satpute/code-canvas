import { CoreNode } from '#core/elements/node.tsx';
import type {
  CoreFunctionContext,
  CoreFunctionRunReturn,
} from '#core/helpers/algorithms.tsx';

import type { CoreArray } from '../structure';

export function runInsertValue(
  context: CoreFunctionContext,
): CoreFunctionRunReturn {
  const { args, structure, board } = context;

  let index = args.index as number;
  const value = args.value as number;
  const array = structure as CoreArray;

  if (index < 0) index = 0;
  if (index >= array.nodes.length) index = array.nodes.length;

  array.nodes.splice(index, 0, new CoreNode(value));
  array.rearrange();

  const frames = [board.toFrame()];
  const data = array.toData();

  return { frames, data };
}
