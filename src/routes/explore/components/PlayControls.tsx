import Button from '#components/Button.tsx';
import Icon from '#components/Icon.tsx';

interface PlayControlsProps {
  onNextStep: () => void;
  onStop: () => void;
}

// A bar rather than a card: during exploration the height it takes is height
// the code block does not get.
function PlayControls(props: PlayControlsProps) {
  const { onNextStep, onStop } = props;

  return (
    <div className="bg-card border-border flex shrink-0 items-center gap-2 rounded-xl border p-2">
      <Button className="basis-1/3" size="sm" variant="outline" onClick={onStop}>
        <Icon name="square" />
        Stop
      </Button>

      <Button className="basis-2/3" size="sm" onClick={onNextStep}>
        Next step
        <Icon name="step-forward" />
      </Button>
    </div>
  );
}

export default PlayControls;
