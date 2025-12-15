import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

import type { CanvasFrame } from '#canvas/frame.tsx';
import type { CoreFunction } from '#core/elements/function.tsx';
import type { CoreStepActionPayload } from '#core/helpers/types.tsx';

interface AppSlice {
  disableSubmit: boolean;

  codeID: string;
  structureData: unknown;
  activeCodeLine: number;
  frames: CanvasFrame[];
  callStack: CoreFunction[];
}

const initialState: AppSlice = {
  disableSubmit: false,

  codeID: '',
  structureData: null,
  activeCodeLine: 0,
  frames: [],
  callStack: [],
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
    setDisableSubmit: (state, action: PayloadAction<boolean>) => {
      state.disableSubmit = action.payload;
    },
    setStep: (state, action: PayloadAction<CoreStepActionPayload>) => {
      Object.assign(state, action.payload);
    },
  },
});

export const { setFrames, setStructureData, setDisableSubmit, setStep } =
  appSlice.actions;
