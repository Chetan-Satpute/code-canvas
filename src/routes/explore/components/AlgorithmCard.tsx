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
    <Card title={title} description={description}>
      <div className="flex flex-col gap-4">
        {args.map((argument) => (
          <TextInput
            key={argument.name}
            label={argument.name}
            value={values[argument.name] ?? ''}
            onChange={(value) => handleChange(argument.name, value)}
            placeholder={argument.placeholder}
          />
        ))}

        <div className="flex justify-end">
          <Button onClick={handleRun}>
            <Icon name="play" />
            Run
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default AlgorithmCard;
