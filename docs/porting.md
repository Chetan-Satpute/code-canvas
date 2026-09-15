# Porting the remaining algorithms

The port is finished. All thirteen algorithms in
`src/constants/algorithms.ts` play, across all four structures, and every
structure can be built and edited. Nothing on the explore page has its Run
button disabled any more.

This document was the plan for getting there, and stays as the record of how
each port was done. The sections on what must not be carried over from v1, on
the engine changes the ports forced, and on the two listings that had to
change are all still live guidance for anyone adding a fifth structure.

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
| `array-binary-search`       | Array              | Yes    |
| `array-insert-value`        | Array              | Yes    |
| `array-remove-value`        | Array              | Yes    |
| `array-merge-sort`          | Array              | Yes    |
| `array-quick-sort`          | Array              | Yes    |
| `linked-list-insert-head`   | Linked List        | Yes    |
| `linked-list-insert-after`  | Linked List        | Yes    |
| `linked-list-remove`        | Linked List        | Yes    |
| `max-heap-push`             | Max Heap           | Yes    |
| `max-heap-pop`              | Max Heap           | Yes    |
| `binary-search-tree-insert` | Binary Search Tree | Yes    |
| `binary-search-tree-remove` | Binary Search Tree | Yes    |

| Structure          | Ported |
| ------------------ | ------ |
| Array              | Yes    |
| Linked List        | Yes    |
| Max Heap           | Yes    |
| Binary Search Tree | Yes    |

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

It and `quick-sort.ts` beside it are also the worked examples for a rule that
outranks how good an animation looks. What is animated has to be what the listing beside it does. Merge's
`array[arrayIndex] = left[leftIndex]` is an assignment: it copies a value into
a cell that already exists, `left` and `right` are read and never modified,
and `array` keeps every cell it had. An earlier version emptied the array and
moved the halves' nodes up into it, which sorted correctly and read well but
showed the reader a different algorithm from the one on screen. What travels
is a copy belonging to neither array, and the destination is overwritten where
it stands.

Quick sort is the other side of the same rule. Its
`[array[i], array[j]] = [array[j], array[i]]` really does exchange two
elements, so there the nodes themselves move: out of the row in opposite
directions, past each other, and back in. Travelling along the row would take
each of them through every element in between, which is the same reason merge
sort routes a value out into the empty row between an array and its halves.
Read the statement, then decide what moves.

That copy-between-two-arrays animation is shared rather than rewritten:
`src/engine/structures/array/assign.ts` holds `assign(board, to, index, from)`,
which floats a copy out into the free row between the two arrays, along it,
and into the destination cell. Merge sort and insert value both use it, and
remove value does too. The lane it routes along is the free row between the
two arrays, except for an assignment within one array — `array[i - 1] =
array[i]` in remove value — where there is no row between, and the copy goes
out below the row it came from instead.

`src/engine/algorithms/array/insert-value.ts` is the worked example for an
algorithm whose listing rebinds its own parameter. `array = result` cannot
replace the structure object, because the board and the explore page hold it;
instead the old row fades out, `result` slides up into its place, and the
structure takes over the result's nodes where they stand — the same reason
`CoreStructure.restore` mutates in place. Its listing is also the one place
the port changed the code rather than only annotating it: v1 drew the cells of
`new Array(array.length + 1)` as zeroes, which is not what that expression
produces, so the listing now says `.fill(0)` and the canvas is honest.

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

Done. `CoreLinkedListNode` holds a `CoreEdge` to its successor; the list lays
out left to right at two node-widths of pitch, so there is room for the edge
between cells. The `head` label is rewritten by `rearrange` on every layout,
the way the array rewrites its indices and the tree its `root` — rather than
v1's `setHead`, which cleared the old node's label by hand and left two heads
labelled if the call was missed.

A node that is about to join the list exists before it belongs to anything:
the listings all write `const node = new LinkedListNode(value)` before any
link is assigned. It is staged a row below the slot it will take and floated
on the board, then captured alongside the list so that it rises into the row
in the same motion that opens the gap for it.

One listing changed, and not only to carry markers. The remove listing's
`for (let node = list.head.next; node; parent = node, node = node.next)` is
long enough that a marker pushes it past eighty columns, and prettier — which
formats code inside markdown fences — then breaks the header across five
lines. That would have left the loop's anchor highlighting a bare `for (`,
with `parent = node` and `node = node.next` buried in a wrapped update clause
that no step could ever stop on separately. It is a `while` loop now, with
those two assignments on lines of their own, which is both what fits and what
the algorithm is actually about: the run stops on `parent = node` and the
reader sees why the scan keeps the node in front.

The max heap's two listings hit the same wall and were resolved the same way.
Their swap statements, and the two bound checks in `pop`, are long enough that
a marker tips them over eighty columns, and prettier then breaks a
destructuring swap across four lines and an `if` condition across three —
which would leave a step highlighting a bare `if (`. Renaming `nodeIndex`,
`parentIndex`, `nextIndex`, `leftIndex` and `rightIndex` to `index`, `parent`,
`next`, `left` and `right` brings every marked line inside the limit, and
matches what the array's own listings already call these variables. `pop` also
names `heap.length - 1` as `last` rather than repeating it three times, which
both fits and puts the slot being removed in the memory card.

The general rule for a fifth structure: a listing line plus its marker has to
fit in eighty columns, or prettier will reformat the listing underneath you.
Check that before writing the generator, not after.

### Max heap

Done. The heap draws the same values twice: an indexed array row and the tree
it represents, with `CoreMaxHeapNode` pairing one `CoreNode` with one tree
node. Everything that says something about a value — its colour, its cursor
name, its opacity — is set through the pair rather than on either node, which
is what keeps the two views from drifting. Both carry the same name label, at
different positions.

The tree is derived from the array rather than maintained beside it: `link()`
wires the children of slot `i` to slots `2i + 1` and `2i + 2`, and is re-run
after every mutation. That relation is the whole of what makes an array a
heap, so there is no second structure to keep in step. Layout is the same
in-order walk the binary search tree uses — a column at a time, a row per
depth — three rows below the array, which leaves the array's cursors a row of
their own and the tree's `top` label a row of its own.

**How a swap is drawn, and why only half of it moves.** The plan here was to
diverge from v1, whose `swapValues` swapped the numbers between two nodes and
left both standing: that is a recolor, and a sift that only recolors does not
show a value climbing the heap. In the array row that is what
`structures/max-heap/swap.ts` does — the two nodes leave the row in opposite
directions, cross, and drop back in, the route quick sort uses and for the
same reason.

The tree was built the same way at first and it was wrong on screen. Moving
two tree nodes past each other drags every edge that touches them out of shape
for the length of the move, so the tree reads as coming apart rather than as
two values swapping. There the two values simply trade places. The lesson is
narrower than "animate structural mutations": what is worth animating is
movement the reader can follow, and in a view whose every node is tied to its
neighbours by an edge, a moving node takes the whole picture with it.

### Binary search tree

The structure is done, ahead of the two below it, along with its three sidebar
operations. Three things about it are worth knowing before the algorithms are
written.

**The layout is derived from the whole tree.** A node's column is its in-order
position and its row is its depth, so an edit anywhere moves nodes it never
touched. `operations.ts` therefore captures every node's position before an
edit and animates the new layout back from them, rather than each operation
working out what it displaced. This is why v1's `getInorderLeftNodes`,
`getInorderRightNodes` and `getInorderBetweenNodes` were not ported: they exist
so a removal can find the nodes that must shift sideways, and capturing
positions answers that question for every case at once. Only `inorder()` came
across. The algorithms should reach for the same capture-and-animate helper
rather than reviving the v1 trio.

**A removal is planned before it is applied.** `CoreBinarySearchTree.remove`
changes nothing: it returns the node that will leave, the link that points at
it, and an `unlink` closure that makes the change. That shape exists because a
node the tree has unlinked is no longer serialized and so could not be seen
fading — the same reason `snapshot` hands back a closure instead of doing the
work. For a node with two children the node that leaves is the in-order
successor, and `unlink` is what copies its value over the node being removed.

**Both algorithms are done.** Insert is a descent. Remove was expected to be
the largest single piece of work in this plan — v1's `play.tsx` is 465 lines —
and came out at less than half that, because the length was never the algorithm.
v1 wrote the same fade-relink-shift dance out by hand in each of its six link
assignments; here they are one `replace` helper over `positions` and
`relayout`, and the three references a case can write (`tree.root`,
`parent.left`, `parent.right`) are one closure, with the step saying which of
the three lines the reader is on.

That last point has a trap in it, and it is worth knowing about before writing
the linked list's remove. The assignment happens before its step is yielded,
so a branch cannot ask `current === tree.root` to decide which line to
highlight — by then `tree.root` has already been written. The node being the
root is exactly the search never having taken a step, so it is read off
`parent` instead, captured when the node is found.

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

## The order it was done in

Easiest to hardest, so each structure's conventions were settled before the
algorithms that lean on them hardest:

1. **Remaining array algorithms** — all done. The two recursive ones went
   first, merge sort and then quick sort: they reuse the one structure already
   proven, and merge sort forced all three engine changes above while the only
   thing in flight was an array. Binary search, insert value and remove value
   followed.
2. **Binary search tree** — done, taken out of order: the structure, its three
   sidebar operations, then insert and remove.
3. **Linked list** — done: the structure, its four operations, then its three
   algorithms.
4. **Max heap** — the structure with its dual view, then push and pop.

Each algorithm was its own commit, and the explore page gained one working Run
button per commit.

## Verifying a port

`pnpm check` runs formatting, lint and TypeScript. It proves the port
compiles; it cannot prove the animation reads correctly, and there is no test
suite. Whether a merge-sort split looks like a split, or whether a heap sift
is followable, is settled by watching it in `pnpm dev`.

That is why the work goes one algorithm at a time: each one is verified in the
browser before the next is started.

Two things a browser cannot check quickly are worth doing to a branchy
algorithm before opening it. Run it against a plain implementation of the same
listing over every value of many random structures, which catches a case the
eye would have to stumble into; and collect the lines it stops on across those
runs and compare them to the listing's anchors, which catches an anchor no run
ever reaches. The second found a real defect in the binary search tree's
remove: the three `tree.root = ...` lines were never highlighted, because the
branch asked which line to stop on after the assignment had already moved the
root.
