import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

import type { CanvasFrame } from '#canvas/frame.tsx';
import type { CoreFunction } from '#core/elements/function.tsx';

interface AppSlice {
  structureData: unknown;
  activeCodeLine: number;
  frames: CanvasFrame[];
  callStack: CoreFunction[];
}

const initialState: AppSlice = {
  structureData: null,
  activeCodeLine: 0,
  frames: [],
  callStack: [
    {
      name: 'linearSearch',
      arguments: [
        { parameter: 'array', argument: [1, 2, 3, 4, 5] },
        { parameter: 'value', argument: 5 },
      ],
    },
  ],
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setFrames: (state, action: PayloadAction<CanvasFrame[]>) => {
      state.frames = action.payload;
    },
    setStructureData: (state, action: PayloadAction<unknown>) => {
      state.structureData = action.payload;
    },
  },
});

export const { setFrames, setStructureData } = appSlice.actions;
