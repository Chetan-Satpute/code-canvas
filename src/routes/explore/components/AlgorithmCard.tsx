import { useState } from 'react';

import Button from '#components/Button.tsx';
import Card from '#components/Card.tsx';
import Icon from '#components/Icon.tsx';
import TextInput from '#components/TextInput.tsx';
import type { AlgorithmArgument } from '#constants/algorithms.ts';
import { invalidArguments, parseArgument } from '#utils/argument.ts';
import cn from '#utils/cn.ts';

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

  const hasArguments = args.length > 0;

  const [values, setValues] = useState<Record<string, string>>({});

  // Named after the arguments a Run could not use. Only a submission adds to
  // it, so a field being typed into is never marked mid-keystroke.
  const [invalid, setInvalid] = useState<string[]>([]);

  const handleChange = (name: string, value: string) => {
    setValues((current) => ({ ...current, [name]: value }));

    const kind = args.find((argument) => argument.name === name)?.kind;

    // Clears as soon as the value reads as valid, rather than waiting for the
    // next Run to say so.
    if (parseArgument(value, kind) !== null)
      setInvalid((current) => current.filter((entry) => entry !== name));
  };

  const handleRun = () => {
    const rejected = invalidArguments(args, values);
    setInvalid(rejected);

    if (rejected.length > 0) return;

    onRun(values);
  };

  return (
    <Card title={title} description={description} padded={false}>
      {/* Capped on small screens, where the card is in page flow; on large
          screens it fills the height the sidebar allows it. */}
      <div className="flex h-full max-h-[50vh] flex-col lg:max-h-none">
        {/* An algorithm that takes no arguments has no middle section at
            all, rather than an empty pane over the Run button. */}
        {hasArguments && (
          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-auto p-5">
            {args.map((argument) => (
              <TextInput
                key={argument.name}
                label={argument.name}
                value={values[argument.name] ?? ''}
                onChange={(value) => handleChange(argument.name, value)}
                placeholder={argument.placeholder}
                invalid={invalid.includes(argument.name)}
              />
            ))}
          </div>
        )}

        {/* Outside the scrolling arguments, so Run stays reachable however
            long the list gets. The column stretches the button to full width
            on its own — a flex-1 here would give it a zero basis on the
            column's axis instead, collapsing its height onto its text. The
            rule above it separates it from the arguments, so it goes when
            there are none. */}
        <div
          className={cn(
            'flex shrink-0 flex-col gap-3 p-5',
            hasArguments && 'border-border border-t',
          )}
        >
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
