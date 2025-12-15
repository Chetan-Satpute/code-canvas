import { useRef, useState } from 'react';

import { useNavigate, useParams } from '@tanstack/react-router';

import type { CoreFunctionArgumentValue } from '#core/elements/function.tsx';
import { playAlgorithm, runAlgorithm } from '#core/helpers/algorithms.tsx';
import type { AlgorithmArgInfo } from '#data/types.tsx';
import { usePlayContextRef } from '#hooks/playContext.tsx';
import { useAppDispatch, useAppSelector } from '#redux/hooks.tsx';
import { setDisableSubmit } from '#redux/slice.ts';

import { validateForm } from './utils';

type FormErrors = Record<string, boolean>;
type FormValues = Record<string, CoreFunctionArgumentValue>;

interface UseAlgorithmFormProps {
  args: AlgorithmArgInfo[];

  onRun: (values: FormValues) => Promise<unknown>;
  onPlay: (values: FormValues) => Promise<unknown>;
}

export function useAlgorithmForm(props: UseAlgorithmFormProps) {
  const { args, onRun, onPlay } = props;

  const formRef = useRef<HTMLFormElement>(null);

  const [playLoading, setPlayLoading] = useState(false);
  const [runLoading, setRunLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const dispatch = useAppDispatch();

  const validateFormWrapper = (
    callback: (
      values: Record<string, CoreFunctionArgumentValue>,
    ) => Promise<unknown>,
  ) => {
    return async () => {
      if (!formRef.current) return;
      const { values, errors, hasError } = validateForm(formRef.current, args);

      if (hasError) setErrors(errors);
      else setErrors({});

      if (!hasError) await callback(values);
    };
  };

  const submitWrapper = (
    action: 'play' | 'run',
    handler: () => Promise<unknown>,
  ) => {
    return async () => {
      dispatch(setDisableSubmit(true));
      if (action === 'play') setPlayLoading(true);
      if (action === 'run') setRunLoading(true);

      try {
        await handler();
      } finally {
        dispatch(setDisableSubmit(false));
        if (action === 'play') setPlayLoading(false);
        if (action === 'run') setRunLoading(false);
      }
    };
  };

  const handleRun = submitWrapper('run', validateFormWrapper(onRun));
  const handlePlay = submitWrapper('play', validateFormWrapper(onPlay));

  return { formRef, handleRun, handlePlay, errors, playLoading, runLoading };
}

export function useAlgorithmActions(algorithmID: string) {
  const { structureID } = useParams({ from: '/$structureID' });
  const playContextRef = usePlayContextRef();

  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const structureData = useAppSelector((state) => state.app.structureData);

  const onRun = async (values: FormValues) => {
    await runAlgorithm({
      structureID,
      structureData,
      algorithmID,
      args: values,
      control: { dispatch },
    });
  };

  const onPlay = async (values: FormValues) => {
    const generator = await playAlgorithm({
      structureID,
      structureData,
      algorithmID,
      args: values,
      control: { dispatch },
    });

    if (!generator) {
      // TODO: handle this
      return;
    }

    playContextRef.current = { generator, structureData };

    navigate({
      to: '/$structureID/$algorithmID',
      params: { structureID, algorithmID },
    });
  };

  return { onRun, onPlay };
}
