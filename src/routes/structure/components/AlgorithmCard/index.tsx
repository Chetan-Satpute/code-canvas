import { useRef } from 'react';

import type { CoreFunctionArgumentValue } from '#core/elements/function.tsx';
import type { AlgorithmInfo } from '#data/types.tsx';

import AlgorithmCardArgItem from './ArgItem';
import AlgorithmCardButtonGroup from './ButtonGroup';

type AlgorithmCardProps = AlgorithmInfo;

function AlgorithmCard(props: AlgorithmCardProps) {
  const { id, name, args } = props;

  const formRef = useRef<HTMLFormElement>(null);

  const handleRun = () => {
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    const formValues = Object.fromEntries(formData.entries());

    let result: {
      values: Record<string, CoreFunctionArgumentValue>;
      errors: Record<string, boolean>;
    } = {
      values: {},
      errors: {},
    };

    result = args.reduce((result, arg) => {
      const { parameter, type } = arg;

      const valueString = (formValues[parameter] as string) || '';

      let parsedValue: CoreFunctionArgumentValue | null = null;
      let error = false;

      if (type === 'number') {
        const num = Number(valueString);
        if (Number.isNaN(num)) {
          error = true;
        } else {
          parsedValue = num;
        }
      }

      if (type === 'number[]') {
        const arr = valueString
          .split(',')
          .map((v) => v.trim())
          .filter((v) => v.length > 0)
          .map((v) => Number(v));

        if (arr.some((n) => Number.isNaN(n))) {
          error = true;
        } else {
          parsedValue = arr;
        }
      }

      if (parsedValue) result.values[parameter] = parsedValue;
      else result.errors[parameter] = error;

      return result;
    }, result);

    console.log(result);
  };

  const argItems = args.map((arg) => (
    <AlgorithmCardArgItem
      key={arg.parameter}
      parameter={arg.parameter}
      type={arg.type}
    />
  ));

  return (
    <div
      key={id}
      className="rounded-lg bg-neutral-800/90 p-4 shadow-sm backdrop-blur-md"
    >
      <h3 className="mb-3 text-lg font-semibold tracking-wide">{name}</h3>

      <div className="flex flex-col gap-4">
        <form ref={formRef}>{argItems}</form>

        <AlgorithmCardButtonGroup onRun={handleRun} />
      </div>
    </div>
  );
}

export default AlgorithmCard;
