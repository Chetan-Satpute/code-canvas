import type { StructureId } from './structures.ts';

export interface AlgorithmArgument {
  name: string;
  placeholder?: string;
}

export interface Algorithm {
  id: string;
  structureId: StructureId;
  title: string;
  description: string;
  args: AlgorithmArgument[];
  code: string[];
}

// Listings are authored as template literals so they read as source in this
// file. The newlines the literal picks up from its own delimiters are not part
// of the listing, and the card numbers lines itself.
function lines(source: string): string[] {
  return source.trim().split('\n');
}

const linearSearchCode = `
function linearSearch(array: number[], target: number) {
  for (let i = 0; i < array.length; i++) {
    if (array[i] === target) {
      return i;
    }
  }

  return NaN;
}
`;

const binarySearchCode = `
/**
 * The array MUST be sorted in ascending order. On an unsorted array binary
 * search may miss a value that is present, or report the wrong index.
 */
function binarySearch(array: number[], target: number): number {
  let left = 0;
  let right = array.length - 1;

  while (left < right) {
    const mid = Math.floor((left + right) / 2);

    if (array[mid] < target) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }

  if (array[left] === target) {
    return left;
  }

  return -1;
}
`;

const mergeSortCode = `
function mergeSort(array: number[]): void {
  // Base case: arrays of length 0 or 1 are already sorted
  if (array.length <= 1) {
    return;
  }

  const mid = Math.floor(array.length / 2);

  const left = array.slice(0, mid);
  const right = array.slice(mid);

  mergeSort(left);
  mergeSort(right);

  merge(array, left, right);
}

function merge(array: number[], left: number[], right: number[]): void {
  let leftIndex = 0;
  let rightIndex = 0;
  let arrayIndex = 0;

  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] <= right[rightIndex]) {
      array[arrayIndex] = left[leftIndex];
      leftIndex++;
    } else {
      array[arrayIndex] = right[rightIndex];
      rightIndex++;
    }
    arrayIndex++;
  }

  // Append remaining elements (only one of these will run)
  while (leftIndex < left.length) {
    array[arrayIndex] = left[leftIndex];
    leftIndex++;
    arrayIndex++;
  }

  while (rightIndex < right.length) {
    array[arrayIndex] = right[rightIndex];
    rightIndex++;
    arrayIndex++;
  }
}
`;

const quickSortCode = `
function quickSort(array: number[], low = 0, high = array.length - 1): void {
  // Base case: 0 or 1 element is already sorted
  if (low >= high) {
    return;
  }

  const pivotIndex = partition(array, low, high);

  quickSort(array, low, pivotIndex - 1);
  quickSort(array, pivotIndex + 1, high);
}

function partition(array: number[], low: number, high: number): number {
  const pivot = array[high];
  let i = low - 1;

  for (let j = low; j < high; j++) {
    if (array[j] <= pivot) {
      i++;
      // Swap to move smaller element to the left side
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // Swap pivot into its final sorted position
  [array[i + 1], array[high]] = [array[high], array[i + 1]];

  return i + 1;
}
`;

const arrayInsertValueCode = `
function insertValue(array: number[], index: number, value: number) {
  if (index < 0) {
    index = 0;
  }

  if (index > array.length) {
    index = array.length;
  }

  const result = new Array(array.length + 1);

  for (let i = 0; i < index; i++) {
    result[i] = array[i];
  }

  result[index] = value;

  for (let i = index; i < array.length; i++) {
    result[i + 1] = array[i];
  }

  array = result;
}
`;

const arrayRemoveValueCode = `
function removeValue(array: number[], index: number) {
  if (index < 0 || index >= array.length) {
    return;
  }

  // Shift every later element one place to the left
  for (let i = index + 1; i < array.length; i++) {
    array[i - 1] = array[i];
  }

  array.length--;
}
`;

const linkedListInsertHeadCode = `
function insertHead(list: LinkedList, value: number) {
  const node = new LinkedListNode(value);

  node.next = list.head;
  list.head = node;
}
`;

const linkedListInsertAfterCode = `
function insertAfter(list: LinkedList, target: number, value: number) {
  if (list.head === null) {
    return;
  }

  for (let ptr = list.head; ptr; ptr = ptr.next) {
    if (ptr.value !== target) {
      continue;
    }

    const node = new LinkedListNode(value);

    node.next = ptr.next;
    ptr.next = node;

    break;
  }

  return;
}
`;

const linkedListRemoveCode = `
function remove(list: LinkedList, target: number) {
  if (list.head === null) {
    return;
  }

  if (list.head.value === target) {
    list.head = list.head.next;

    return;
  }

  let parent = list.head;

  for (let node = list.head.next; node; parent = node, node = node.next) {
    if (node.value === target) {
      parent.next = node.next;

      return;
    }
  }

  return;
}
`;

const treeInsertCode = `
function insert(tree: BinarySearchTree, value: number) {
  if (tree.root === null) {
    tree.root = new Node(value);
    return;
  }

  let current = tree.root;

  while (true) {
    if (value === current.value) {
      break;
    }

    if (value < current.value) {
      if (current.left === null) {
        current.left = new Node(value);
        break;
      }

      current = current.left;
    } else {
      if (current.right === null) {
        current.right = new Node(value);
        break;
      }

      current = current.right;
    }
  }

  return;
}
`;

const treeRemoveCode = `
function remove(tree: BinarySearchTree, value: number) {
  let current = tree.root;
  let parent = null;
  let isLeftChild = false;

  // 1. Find the node
  while (current !== null && current.value !== value) {
    parent = current;

    if (value < current.value) {
      isLeftChild = true;
      current = current.left;
    } else {
      isLeftChild = false;
      current = current.right;
    }
  }

  // Value not found
  if (current === null) {
    return;
  }

  // 2. Case 1: no children (leaf)
  if (current.left === null && current.right === null) {
    if (current === tree.root) {
      tree.root = null;
    } else if (isLeftChild) {
      parent.left = null;
    } else {
      parent.right = null;
    }
    return;
  }

  // 3. Case 2: one child (right only)
  if (current.left === null) {
    if (current === tree.root) {
      tree.root = current.right;
    } else if (isLeftChild) {
      parent.left = current.right;
    } else {
      parent.right = current.right;
    }
    return;
  }

  // 4. Case 2: one child (left only)
  if (current.right === null) {
    if (current === tree.root) {
      tree.root = current.left;
    } else if (isLeftChild) {
      parent.left = current.left;
    } else {
      parent.right = current.left;
    }
    return;
  }

  // 5. Case 3: two children
  // Find inorder successor (min of right subtree)
  let successorParent = current;
  let successor = current.right;

  while (successor.left !== null) {
    successorParent = successor;
    successor = successor.left;
  }

  // Replace current value with successor value
  current.value = successor.value;

  // Remove successor node
  if (successorParent.left === successor) {
    successorParent.left = successor.right;
  } else {
    successorParent.right = successor.right;
  }

  return;
}
`;

const heapPushCode = `
function push(heap: number[], value: number) {
  heap.push(value);

  for (let nodeIndex = heap.length - 1; nodeIndex > 0; ) {
    const parentIndex = Math.floor((nodeIndex - 1) / 2);

    if (heap[nodeIndex] <= heap[parentIndex]) {
      break;
    }

    // Swap values at nodeIndex and parentIndex
    [heap[nodeIndex], heap[parentIndex]] = [heap[parentIndex], heap[nodeIndex]];
    nodeIndex = parentIndex;
  }

  return;
}
`;

const heapPopCode = `
function pop(heap: number[]) {
  if (heap.length === 0) {
    return;
  }

  // Swap top and last values
  [heap[0], heap[heap.length - 1]] = [heap[heap.length - 1], heap[0]];

  heap.pop();

  for (let nodeIndex = 0; nodeIndex < heap.length; ) {
    const leftIndex = nodeIndex * 2 + 1;
    const rightIndex = nodeIndex * 2 + 2;

    let nextIndex = nodeIndex;

    if (leftIndex < heap.length && heap[nextIndex] < heap[leftIndex]) {
      nextIndex = leftIndex;
    }

    if (rightIndex < heap.length && heap[nextIndex] < heap[rightIndex]) {
      nextIndex = rightIndex;
    }

    if (nextIndex === nodeIndex) {
      break;
    }

    // Swap values at nextIndex and nodeIndex
    [heap[nextIndex], heap[nodeIndex]] = [heap[nodeIndex], heap[nextIndex]];

    nodeIndex = nextIndex;
  }

  return;
}
`;

// Ids are the explore route's only parameter, so they carry the structure as
// a prefix to stay unique across structures that share an operation name.
const algorithms: Record<string, Algorithm> = {
  'array-linear-search': {
    id: 'array-linear-search',
    structureId: 'array',
    title: 'Linear Search',
    description:
      'Walks the array from the front, comparing every element until the target turns up or the end is reached.',
    args: [{ name: 'target', placeholder: '42' }],
    code: lines(linearSearchCode),
  },

  'array-binary-search': {
    id: 'array-binary-search',
    structureId: 'array',
    title: 'Binary Search',
    description:
      'Halves a sorted array on every step, discarding the side that cannot hold the target.',
    args: [{ name: 'target', placeholder: '42' }],
    code: lines(binarySearchCode),
  },

  'array-merge-sort': {
    id: 'array-merge-sort',
    structureId: 'array',
    title: 'Merge Sort',
    description:
      'Splits the array down to single elements, then merges the halves back together in order.',
    args: [],
    code: lines(mergeSortCode),
  },

  'array-quick-sort': {
    id: 'array-quick-sort',
    structureId: 'array',
    title: 'Quick Sort',
    description:
      'Partitions the array around a pivot so smaller values fall left and larger right, then sorts each side.',
    args: [],
    code: lines(quickSortCode),
  },

  'array-insert-value': {
    id: 'array-insert-value',
    structureId: 'array',
    title: 'Insert Value',
    description:
      'Makes room at an index by copying every later element one place along, then writes the new value.',
    args: [
      { name: 'index', placeholder: '2' },
      { name: 'value', placeholder: '42' },
    ],
    code: lines(arrayInsertValueCode),
  },

  'array-remove-value': {
    id: 'array-remove-value',
    structureId: 'array',
    title: 'Remove Value',
    description:
      'Closes the gap left at an index by shifting every later element one place back, then drops the last slot.',
    args: [{ name: 'index', placeholder: '2' }],
    code: lines(arrayRemoveValueCode),
  },

  'linked-list-insert-head': {
    id: 'linked-list-insert-head',
    structureId: 'linked-list',
    title: 'Insert at Head',
    description:
      'Points a new node at the current head and makes it the head, so the list grows in constant time.',
    args: [{ name: 'value', placeholder: '42' }],
    code: lines(linkedListInsertHeadCode),
  },

  'linked-list-insert-after': {
    id: 'linked-list-insert-after',
    structureId: 'linked-list',
    title: 'Insert after Target',
    description:
      'Follows the chain to the node holding the target, then splices a new node in behind it.',
    args: [
      { name: 'target', placeholder: '13' },
      { name: 'value', placeholder: '42' },
    ],
    code: lines(linkedListInsertAfterCode),
  },

  'linked-list-remove': {
    id: 'linked-list-remove',
    structureId: 'linked-list',
    title: 'Remove',
    description:
      'Keeps a reference to the previous node while scanning, so the match can be unlinked by pointing past it.',
    args: [{ name: 'target', placeholder: '13' }],
    code: lines(linkedListRemoveCode),
  },

  'binary-search-tree-insert': {
    id: 'binary-search-tree-insert',
    structureId: 'binary-search-tree',
    title: 'Insert Value',
    description:
      'Descends left or right by comparing against each node, and hangs the new node off the first empty slot.',
    args: [{ name: 'value', placeholder: '42' }],
    code: lines(treeInsertCode),
  },

  'binary-search-tree-remove': {
    id: 'binary-search-tree-remove',
    structureId: 'binary-search-tree',
    title: 'Remove Value',
    description:
      'Unlinks a leaf, lifts a lone child into place, or — for a node with two children — replaces it with its inorder successor.',
    args: [{ name: 'value', placeholder: '42' }],
    code: lines(treeRemoveCode),
  },

  'max-heap-push': {
    id: 'max-heap-push',
    structureId: 'max-heap',
    title: 'Push',
    description:
      'Appends the value at the end, then swaps it upwards past any smaller parent until the heap order holds.',
    args: [{ name: 'value', placeholder: '42' }],
    code: lines(heapPushCode),
  },

  'max-heap-pop': {
    id: 'max-heap-pop',
    structureId: 'max-heap',
    title: 'Pop',
    description:
      'Moves the last value to the root and removes the old maximum, then sinks the root past its larger child.',
    args: [],
    code: lines(heapPopCode),
  },
};

export default algorithms;
