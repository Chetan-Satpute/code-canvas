import { useState } from 'react';

import Button from '#components/Button.tsx';
import TextInput from '#components/TextInput.tsx';

interface StructureOperationRowProps {
  label: string;
  placeholder?: string;
  onSubmit: (value: string) => void;
}

function StructureOperationRow(props: StructureOperationRowProps) {
  const { label, placeholder, onSubmit } = props;

  const [value, setValue] = useState('');

  const handleApply = () => {
    onSubmit(value);
    setValue('');
  };

  return (
    <div className="flex items-center gap-2">
      <div className="min-w-0 flex-1">
        <TextInput
          layout="inline"
          label={label}
          value={value}
          onChange={setValue}
          placeholder={placeholder}
        />
      </div>

      <Button variant="outline" size="sm" onClick={handleApply}>
        Apply
      </Button>
    </div>
  );
}

export default StructureOperationRow;
