import { useRef, useState } from 'react';

import { useParams } from '@tanstack/react-router';

import type { AlgorithmInfo } from '#data/types.tsx';
import { useAppDispatch } from '#redux/hooks.tsx';
import { runAlgorithm } from '#redux/thunks/runAlgorithm.tsx';

import AlgorithmCardArgItem from './ArgItem';
import AlgorithmCardButtonGroup from './ButtonGroup';
import { validateForm } from './utils';

type AlgorithmCardProps = AlgorithmInfo;

function AlgorithmCard(props: AlgorithmCardProps) {
  const { id, name, args } = props;

  const { structureID } = useParams({ from: '/$structureID' });
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const dispatch = useAppDispatch();

  const handleRun = () => {
    if (!formRef.current) return;

    const { values, errors, hasError } = validateForm(formRef.current, args);

    if (hasError) {
      return setErrors(errors);
    } else setErrors({});

    dispatch(runAlgorithm({ structureID, algorithmID: id, args: values }));
  };

  const argItems = args.map((arg) => (
    <AlgorithmCardArgItem
      key={arg.parameter}
      parameter={arg.parameter}
      type={arg.type}
      error={errors[arg.parameter]}
    />
  ));

  return (
    <div
      key={id}
      className="rounded-lg bg-neutral-800/90 p-4 shadow-sm backdrop-blur-md"
    >
      <h3 className="mb-3 text-lg font-semibold tracking-wide">{name}</h3>

      <div className="flex flex-col gap-4">
        <form ref={formRef}>{argItems}</form>

        <AlgorithmCardButtonGroup onRun={handleRun} />
      </div>
    </div>
  );
}

export default AlgorithmCard;
