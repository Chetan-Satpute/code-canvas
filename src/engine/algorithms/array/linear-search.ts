import { parseArgument } from '#utils/argument.ts';

import { defineArrayAlgorithm } from '../../structures/array/algorithm.ts';

// The listing this plays against is `constants/code/array-linear-search.md`,
// whose lines are named by the `//#` markers the build strips out.
export const arrayLinearSearch = defineArrayAlgorithm({
  parseArgs: (values) => {
    const target = parseArgument(values.target ?? '');

    return target === null ? null : { target };
  },

  play: function* ({ board, structure: array, args, step }) {
    const frame = board.call('linearSearch', [
      { name: 'array', value: array.toData() },
      { name: 'target', value: args.target },
    ]);

    yield step('enter');

    yield step('loop');

    for (let i = 0; i < array.nodes.length; i++) {
      const node = array.nodes[i];

      // `i` is a real variable in memory rather than only a canvas label, so
      // the reader can follow it in the same place they read `target`.
      frame.set('i', i);

      node.variant = 'secondary';
      yield step('compare');

      if (node.value === args.target) {
        node.variant = 'success';
        yield step('found');

        // Cleared before the closing brace, the same way the exhausted path
        // clears its reds: the colors say what the algorithm is doing, so
        // none of them outlives the run that set them.
        node.variant = 'primary';
        frame.clear('i');

        // The frame is still live at the closing brace — it is what the call
        // is returning through — so it is popped after the step, not before.
        yield step('exit');
        board.return();

        return;
      }

      node.variant = 'primary';
      yield step('loop');
    }

    frame.clear('i');

    // Nothing matched, so the whole array is the answer: none of it held the
    // target.
    for (const node of array.nodes) node.variant = 'danger';
    yield step('missing');

    for (const node of array.nodes) node.variant = 'primary';

    yield step('exit');
    board.return();
  },
});
