import { useState } from 'react';

import Card from '#components/Card.tsx';
import { useAlgorithmId } from '#routes/router.ts';
import { findAlgorithm, getStructure } from '#utils/algorithms.ts';
import cn from '#utils/cn.ts';

import AlgorithmCard from './components/AlgorithmCard.tsx';
import AlgorithmNotFound from './components/AlgorithmNotFound.tsx';
import CallStackCard from './components/CallStackCard.tsx';
import CodeCard from './components/CodeCard.tsx';
import ExploreHeader from './components/ExploreHeader.tsx';
import MemoryCard from './components/MemoryCard.tsx';
import PlayControls from './components/PlayControls.tsx';
import StructureCard from './components/StructureCard.tsx';
import VisualizationCanvas from './components/VisualizationCanvas.tsx';
import { buildPlaceholderCallStack } from './utils/placeholderCallStack.ts';

/*
 * Both modes use one grid, so switching between them never moves the canvas.
 *
 * lg+: canvas over a second card in the wide left column, and a sidebar
 * spanning both rows beside them. Only the contents change with the mode —
 * setup puts code under the canvas and the algorithm and structure cards in
 * the sidebar; exploration swaps in the call stack and memory under the canvas
 * and gives the sidebar to the playback bar and the code.
 *
 * Code therefore gets the sidebar's full height during a run, which is when
 * it is being read line by line.
 *
 * Below lg the grid collapses to a single scrolling column in DOM order.
 */
const gridClasses =
  'grid min-h-0 flex-1 grid-cols-1 gap-4 overflow-y-auto p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_26rem] lg:grid-rows-[minmax(0,3fr)_minmax(0,2fr)] lg:overflow-hidden xl:grid-cols-[minmax(0,1fr)_32rem]';

const canvasClasses =
  'aspect-[4/3] sm:aspect-video lg:col-start-1 lg:row-start-1 lg:aspect-auto lg:min-h-0';

// The row under the canvas, and the sidebar next to them.
const underCanvasClasses = 'lg:col-start-1 lg:row-start-2 lg:min-h-0';

// Signatures need the wider half; the memory card holds short name/value rows.
const stackAndMemoryClasses =
  'grid gap-4 sm:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]';

const sidebarClasses =
  'flex flex-col gap-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:min-h-0';

function ExplorePage() {
  const algorithmId = useAlgorithmId();

  // The arguments a run was started with, and null while none is in flight —
  // so they double as the setup/exploration switch.
  const [runArguments, setRunArguments] = useState<Record<
    string,
    string
  > | null>(null);

  const handleRun = (values: Record<string, string>) => {
    setRunArguments(values);
  };

  const handleStop = () => {
    setRunArguments(null);
  };

  // Stepping and structure edits are wired to the execution engine in a later
  // change; the layout only needs the handlers to exist.
  const handleNextStep = () => {};

  const handleStructureOperation = () => {};

  const algorithm = findAlgorithm(algorithmId);

  if (algorithm === null)
    return <AlgorithmNotFound algorithmId={algorithmId} />;

  const structure = getStructure(algorithm);

  const frames =
    runArguments === null
      ? []
      : buildPlaceholderCallStack(algorithm, runArguments);

  return (
    <div className="bg-background text-foreground flex h-dvh flex-col">
      <ExploreHeader />

      <main className={gridClasses}>
        {/* Outside the mode branch so a run starting or stopping never
            remounts the canvas. */}
        <div className={canvasClasses}>
          <Card padded={false}>
            <VisualizationCanvas />
          </Card>
        </div>

        {runArguments === null ? (
          <>
            <div className={sidebarClasses}>
              {/* The wrapper's auto height pins the card to its content —
                  a bare card is `h-full` and would stretch over the whole
                  sidebar. Past half the sidebar it stops growing and the
                  arguments scroll inside it, so the structure card below is
                  never squeezed out. */}
              <div className="lg:max-h-[50%] lg:min-h-0">
                <AlgorithmCard
                  title={algorithm.title}
                  description={algorithm.description}
                  args={algorithm.args}
                  onRun={handleRun}
                />
              </div>

              {/* The structure card then takes the rest of the sidebar and
                  scrolls its own operations. */}
              <div className="lg:min-h-0 lg:flex-1">
                <StructureCard
                  title={structure.title}
                  description={structure.description}
                  operations={structure.operations}
                  onSubmit={handleStructureOperation}
                />
              </div>
            </div>

            <div className={underCanvasClasses}>
              <CodeCard lines={algorithm.code} />
            </div>
          </>
        ) : (
          <>
            <div className={sidebarClasses}>
              <PlayControls onNextStep={handleNextStep} onStop={handleStop} />

              <div className="lg:min-h-0 lg:flex-1">
                <CodeCard lines={algorithm.code} />
              </div>
            </div>

            <div className={cn(underCanvasClasses, stackAndMemoryClasses)}>
              <CallStackCard frames={frames} />
              <MemoryCard variables={frames[0]?.variables ?? []} />
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default ExplorePage;
