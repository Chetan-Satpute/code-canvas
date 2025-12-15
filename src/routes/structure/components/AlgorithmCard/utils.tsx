import type { CoreFunctionArgumentValue } from '#core/elements/function.tsx';
import type { AlgorithmArgInfo } from '#data/types.tsx';

export type ValidationResult = {
  hasError: boolean;
  values: Record<string, CoreFunctionArgumentValue>;
  errors: Record<string, boolean>;
};

/**
 * Validate a form element against argument definitions
 */
export function validateForm(
  formElement: HTMLFormElement,
  args: AlgorithmArgInfo[],
): ValidationResult {
  const formData = new FormData(formElement);

  const result: ValidationResult = {
    hasError: false,
    values: {},
    errors: {},
  };

  for (const arg of args) {
    validateArg(formData, arg, result);
  }

  return result;
}

/** Validate a single argument and update the result */
function validateArg(
  formData: FormData,
  arg: AlgorithmArgInfo,
  result: ValidationResult,
) {
  const { parameter, type } = arg;
  const rawValue = formData.get(parameter);

  if (isMissing(rawValue)) {
    markError(result, parameter);
    return;
  }

  if (typeof rawValue !== 'string') return;

  const parsedValue = parseValue(rawValue, type);

  if (parsedValue === null) {
    markError(result, parameter);
    return;
  }

  result.values[parameter] = parsedValue;
}

/** Check if a value is missing or empty */
function isMissing(value: FormDataEntryValue | null) {
  return value === null || value === '';
}

/** Parse a string value according to the argument type */
function parseValue(
  value: string,
  type: AlgorithmArgInfo['type'],
): CoreFunctionArgumentValue | null {
  switch (type) {
    case 'number': {
      const n = Number(value);
      return Number.isNaN(n) ? null : n;
    }

    case 'number[]': {
      const arr = value
        .split(',')
        .map((v) => v.trim())
        .map(Number);

      return arr.some(Number.isNaN) ? null : arr;
    }

    default:
      return null;
  }
}

/** Mark an argument as having an error */
function markError(result: ValidationResult, parameter: string) {
  result.hasError = true;
  result.errors[parameter] = true;
}
