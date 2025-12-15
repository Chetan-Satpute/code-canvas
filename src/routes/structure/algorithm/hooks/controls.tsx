import { useNavigate, useParams } from '@tanstack/react-router';

import type { CoreStepActionPayload } from '#core/helpers/types.tsx';
import { usePlayContextRef } from '#hooks/playContext.tsx';
import { useAppDispatch } from '#redux/hooks.tsx';
import { setStep } from '#redux/slice.ts';

export function useControls() {
  const { structureID } = useParams({ from: '/$structureID/$algorithmID' });

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const playGeneratorRef = usePlayContextRef();

  const handleClose = () => {
    const payload: CoreStepActionPayload = {
      codeID: '',
      activeCodeLine: 0,
      frames: [],
      callStack: [],
    };

    if (
      playGeneratorRef.current &&
      playGeneratorRef.current.structureData != null
    ) {
      payload.structureData = playGeneratorRef.current.structureData;
    }

    dispatch(setStep(payload));

    navigate({ to: '/$structureID', params: { structureID } });
  };

  const handleNextStep = () => {
    if (!playGeneratorRef.current || !playGeneratorRef.current.generator) {
      // TODO: handle it better
      return;
    }

    const { value, done } = playGeneratorRef.current.generator.next();

    if (done) handleClose();

    dispatch(setStep(value));
  };

  return { handleClose, handleNextStep };
}
