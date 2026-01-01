import { useRef, useState } from 'react';

import { useNavigate, useParams } from '@tanstack/react-router';

import type { CoreStepActionPayload } from '#core/helpers/types.tsx';
import { usePlayContextRef } from '#hooks/playContext.tsx';
import { useAppDispatch, useAppSelector } from '#redux/hooks.tsx';
import { setStep } from '#redux/slice.ts';
import { playSuccessToast } from '#utils/toast.tsx';

const AUTOPLAY_INTERVAL_MS = 500;

export function useControls() {
  const { structureID } = useParams({ from: '/$structureID/$algorithmID' });

  const autoplayRef = useRef<number | null>(null);
  const [isAutoplaying, setIsAutoplaying] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const structureFrames = useAppSelector((state) => state.app.structureFrames);

  const playGeneratorRef = usePlayContextRef();

  const handleClose = (done?: boolean) => {
    handleStop();

    const payload: CoreStepActionPayload = {
      codeID: '',
      activeCodeLine: 0,
      frames: structureFrames,
      callStack: [],
    };

    if (
      !done &&
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
      return handleClose();
    }

    const { value, done } = playGeneratorRef.current.generator.next();

    if (done) {
      playSuccessToast();
      handleClose(true);
    } else dispatch(setStep(value));
  };

  const handleStart = () => {
    if (isAutoplaying) return;
    if (!playGeneratorRef.current || !playGeneratorRef.current.generator) {
      return handleClose();
    }

    autoplayRef.current = window.setInterval(
      handleNextStep,
      AUTOPLAY_INTERVAL_MS,
    );

    setIsAutoplaying(true);
  };

  const handleStop = () => {
    if (!autoplayRef.current) return;

    clearInterval(autoplayRef.current);
    autoplayRef.current = null;

    setIsAutoplaying(false);
  };

  return {
    isAutoplaying,
    handleClose,
    handleNextStep,
    handleStart,
    handleStop,
  };
}
