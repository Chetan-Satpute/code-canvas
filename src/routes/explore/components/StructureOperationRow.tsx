import { useState } from 'react';

import Button from '#components/Button.tsx';
import TextInput from '#components/TextInput.tsx';
import type { StructureOperationArgument } from '#constants/structures.ts';

interface StructureOperationRowProps {
  label: string;
  args: StructureOperationArgument[];
  // False while the structure has no engine implementation yet.
  applicable: boolean;
  onSubmit: (values: Record<string, string>) => void;
}

function StructureOperationRow(props: StructureOperationRowProps) {
  const { label, args, applicable, onSubmit } = props;

  const [values, setValues] = useState<Record<string, string>>({});

  const handleChange = (name: string, value: string) => {
    setValues((current) => ({ ...current, [name]: value }));
  };

  const handleApply = () => {
    onSubmit(values);
    setValues({});
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-card-foreground font-en text-sm font-medium">
          {label}
        </span>

        <Button
          variant="outline"
          size="sm"
          disabled={!applicable}
          onClick={handleApply}
        >
          Apply
        </Button>
      </div>

      {args.map((argument) => (
        <TextInput
          key={argument.name}
          layout="inline"
          label={argument.name}
          value={values[argument.name] ?? ''}
          onChange={(value) => handleChange(argument.name, value)}
          placeholder={argument.placeholder}
        />
      ))}
    </div>
  );
}

export default StructureOperationRow;
