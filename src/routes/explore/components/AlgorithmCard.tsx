import { useState } from 'react';

import Button from '#components/Button.tsx';
import Card from '#components/Card.tsx';
import Icon from '#components/Icon.tsx';
import TextInput from '#components/TextInput.tsx';

export interface AlgorithmArgument {
  name: string;
  placeholder?: string;
}

interface AlgorithmCardProps {
  title: string;
  description: string;
  args: AlgorithmArgument[];
  onRun: (values: Record<string, string>) => void;
}

function AlgorithmCard(props: AlgorithmCardProps) {
  const { title, description, args, onRun } = props;

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
            long the list gets. */}
        <div className="border-border flex shrink-0 border-t p-5">
          <Button className="flex-1" onClick={handleRun}>
            <Icon name="play" />
            Run
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default AlgorithmCard;
