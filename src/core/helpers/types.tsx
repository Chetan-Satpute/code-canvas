import type { CoreBoard } from "#core/board.tsx";
import type { CoreFunctionArgumentValue } from "#core/elements/function.tsx";
import type { CoreStructure } from "#core/structure.tsx";
import type { AppControl } from "#redux/types.tsx";

export interface CoreFunctionContext {
  structureData: unknown;
  structureID: string;
  algorithmID: string;
  args: Record<string, CoreFunctionArgumentValue>;

  control: AppControl;

  board: CoreBoard;
  structure: CoreStructure;
}
