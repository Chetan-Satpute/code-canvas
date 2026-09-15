import { useRef, useState } from 'react';

import type { CanvasFrame } from '#canvas/frame.ts';
import type { Algorithm } from '#constants/algorithms.ts';
import type { Structure } from '#constants/structures.ts';
import { CoreBoard } from '#engine/board.ts';
import type { CoreStep } from '#engine/step.ts';
import { createRandomStructure } from '#engine/structures/registry.ts';
import { isPlayable } from '#utils/algorithms.ts';
import logger from '#utils/logger.ts';

// One exploration session: the structure on the canvas, the edits applied to
// it, and the run stepping over it.
//
// The board, the structure and the generator are mutable, and mutating them
// is not what should redraw anything — so none of them is state. What React
// renders is the step, and a step is replaced whole.
//
// The session is built once, on mount. The explore page keys this component
// by structure id, so choosing an algorithm for a different structure
// remounts it and choosing another for the same structure keeps what the
// user built.
export function useExploration(algorithm: Algorithm, structure: Structure) {
  // Built in one initializer rather than two, because the board and the
  // structure on it have to be the same session: React double-invokes
  // initializers in development and keeps one result, so a board created in
  // one cell and a structure added to it from another end up mismatched.
  const [{ board, core }] = useState(() => {
    const created = new CoreBoard();
    const structureCore = createRandomStructure(structure.id);

    if (structureCore !== null) created.add(structureCore);

    return { board: created, core: structureCore };
  });

  const generatorRef = useRef<Generator<CoreStep> | null>(null);
  const revertRef = useRef<(() => void) | null>(null);

  const [frames, setFrames] = useState<CanvasFrame[]>(() =>
    core === null ? [] : board.drainFrames(),
  );
  const [step, setStep] = useState<CoreStep | null>(null);

  const stop = () => {
    generatorRef.current = null;

    // A run abandoned midway leaves nothing behind; one that finished keeps
    // what it did. This is why `run` takes the snapshot in the first place.
    revertRef.current?.();
    revertRef.current = null;

    setStep(null);
    setFrames(board.drainFrames());
  };

  const advance = (generator: Generator<CoreStep>) => {
    const result = generator.next();

    if (result.done === true) {
      // The algorithm ran to completion, so its work stands.
      revertRef.current = null;
      stop();

      return;
    }

    setStep(result.value);
    setFrames(result.value.frames);
  };

  const run = (values: Record<string, string>) => {
    if (core === null || algorithm.run === undefined) return;

    const generator = algorithm.run(board, core, algorithm.listing, values);

    // The arguments did not parse. The fields are free text, so this is an
    // ordinary outcome rather than a bug.
    if (generator === null) {
      logger.warn(`Cannot run ${algorithm.id} with these arguments`, values);
      return;
    }

    revertRef.current = core.snapshot();
    generatorRef.current = generator;

    advance(generator);
  };

  const nextStep = () => {
    const generator = generatorRef.current;
    if (generator === null) return;

    advance(generator);
  };

  const applyOperation = (
    operationId: string,
    values: Record<string, string>,
  ) => {
    if (core === null) return;

    const operation = structure.operations.find(
      (candidate) => candidate.id === operationId,
    );
    if (operation?.apply === undefined) return;

    operation.apply(board, core, values);
    setFrames(board.drainFrames());
  };

  return {
    frames,
    callStack: step?.callStack ?? [],
    activeLine: step?.activeLine,
    isRunning: step !== null,
    canRun: isPlayable(algorithm),
    run,
    nextStep,
    stop,
    applyOperation,
  };
}
