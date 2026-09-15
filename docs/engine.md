# The execution engine

The engine turns an algorithm into something a reader can step through: a
highlighted line, a call stack, the variables in scope, and a canvas that
animates as the structure changes.

It lives in `src/engine/` and has no React import anywhere. What React sees is
one immutable step at a time.

## Three layers

```
mutable scene graph          immutable step                React
CoreArray, CoreNode,   ──▶   CoreStep {              ──▶   VisualizationCanvas (frames)
CoreEdge, CoreLabel,         activeLine,                   CodeCard            (activeLine)
held by a CoreBoard            frames: CanvasFrame[],      CallStackCard       (callStack)
                               callStack                   MemoryCard          (callStack[0])
                             }
```

An algorithm is a generator. It mutates the scene graph and yields a step at
each point the reader should see. Nothing is precomputed: the next step is
produced when the reader asks for it, one `.next()` per click.

## A step is a film strip, not a picture

`CoreStep.frames` is a `CanvasFrame[]`, and `useCanvasFrames` plays it one
frame per `requestAnimationFrame`, holding on the last until the next step
replaces it. A step that changes only a color carries one frame; a step that
moves something carries as many as the movement takes.

A tween is written inside a single yield as _mutate a little → push a frame →
repeat_. `src/engine/animation.ts` has the helpers: `animateMove`,
`animateMoveMany`, `animateMoveBy`, `appear`, `disappear`.

A structure that derives its layout from its contents needs one more.
`rearrange` recomputes every position at once, so an edit anywhere moves nodes
it never touched — a linked list positions by index, a tree by in-order column
and depth. `src/engine/layout.ts` is the pair for that: `capture(nodes)` takes
the positions before the edit, and `animateFrom(board, nodes, before)` walks
each node from where it stood to where `rearrange` has since put it. Nothing
that edits such a structure has to work out which nodes it displaced. A node
the edit added is simply absent from the capture and is left where the layout
put it — unless the caller captures it too, which is how a node staged off the
structure rises into place in the same motion that opens the gap for it.

Movement needs no per-element bookkeeping, because position is held in one
place and everything else is derived from it:

- `CoreNode.x/y` and `CoreStructure.x/y` are the only coordinates anyone
  writes. `rearrange()` recomputes a structure's layout from its own position.
- `CoreEdge` holds its two `CoreNode`s rather than coordinates, and reads them
  when it serializes. Move a node and its edges follow; create an edge and it
  is drawn correctly from its first frame.
- A node's labels are re-pinned by `CoreNode.rearrange()`, so an index or a
  pointer name travels with the node it annotates.

A node in flight belongs to no structure. `board.float(node)` puts one on the
canvas over every structure and `board.unfloat(node)` takes it off again. That
is how an assignment between two structures animates: `array[i] = left[j]`
copies a value, so neither array gains or loses an element, and what travels
is a copy that exists only for as long as the move — the destination cell
takes its value where it lands.

The canvas element holds the largest size any frame in the step needs while
that step plays, so a structure growing mid-animation does not make it jitter
against its container; the last frame settles it to its own size, so a step
that shrank the structure leaves no slack behind it.

Canvas text is rasterized once and never reflows, unlike text in the DOM. A
canvas painted before its web font arrives would keep the fallback face until
something happened to redraw it, so `useCanvasFrames` replays the current step
once `useFontsReady` reports the fonts have loaded.

Movement is one pixel per frame, so how far a move goes is what decides how
long it takes and there is no easing. The one qualification is a ceiling: past
the distance a second of frames covers, the per-frame step grows so that the
move still lands within it. A cell shifting one place is well under that and
so is untouched; what the ceiling is for is the long diagonal a merge-sort
element travels coming up out of its half, which at a pixel a frame ran for
six seconds. An algorithm still never states a duration — the ceiling belongs
to the animator.

One limit is inherited from v1 and deliberate for now: generators are
forward-only, so there is no stepping backwards — the hook drains lazily, and
making a Back button possible would mean draining eagerly into an array, which
is a change isolated to `useExploration` and touches no algorithm.

## Lines are named, not numbered

A listing in `src/constants/code/` is the code the reader sees; the generator
beside it is the code that runs. They are two copies, so a step has to say
which line of the listing it is on.

v1 hand-counted integers, which meant editing a listing silently pointed every
step below the edit at the wrong line. Instead, a listing names its
interesting lines with a `/*#name*/` marker:

```ts
/*#compare*/ if (array[i] === target) {
```

`vite/codeHighlight.ts` strips the markers before shiki tokenizes, so they
never reach the rendered listing, and emits a `Listing { lines, anchors }`
where `anchors` maps each name to a 1-based line number — the same numbering
the code card's gutter uses. The algorithm then writes `yield step('compare')`.

The marker leads the line rather than trailing it because prettier formats
code inside markdown fences, and it moves a trailing comment off any line
ending in `{` onto the next one, which would shift the anchor silently. A
leading block comment it leaves alone.

The build fails on a duplicate name. A name an algorithm asks for that the
listing does not define throws on that step, rather than highlighting a
plausible-looking wrong line.

## Call frames carry memory

`CoreCallFrame` is one call in progress. It holds a single ordered list:
parameters first, in declaration order, then locals in the order they were
first set. Two views are taken of it:

- The **signature** in the call stack is built from the parameters.
- **Memory** shows the variables whose value is a scalar. An array is a
  structure, and a structure is read on the canvas, so it stays out.

An array is short enough that a signature prints it whole. A structure that is
not — a tree — is passed as `{ structure: 'BinarySearchTree' }`, which prints
as that name, so the signature reads the way the listing declares it. The same
applies to a variable holding a reference to one node rather than a value:
there is nothing scalar to print, so it is named on the canvas under the node
it points at instead.

`frame.set(name, value)` declares a local or updates an existing variable in
place — including a parameter, which is how an algorithm that mutates an
argument keeps its signature true. `frame.clear(name)` drops a local that has
left scope; parameters live as long as the call.

The memory card shows the innermost frame only: the function currently
running, which is the one the call stack highlights.

## Node state is a variant

An algorithm says what it is doing to a value by setting `CoreNode.variant`,
not a color. The variants are defined in `src/canvas/elements/node.ts` and
chosen so every one of them keeps its text above 4.5:1. `primary` is the
resting state; `secondary` and `tertiary` mark what is being looked at;
`success` and `danger` mark an outcome.

## Adding an algorithm

1. Write the listing in `src/constants/code/<structure>-<operation>.md`, with
   a `/*#name*/` marker on each line the run should stop at.
2. Write the generator in `src/engine/algorithms/<structure>/<operation>.ts`
   using the structure's binder, e.g. `defineArrayAlgorithm`. It takes
   `parseArgs`, which turns the form's strings into typed arguments or returns
   `null` if they do not parse, and `play`, which receives `{ board, structure,
args, step }` with the structure already narrowed to its real type.
3. Register it on the catalog entry in `src/constants/algorithms.ts` as `run`.

An entry without `run` is an algorithm that is not ported yet; the explore
page disables its Run button rather than pretending it plays.

## Adding a structure operation

Same shape, but an operation is not stepped — it mutates and returns, leaving
its frames on the board for the hook to drain. Use the structure's
`defineArrayOperation`-style binder and register it as `apply` on the
operation in `src/constants/structures.ts`.

## Adding a structure

1. Subclass `CoreStructure<Data>` in `src/engine/structures/<name>/`,
   implementing `toData`, `restore`, `serialize` and `rearrange`.
2. Export binders for it: `algorithmFor(TheClass)` and `operationFor(TheClass)`.
   These take the class once so every algorithm written against it is narrowed
   by an `instanceof` rather than a cast — there are no casts in the engine.
3. Register a random constructor in `src/engine/structures/registry.ts`, which
   is also what tells the explore page the structure is implemented.

## Session state

`src/routes/explore/hooks/useExploration.ts` owns a run. There is no store —
v1 used Redux because its consumers sat at two route levels, and v2 has all
four cards inside one page.

The board, the structure and the generator are mutable, so none of them is
state; mutating them is not what should redraw anything. What is state is the
current step and the frames being played. The hook is built once on mount, and
the explore page keys it by structure id, so moving to an algorithm of another
structure starts fresh while moving within one keeps what the user built.

`run` takes `board.snapshot()`, which returns a closure that restores it.
Stopping midway calls it, so an abandoned run leaves nothing behind; a run
that finishes keeps what it did.

The snapshot is the board's rather than the structure's because a run can
change more than one structure's contents. Merge sort adds a structure per
half, so undoing it has to restore which structures are on the board at all,
and a run stopped inside a call leaves frames on the call stack that the next
run would otherwise push onto.
