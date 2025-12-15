import { Play, SkipForward } from 'lucide-react';

import type { AlgorithmInfo } from '#data/types.tsx';
import { useAppSelector } from '#redux/hooks.tsx';

import ActionButton from './ActionButton';
import AlgorithmCardArgItem from './ArgItem';
import { useAlgorithmActions, useAlgorithmForm } from './hooks';

type AlgorithmCardProps = AlgorithmInfo;

function AlgorithmCard(props: AlgorithmCardProps) {
  const { id, name, args } = props;

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
      className="rounded-xl border border-white/5 bg-neutral-800/90 p-4 shadow-sm backdrop-blur-md"
    >
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold tracking-wide">{name}</h3>

        <form ref={formRef} className="flex flex-col gap-3">
          {argItems}
        </form>

        <div className="flex gap-2">
          <ActionButton
            label="Run"
            icon={<SkipForward size={16} />}
            onClick={handleRun}
            loading={runLoading}
            disabled={disableSubmit}
          />

          <ActionButton
            variant="primary"
            label="Play"
            onClick={handlePlay}
            icon={<Play size={16} />}
            loading={playLoading}
            disabled={disableSubmit}
          />
        </div>
      </div>
    </div>
  );
}

export default AlgorithmCard;
