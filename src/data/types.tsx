import type { CoreFunctionArgumentType } from '#core/elements/function.tsx';

export interface StructureInfo {
  title: string;
  description: string;
  sections: {
    id: string;
    name: string;
    algorithms: AlgorithmInfo[];
  }[];
}

export interface AlgorithmInfo {
  id: string;
  name: string;
  args: AlgorithmArgInfo[];
}

export interface AlgorithmArgInfo {
  parameter: string;
  type: CoreFunctionArgumentType;
}

export type DataStructureJSON = Record<string, StructureInfo>;
