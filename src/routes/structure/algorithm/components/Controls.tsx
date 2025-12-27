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
          label="Stop"
          icon={<Square size={16} />}
          onClick={handleStop}
        />
      </div>
    );
  }

  return (
    <div className="flex">
      <ControlButton
        className="rounded-r-none"
        label="Close"
        icon={<X size={16} />}
        onClick={handleClose}
      />

      <ControlButton
        label="Start"
        icon={<Play size={16} />}
        onClick={handleStart}
        className="rounded-none"
      />

      <ControlButton
        className="rounded-l-none"
        label="Next Step"
        icon={<RedoDot size={16} />}
        onClick={handleNextStep}
      />
    </div>
  );
}

export default Controls;
