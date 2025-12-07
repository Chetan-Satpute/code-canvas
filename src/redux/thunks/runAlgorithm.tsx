import { createAsyncThunk } from '@reduxjs/toolkit';

import {
  type CoreFunctionContext,
  runAlgorithms,
} from '#core/helpers/algorithms.tsx';
import { type RootState } from '#redux/types.tsx';

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

    runAlgorithms({
      data: structureData,
      structureID,
      algorithmID,
      args,
      dispatch: thunkAPI.dispatch,
    });
  },
);
