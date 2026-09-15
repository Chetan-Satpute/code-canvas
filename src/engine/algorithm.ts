import type { Listing } from '#utils/code.ts';

import type { CoreBoard } from './board.ts';
import type { CoreStep } from './step.ts';
import type { CoreStructure } from './structure.ts';

export interface AlgorithmContext<S extends CoreStructure, A> {
  board: CoreBoard;
  structure: S;
  args: A;

  // Yields the run at a named line of the listing. Names beat the line
  // numbers v1 hand-counted: editing the listing moves the anchor with the
  // line, where a number silently starts pointing at the wrong one.
  step(anchor: string): CoreStep;
}

// What the catalog stores. The structure and the argument values arrive
// untyped — the structure is whatever the board holds, the values are
// whatever the form collected — and `algorithmFor` is where both are checked
// and handed to a play function that knows their real types.
export type AlgorithmRunner = (
  board: CoreBoard,
  structure: CoreStructure,
  listing: Listing,
  values: Record<string, string>,
) => Generator<CoreStep> | null;

function stepper(board: CoreBoard, listing: Listing) {
  return (anchor: string): CoreStep => {
    const line = listing.anchors[anchor];

    // Reachable only if an algorithm and its listing disagree, which would
    // otherwise show as a highlight on a plausible-looking wrong line.
    if (line === undefined)
      throw new Error(`The listing has no line named '${anchor}'`);

    return board.toStep(line);
  };
}

// Binds a structure class once, so each algorithm for that structure is
// written against the real type with no cast anywhere: the `instanceof` is
// what narrows it.
export function algorithmFor<S extends CoreStructure>(
  Structure: abstract new (...args: never[]) => S,
) {
  return function defineAlgorithm<A>(definition: {
    parseArgs: (values: Record<string, string>) => A | null;
    play: (context: AlgorithmContext<S, A>) => Generator<CoreStep>;
  }): AlgorithmRunner {
    return (board, structure, listing, values) => {
      if (!(structure instanceof Structure))
        throw new Error(
          `${Structure.name} algorithm was given a ${structure.constructor.name}`,
        );

      const args = definition.parseArgs(values);
      if (args === null) return null;

      return definition.play({
        board,
        structure,
        args,
        step: stepper(board, listing),
      });
    };
  };
}

// A structure edit from the explore sidebar. Unlike an algorithm it is not
// stepped — it mutates and returns, leaving its frames on the board.
export type OperationRunner = (
  board: CoreBoard,
  structure: CoreStructure,
  values: Record<string, string>,
) => void;

export function operationFor<S extends CoreStructure>(
  Structure: abstract new (...args: never[]) => S,
) {
  return function defineOperation<A>(definition: {
    parseArgs: (values: Record<string, string>) => A | null;
    apply: (board: CoreBoard, structure: S, args: A) => void;
  }): OperationRunner {
    return (board, structure, values) => {
      if (!(structure instanceof Structure))
        throw new Error(
          `${Structure.name} operation was given a ${structure.constructor.name}`,
        );

      const args = definition.parseArgs(values);
      if (args === null) return;

      definition.apply(board, structure, args);
    };
  };
}
