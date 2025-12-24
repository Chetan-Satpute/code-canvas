import { Play, RedoDot, Square, X } from 'lucide-react';

import { useControls } from '../hooks/controls';
import ControlButton from './ControlButton';

function Controls() {
  const {
    isAutoplaying,
    handleClose,
    handleNextStep,
    handleStart,
    handleStop,
  } = useControls();

  if (isAutoplaying) {
    return (
      <div className="flex">
        <ControlButton
          className="rounded-t-lg"
          label="stop"
          icon={<Square size={16} />}
          onClick={handleStop}
        />
      </div>
    );
  }

  return (
    <div className="flex">
      <ControlButton
        className="rounded-tl-lg"
        label="close"
        icon={<X size={16} />}
        onClick={handleClose}
      />

      <ControlButton
        label="start"
        icon={<Play size={16} />}
        onClick={handleStart}
        className="border-x border-white/10"
      />

      <ControlButton
        className="rounded-tr-lg"
        label="next step"
        icon={<RedoDot size={16} />}
        onClick={handleNextStep}
      />
    </div>
  );
}

export default Controls;
