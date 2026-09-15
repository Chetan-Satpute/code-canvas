import { useState } from 'react';

import Button from '#components/Button.tsx';
import Card from '#components/Card.tsx';
import Icon from '#components/Icon.tsx';
import TextInput from '#components/TextInput.tsx';
import type { AlgorithmArgument } from '#constants/algorithms.ts';

interface AlgorithmCardProps {
  title: string;
  description: string;
  args: AlgorithmArgument[];
  // False while the algorithm has no engine implementation yet.
  runnable: boolean;
  onRun: (values: Record<string, string>) => void;
}

function AlgorithmCard(props: AlgorithmCardProps) {
  const { title, description, args, runnable, onRun } = props;

  const [values, setValues] = useState<Record<string, string>>({});

  const handleChange = (name: string, value: string) => {
    setValues((current) => ({ ...current, [name]: value }));
  };

  const handleRun = () => {
    onRun(values);
  };

  return (
    <Card title={title} description={description} padded={false}>
      {/* Capped on small screens, where the card is in page flow; on large
          screens it fills the height the sidebar allows it. */}
      <div className="flex h-full max-h-[50vh] flex-col lg:max-h-none">
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-auto p-5">
          {args.map((argument) => (
            <TextInput
              key={argument.name}
              label={argument.name}
              value={values[argument.name] ?? ''}
              onChange={(value) => handleChange(argument.name, value)}
              placeholder={argument.placeholder}
            />
          ))}
        </div>

        {/* Outside the scrolling arguments, so Run stays reachable however
            long the list gets. The column stretches the button to full width
            on its own — a flex-1 here would give it a zero basis on the
            column's axis instead, collapsing its height onto its text. */}
        <div className="border-border flex shrink-0 flex-col gap-3 border-t p-5">
          {!runnable && (
            <p className="text-muted-foreground font-en text-sm">
              This algorithm is not playable yet.
            </p>
          )}

          <Button disabled={!runnable} onClick={handleRun}>
            <Icon name="play" />
            Run
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default AlgorithmCard;
