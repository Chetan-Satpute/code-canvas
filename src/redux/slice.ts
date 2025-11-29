import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

import type { CanvasFrame } from '#canvas/frame.tsx';

interface AppSlice {
  frames: CanvasFrame[];
}

const initialState: AppSlice = {
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
