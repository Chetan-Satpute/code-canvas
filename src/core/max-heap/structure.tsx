import { CANVAS_NODE_HEIGHT, CANVAS_NODE_WIDTH } from '#constants/canvas.tsx';
import { CoreEdge } from '#core/elements/edge.tsx';
import type { CoreFrame } from '#core/elements/frame.tsx';
import { CoreLabel } from '#core/elements/label.tsx';
import { CoreNode } from '#core/elements/node.tsx';
import { CoreStructure } from '#core/structure.tsx';

export class CoreMaxHeapTreeNode extends CoreNode {
  left: CoreEdge<CoreMaxHeapTreeNode> | null;
  right: CoreEdge<CoreMaxHeapTreeNode> | null;

  constructor(value: number) {
    super(value);

    this.left = null;
    this.right = null;
  }

  serialize(frame: CoreFrame): void {
    super.serialize(frame);

    this.left?.serialize(frame);
    this.right?.serialize(frame);
  }

  setLeft(node?: CoreMaxHeapTreeNode | null) {
    if (node) this.left = new CoreEdge(this, node);
    else this.left = null;
  }

  setRight(node?: CoreMaxHeapTreeNode | null) {
    if (node) this.right = new CoreEdge(this, node);
    else this.right = null;
  }
}

export class CoreMaxHeapNode {
  arrayNode: CoreNode;
  treeNode: CoreMaxHeapTreeNode;

  constructor(value: number) {
    this.arrayNode = new CoreNode(value);
    this.treeNode = new CoreMaxHeapTreeNode(value);
  }

  rearrange() {
    this.arrayNode.rearrange();
    this.treeNode.rearrange();
  }

  serialize(frame: CoreFrame): void {
    this.arrayNode.serialize(frame);
    this.treeNode.serialize(frame);
  }
}

export class CoreMaxHeap extends CoreStructure {
  arrayName?: CoreLabel;
  treeName?: CoreLabel;
  nodes: CoreMaxHeapNode[];

  constructor() {
    super();

    this.nodes = [];
  }

  static fromData(data: number[]): CoreMaxHeap {
    const heap = new CoreMaxHeap();

    heap.nodes = data.map((value) => new CoreMaxHeapNode(value));

    for (let i = 0; i < heap.nodes.length; i++) {
      const leftIndex = 2 * i + 1;
      const rightIndex = 2 * i + 2;

      if (leftIndex < heap.nodes.length) {
        heap.nodes[i].treeNode.setLeft(heap.nodes[leftIndex].treeNode);
      }

      if (rightIndex < heap.nodes.length) {
        heap.nodes[i].treeNode.setRight(heap.nodes[rightIndex].treeNode);
      }
    }

    return heap;
  }

  toData(): number[] {
    return this.nodes.map((node) => node.arrayNode.value);
  }

  serialize(frame: CoreFrame): void {
    for (const node of this.nodes) node.serialize(frame);

    this.treeName?.serialize(frame);
    this.arrayName?.serialize(frame);
  }

  rearrange(): void {
    if (this.nodes.length === 0) {
      if (this.arrayName) {
        this.arrayName.x = this.x - CANVAS_NODE_WIDTH;
        this.arrayName.y = this.y;
      }

      return;
    }

    // Tree =====

    let treeX = this.x;
    const treeY = this.y + CANVAS_NODE_HEIGHT * 3;

    const traverse = (node: CoreMaxHeapTreeNode, level: number) => {
      if (!node) return;

      if (node.left) {
        if (this.opacity !== 1) node.left.opacity = this.opacity;
        traverse(node.left.end, level + 1);
      }

      node.moveTo(treeX, treeY + level * CANVAS_NODE_HEIGHT * 2);
      if (this.opacity !== 1) node.opacity = this.opacity;
      treeX += CANVAS_NODE_WIDTH;

      if (node.right) {
        if (this.opacity !== 1) node.right.opacity = this.opacity;
        traverse(node.right.end, level + 1);
      }
    };

    traverse(this.nodes[0].treeNode, 0);

    this.nodes[0].treeNode.setLabel('top', 'top');
    this.nodes[0].treeNode.rearrange();

    if (this.treeName) {
      this.treeName.x = this.nodes[0].treeNode.x - CANVAS_NODE_WIDTH;
      this.treeName.y = this.y + CANVAS_NODE_HEIGHT * 3;
    }

    // Array =====

    for (let i = 0; i < this.nodes.length; i++) {
      this.nodes[i].arrayNode.x = this.x + i * CANVAS_NODE_WIDTH;
      this.nodes[i].arrayNode.y = this.y;

      if (!this.nodes[i].arrayNode.label.top) {
        this.nodes[i].arrayNode.setLabel('top', i.toString());
        this.nodes[i].arrayNode.rearrange();
      }

      if (this.opacity !== 1) {
        this.nodes[i].arrayNode.opacity = this.opacity;
      }
    }

    if (this.arrayName) {
      this.arrayName.x = this.x - CANVAS_NODE_WIDTH;
      this.arrayName.y = this.y;
    }
  }

  setName(name?: string) {
    if (name) {
      this.arrayName = new CoreLabel(name);
      this.treeName = new CoreLabel(name);
    } else {
      this.arrayName = undefined;
      this.treeName = undefined;
    }
  }

  push(value: number) {
    this.nodes.push(new CoreMaxHeapNode(value));

    const nodeIndex = this.nodes.length - 1;
    if (nodeIndex === 0) return;

    const parentIndex = Math.floor((nodeIndex - 1) / 2);

    const leftIndex = parentIndex * 2 + 1;
    const rightIndex = parentIndex * 2 + 2;

    if (nodeIndex === leftIndex) {
      this.nodes[parentIndex].treeNode.setLeft(this.nodes[nodeIndex].treeNode);
    }

    if (nodeIndex === rightIndex) {
      this.nodes[parentIndex].treeNode.setRight(this.nodes[nodeIndex].treeNode);
    }
  }

  pop(): CoreMaxHeapNode | null {
    if (this.nodes.length === 0) return null;

    const nodeIndex = this.nodes.length - 1;
    const node = this.nodes[nodeIndex];

    if (nodeIndex === 0) {
      this.nodes.pop();

      return node;
    }

    const parentIndex = Math.floor((nodeIndex - 1) / 2);
    const leftIndex = parentIndex * 2 + 1;
    const rightIndex = parentIndex * 2 + 2;

    if (nodeIndex === leftIndex) {
      this.nodes[parentIndex].treeNode.setLeft();
    }

    if (nodeIndex === rightIndex) {
      this.nodes[parentIndex].treeNode.setRight();
    }

    this.nodes.pop();

    return node;
  }

  swapValues(indexA: number, indexB: number) {
    [this.nodes[indexA].treeNode.value, this.nodes[indexB].treeNode.value] = [
      this.nodes[indexB].treeNode.value,
      this.nodes[indexA].treeNode.value,
    ];
    [this.nodes[indexA].arrayNode.value, this.nodes[indexB].arrayNode.value] = [
      this.nodes[indexB].arrayNode.value,
      this.nodes[indexA].arrayNode.value,
    ];
  }

  getInorderNodes(): CoreMaxHeapTreeNode[] {
    if (this.nodes.length === 0) return [];

    const result: CoreMaxHeapTreeNode[] = [];

    const traverse = (node: CoreMaxHeapTreeNode | null) => {
      if (!node) return;

      if (node.left) traverse(node.left.end);
      result.push(node);
      if (node.right) traverse(node.right.end);
    };

    traverse(this.nodes[0].treeNode);
    return result;
  }

  getInorderRightNodes(current: CoreMaxHeapTreeNode): CoreMaxHeapTreeNode[] {
    const inorder = this.getInorderNodes();
    const index = inorder.indexOf(current);

    if (index === -1) return [];
    return inorder.slice(index + 1);
  }
}
