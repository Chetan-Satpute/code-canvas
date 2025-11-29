import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

import type { CanvasFrame } from '#canvas/frame.tsx';

interface AppSlice {
  activeCodeLine: number;
  frames: CanvasFrame[];
}

const initialState: AppSlice = {
  activeCodeLine: 3,
  frames: [],
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setFrames: (state, action: PayloadAction<CanvasFrame[]>) => {
      state.frames = action.payload;
    },
  },
});

export const { setFrames } = appSlice.actions;
