export type CoreFunctionArgumentType = 'number' | 'number[]';

export interface CoreFunctionArgument {
  parameter: string;
  argument: number | number[];
}

export interface CoreFunction {
  name: string;
  arguments: CoreFunctionArgument[];
}
