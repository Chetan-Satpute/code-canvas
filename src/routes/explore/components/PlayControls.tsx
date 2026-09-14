import Button from '#components/Button.tsx';
import Icon from '#components/Icon.tsx';

interface PlayControlsProps {
  step: number;
  onNextStep: () => void;
  onStop: () => void;
}

// A bar rather than a card: during exploration the height it takes is height
// the code block does not get.
function PlayControls(props: PlayControlsProps) {
  const { step, onNextStep, onStop } = props;

  return (
    <div className="bg-card border-border flex shrink-0 items-center gap-2 rounded-xl border p-2">
      <Button size="sm" onClick={onNextStep}>
        <Icon name="step-forward" />
        Next step
      </Button>

      <Button size="sm" variant="outline" onClick={onStop}>
        <Icon name="square" />
        Stop
      </Button>

      <p className="text-muted-foreground font-en ml-auto pr-2 text-sm">
        Step <span className="font-code text-foreground">{step}</span>
      </p>
    </div>
  );
}

export default PlayControls;
