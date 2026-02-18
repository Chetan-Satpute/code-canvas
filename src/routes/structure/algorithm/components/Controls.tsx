import { RedoDot, X } from 'lucide-react';

import { useControls } from '../hooks/controls';
import ControlButton from './ControlButton';

function Controls() {
  const {
    handleClose,
    handleNextStep,
  } = useControls();

  return (
    <div className="flex">
      <ControlButton
        className="rounded-r-none"
        label="Close"
        icon={<X size={16} />}
        onClick={() => handleClose()}
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
