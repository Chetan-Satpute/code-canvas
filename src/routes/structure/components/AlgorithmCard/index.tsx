import { Play, SkipForward } from 'lucide-react';

import type { AlgorithmInfo } from '#data/types.tsx';
import { useAppSelector } from '#redux/hooks.tsx';

import ActionButton from './ActionButton';
import AlgorithmCardArgItem from './ArgItem';
import { useAlgorithmActions, useAlgorithmForm } from './hooks';

type AlgorithmCardProps = AlgorithmInfo;

function AlgorithmCard(props: AlgorithmCardProps) {
  const { id, name, args, canPlay = false, canRun = false } = props;

  const disableSubmit = useAppSelector((state) => state.app.disableSubmit);

  const { onRun, onPlay } = useAlgorithmActions(id);

  const { formRef, handleRun, handlePlay, errors, playLoading, runLoading } =
    useAlgorithmForm({ args, onRun, onPlay });

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
      className="rounded-xl border border-neutral-700/40 bg-neutral-800/70 p-4 backdrop-blur-md"
    >
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-medium tracking-wide text-neutral-100">
          {name}
        </h3>

        <form ref={formRef} className="flex flex-col gap-2">
          {argItems}
        </form>

        <div className="mt-2 flex justify-end gap-2">
          {canRun && (
            <ActionButton
              label="Run"
              icon={<SkipForward size={16} />}
              onClick={handleRun}
              loading={runLoading}
              disabled={disableSubmit}
            />
          )}
          {canPlay && (
            <ActionButton
              variant="primary"
              label="Play"
              onClick={handlePlay}
              icon={<Play size={16} />}
              loading={playLoading}
              disabled={disableSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default AlgorithmCard;
