import type { ChangeEvent } from 'react';
import { useId } from 'react';

interface TextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function TextInput(props: TextInputProps) {
  const { label, value, onChange, placeholder } = props;
  const id = useId();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <div>
      <label
        htmlFor={id}
        className="text-muted-foreground mb-1.5 block text-sm"
      >
        {label}
      </label>
      <input
        id={id}
        className="bg-surface-2 border-input text-foreground font-en focus:border-ring focus:ring-ring/45 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-3"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
      />
    </div>
  );
}

export default TextInput;
