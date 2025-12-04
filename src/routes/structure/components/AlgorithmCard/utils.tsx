import type { CoreFunctionArgumentValue } from '#core/elements/function.tsx';
import type { AlgorithmArgInfo } from '#data/types.tsx';

export function validateForm(
  formElement: HTMLFormElement,
  args: AlgorithmArgInfo[],
) {
  const formData = new FormData(formElement);

  const result: {
    hasError: boolean;
    values: Record<string, CoreFunctionArgumentValue>;
    errors: Record<string, boolean>;
  } = {
    hasError: false,
    values: {},
    errors: {},
  };

  return args.reduce((result, arg) => {
    const { parameter, type } = arg;

    const valueString = formData.get(parameter);

    if (valueString === null || valueString === '') {
      result.hasError = true;
      result.errors[parameter] = true;

      return result;
    }

    if (typeof valueString !== 'string') {
      return result;
    }

    if (type === 'number') {
      const valueNumber = Number(valueString);

      if (Number.isNaN(valueNumber)) {
        result.hasError = true;
        result.errors[parameter] = true;
      } else {
        result.values[parameter] = valueNumber;
      }
    } else if (type === 'number[]') {
      const valueArray = valueString
        .split(',')
        .map((v) => v.trim)
        .map(Number);

      if (valueArray.some((n) => Number.isNaN(n))) {
        result.hasError = true;
        result.errors[parameter] = true;
      } else {
        result.values[parameter] = valueArray;
      }
    }

    return result;
  }, result);
}
