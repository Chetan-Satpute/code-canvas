import { createAsyncThunk } from '@reduxjs/toolkit';

import {
  type CoreFunctionContext,
  runAlgorithms,
} from '#core/helpers/algorithms.tsx';
import { setFrames, setStructureData } from '#redux/slice.ts';
import type { RootState } from '#redux/types.tsx';

export const runAlgorithm = createAsyncThunk(
  'algorithm/run',
  async (
    {
      structureID,
      algorithmID,
      args,
    }: Pick<CoreFunctionContext, 'structureID' | 'algorithmID' | 'args'>,
    thunkAPI,
  ) => {
    const state = thunkAPI.getState() as RootState;
    const {
      app: { structureData },
    } = state;

    const result = runAlgorithms({
      data: structureData,
      structureID,
      algorithmID,
      args,
    });

    if (!result) return;

    const { frames, data } = result;

    // TODO: Maybe pass dispatch in the context so we don't have to handle anything specific to execution here??
    thunkAPI.dispatch(setFrames(frames));
    thunkAPI.dispatch(setStructureData(data));
  },
);
