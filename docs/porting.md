# Porting the remaining algorithms

The v2 engine runs two algorithms, both on the array: linear search and merge
sort. The catalog in `src/constants/algorithms.ts` lists thirteen algorithms
across four structures, and the eleven that are not ported yet appear on the
explore page with their Run button disabled.

This document is the plan for closing that gap. It is a living doc: as an
algorithm lands, its row in the status table below is updated in the same
commit.

## What "not ported" means today

Two catalogs decide what plays, and both already carry the unported entries
with their listing, title, description and argument list written.

- An `Algorithm` without a `run` field is an algorithm the engine cannot play.
- A structure missing from `randomStructures` in
  `src/engine/structures/registry.ts` is a structure the engine cannot build.

`isPlayable` in `src/utils/algorithms.ts` requires both, and the explore page
gates Run on it. So nothing needs to be unhidden or re-registered in the UI
when an algorithm is ported — filling in `run` is what turns it on.

## Status

| Algorithm                   | Structure          | Ported |
| --------------------------- | ------------------ | ------ |
| `array-linear-search`       | Array              | Yes    |
| `array-binary-search`       | Array              | No     |
| `array-insert-value`        | Array              | No     |
| `array-remove-value`        | Array              | No     |
| `array-merge-sort`          | Array              | Yes    |
| `array-quick-sort`          | Array              | No     |
| `linked-list-insert-head`   | Linked List        | No     |
| `linked-list-insert-after`  | Linked List        | No     |
| `linked-list-remove`        | Linked List        | No     |
| `max-heap-push`             | Max Heap           | No     |
| `max-heap-pop`              | Max Heap           | No     |
| `binary-search-tree-insert` | Binary Search Tree | No     |
| `binary-search-tree-remove` | Binary Search Tree | No     |

| Structure          | Ported |
| ------------------ | ------ |
| Array              | Yes    |
| Linked List        | No     |
| Max Heap           | No     |
| Binary Search Tree | No     |

## v1 is the reference

Every one of these algorithms works in v1, on the `main` branch. The layout
math, the step granularity and the algorithm logic are all settled there, and
none of it should be re-invented. Read the v1 file before writing the v2 one:

```
git show main:src/core/<structure>/<operation>/play.tsx
git show main:src/core/<structure>/structure.tsx
```

v1 files are laid out as `src/core/<structure>/<operation>/`, holding a
`code.md` listing, a `play.tsx` generator for the stepped algorithms and a
`run.tsx` for the unstepped structure operations. The v2 equivalents are split
by kind rather than by feature: listings in `src/constants/code/`, generators
in `src/engine/algorithms/<structure>/`, operations in
`src/engine/structures/<structure>/operations.ts`.

What must not be carried over is v1's conventions. The table below is the
whole translation; `docs/engine.md` explains why each side changed.

| v1                                            | v2                                                          |
| --------------------------------------------- | ----------------------------------------------------------- |
| `yield board.serialize(7)` — counted line     | `yield step('compare')` — named `/*#compare*/` anchor       |
| `node.color = COLOR_ACTIVE` — raw hex         | `node.variant = 'secondary'` — a named variant              |
| `board.callstack.push({ name, arguments })`   | `board.call(name, parameters)`, returning a `CoreCallFrame` |
| No scalar memory                              | `frame.set(name, value)` / `frame.clear(name)`              |
| `static fromData(data)` building a new object | `restore(data)` replacing contents in place                 |
| `context.structure as CoreArray` — a cast     | `defineArrayAlgorithm`, narrowing by `instanceof`           |
| Redux `dispatch(setStep(...))`                | Returning from the generator; `useExploration` owns state   |

The cast is the one worth calling out. v2 has no casts in the engine: each
structure exports binders built by `algorithmFor(TheClass)` and
`operationFor(TheClass)`, and those narrow the structure for every algorithm
written against them. A new structure exports its own pair, the way
`src/engine/structures/array/algorithm.ts` does in five lines.

## Porting one algorithm

1. **Mark the listing.** `src/constants/code/<structure>-<operation>.md` is
   already written but carries no anchors — every unported listing is plain
   code today. Put a `/*#name*/` marker at the head of every line the run
   should stop at. The marker leads the line rather than trailing it; the
   reason is in `docs/engine.md`. v1's `play.tsx` has the stop points as `// 7`
   comments, which is a good starting set.
2. **Write the generator** in
   `src/engine/algorithms/<structure>/<operation>.ts` using the structure's
   binder. `parseArgs` turns the form's strings into typed arguments or returns
   `null`; `play` receives `{ board, structure, args, step }`.
3. **Register it** as `run` on the catalog entry in
   `src/constants/algorithms.ts`.
4. **Update the status table** in this document.

`src/engine/algorithms/array/linear-search.ts` is the worked example, and it
is short enough to read whole before starting.

Two habits it demonstrates that are easy to miss. Variants are cleaned up
before the run ends, so no color outlives the run that set it. And the call
frame is popped _after_ the step on the closing brace, not before, because the
frame is what the call returns through.

`src/engine/algorithms/array/merge-sort.ts` is the worked example for anything
recursive: the generator recurses with `yield*`, so one `.next()` still means
one step however deep the run is, and the structures a call creates are
removed by the same call before it returns.

It is also the worked example for a rule that outranks how good an animation
looks. What is animated has to be what the listing beside it does. Merge's
`array[arrayIndex] = left[leftIndex]` is an assignment: it copies a value into
a cell that already exists, `left` and `right` are read and never modified,
and `array` keeps every cell it had. An earlier version emptied the array and
moved the halves' nodes up into it, which sorted correctly and read well but
showed the reader a different algorithm from the one on screen. What travels
is a copy belonging to neither array, and the destination is overwritten where
it stands.

## Porting one structure

1. Subclass `CoreStructure<Data>` in `src/engine/structures/<name>/`,
   implementing `toData`, `restore`, `serialize` and `rearrange`. v1's
   `structure.tsx` for that structure holds the layout; the difference is that
   v1's `fromData` was static and v2's `restore` mutates in place, so that
   references held by the board and by a running algorithm stay valid.
2. Export the binders: `algorithmFor(TheClass)` and `operationFor(TheClass)`.
3. Write the sidebar operations in `operations.ts` and register them as
   `apply` on `src/constants/structures.ts`. An operation is not stepped — it
   mutates and returns, leaving its frames on the board.
4. Register a random constructor in `src/engine/structures/registry.ts`, which
   is also what tells the explore page the structure exists.

### Linked list

The simplest of the three. `CoreLinkedListNode` holds a `CoreEdge` to its
successor; the list lays out left to right at two node-widths of pitch, so
there is room for the edge between cells. The head carries a `head` label,
which has to move when the head changes — v1's `setHead` clears the old
node's label before assigning, and forgetting that leaves two heads labelled.

### Max heap

The heap draws the same values twice: an indexed array row and the tree it
represents, with `CoreMaxHeapNode` pairing one `CoreNode` with one tree node so
the two views never drift. Both views need the same name label, at different
positions.

Tree layout is an in-order walk assigning x one node-width at a time and y by
depth, which is also what the binary search tree does. It gives every node a
distinct column and no crossings, without measuring subtree widths.

One decision to make rather than inherit: v1's `swapValues` swaps the numbers
between two nodes and leaves both nodes where they are. That is a recolor, and
a sift-up that only recolors does not show the reader a value climbing the
heap. v2 should swap the nodes and animate them past each other. This is the
one place the port is expected to diverge from v1's behaviour.

### Binary search tree

Insert is a descent, and a port. Remove is the largest single piece of work in
this plan: v1's `play.tsx` is 465 lines covering a leaf, a node with one child,
and a node with two children replaced by its in-order successor. The v1
structure carries `getInorderNodes` and the `getInorderLeft/Right/Between`
helpers specifically so the nodes that have to shift sideways after a removal
can be found; port those with the class.

## The three engine changes merge sort forced

Both landed with merge sort and are described in `docs/engine.md`. They are
recorded here because the algorithms still to come inherit them.

**The board snapshots itself.** `useExploration` used to snapshot the
structure before a run, which captured one structure's contents and not the
board's _list_ of structures — so a merge sort stopped midway would restore
the original array and leave its sub-arrays stranded on the canvas.
`CoreBoard.snapshot` now captures the structure list, each structure's
contents, the call stack and any frames pending. The call stack being in it
fixes a bug that predates merge sort: stopping a run inside a call left that
call's frame on the stack, and the next run pushed onto it, so the call stack
card showed a call the reader had already abandoned.

**The board holds nodes of its own.** An algorithm that animates an
assignment between two structures has a value on the canvas that belongs to
neither of them. `board.float(node)` and `board.unfloat(node)` hold it, and
the board draws them over every structure. The board's snapshot covers them
too, so stopping a run mid-flight does not strand one.

**Long moves no longer crawl.** Movement was one pixel per frame with no
ceiling. That is right for an array cell shifting one place — 60 pixels, one
second — but a merge-sort element coming up out of its half travels several
hundred pixels, which ran for six seconds. `animateMoveMany` now raises the
per-frame step so that no single move runs longer than `MAX_MOVE_FRAMES`
frames. Anything shorter than that is unchanged, so nothing that already
existed moves differently, and an algorithm still never states a duration.

## Order of work

Easiest to hardest, so each structure's conventions are settled before the
algorithms that lean on them hardest:

1. **Remaining array algorithms** — merge sort first, which is done: it reuses
   the one structure already proven, and it forced both engine changes above
   while the only thing in flight was an array. Then quick sort, the other
   recursive one, and binary search, insert and remove.
2. **Linked list** — the structure, its four operations, then its three
   algorithms. First port of a structure, on the simplest one.
3. **Max heap** — the structure with its dual view, then push and pop.
4. **Binary search tree** — the structure, then insert, then remove last.

Each algorithm is its own commit, and the explore page gains one working Run
button per commit.

## Verifying a port

`pnpm check` runs formatting, lint and TypeScript. It proves the port
compiles; it cannot prove the animation reads correctly, and there is no test
suite. Whether a merge-sort split looks like a split, or whether a heap sift
is followable, is settled by watching it in `pnpm dev`.

That is why the work goes one algorithm at a time: each one is verified in the
browser before the next is started.
