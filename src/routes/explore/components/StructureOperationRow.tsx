import { useState } from 'react';

import Button from '#components/Button.tsx';
import TextInput from '#components/TextInput.tsx';
import type { StructureOperationArgument } from '#constants/structures.ts';
import { invalidArguments, parseArgument } from '#utils/argument.ts';

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

  // Named after the arguments an Apply could not use.
  const [invalid, setInvalid] = useState<string[]>([]);

  const handleChange = (name: string, value: string) => {
    setValues((current) => ({ ...current, [name]: value }));

    const kind = args.find((argument) => argument.name === name)?.kind;

    if (parseArgument(value, kind) !== null)
      setInvalid((current) => current.filter((entry) => entry !== name));
  };

  const handleApply = () => {
    const rejected = invalidArguments(args, values);
    setInvalid(rejected);

    // The fields keep what was typed, so a rejected value can be corrected
    // rather than retyped.
    if (rejected.length > 0) return;

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
          invalid={invalid.includes(argument.name)}
        />
      ))}
    </div>
  );
}

export default StructureOperationRow;
