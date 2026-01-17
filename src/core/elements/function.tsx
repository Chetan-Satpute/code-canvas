export type CoreFunctionArgumentType = 'number' | 'number[]';
export type CoreFunctionArgumentValue = number | number[];

export interface CoreFunctionArgument {
  parameter: string;
  argument?: CoreFunctionArgumentValue;
}

export interface CoreFunction {
  name: string;
  arguments: CoreFunctionArgument[];
}
