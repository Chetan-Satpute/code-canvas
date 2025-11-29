import { createAsyncThunk } from '@reduxjs/toolkit';

import { createCoreFrame, serializeCoreFrame } from '#core/elements/frame.tsx';
import { createRandomStructureByID } from '#core/helpers/structures.tsx';
import { setFrames } from '#redux/slice.ts';

export const structureInit = createAsyncThunk(
  'structure/init',
  async (structureId: string, thunkAPI) => {
    const structure = createRandomStructureByID(structureId);
    const frame = createCoreFrame();

    structure.serialize(frame);

    const canvasFrame = serializeCoreFrame(frame);
    const frames = [canvasFrame];

    thunkAPI.dispatch(setFrames(frames));
  },
);
