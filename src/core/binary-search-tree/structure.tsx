import { CANVAS_NODE_HEIGHT, CANVAS_NODE_WIDTH } from '#constants/canvas.tsx';
import { CoreEdge } from '#core/elements/edge.tsx';
import type { CoreFrame } from '#core/elements/frame.tsx';
import { CoreLabel } from '#core/elements/label.tsx';
import { CoreNode } from '#core/elements/node.tsx';
import { CoreStructure } from '#core/structure.tsx';

export interface CoreBSTDataNode {
  value?: number;
  left?: CoreBSTDataNode;
  right?: CoreBSTDataNode;
}

export class CoreBSTNode extends CoreNode {
  left: CoreEdge<CoreBSTNode> | null;
  right: CoreEdge<CoreBSTNode> | null;

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

  setLeft(node?: CoreBSTNode | null) {
    if (node) this.left = new CoreEdge(this, node);
    else this.left = null;
  }

  setRight(node?: CoreBSTNode | null) {
    if (node) this.right = new CoreEdge(this, node);
    else this.right = null;
  }
}

export class CoreBST extends CoreStructure {
  root: CoreBSTNode | null;
  name?: CoreLabel;

  constructor() {
    super();

    this.root = null;
  }

  static fromData(data: CoreBSTDataNode): CoreBST {
    const bst = new CoreBST();

    const recurse = (dataNode: CoreBSTDataNode) => {
      if (dataNode.value == null) return null;

      const node = new CoreBSTNode(dataNode.value);

      if (dataNode.left) node.setLeft(recurse(dataNode.left));
      if (dataNode.right) node.setRight(recurse(dataNode.right));

      return node;
    };

    bst.setRoot(recurse(data));

    return bst;
  }

  toData(): CoreBSTDataNode {
    const recurse = (node?: CoreBSTNode | null): CoreBSTDataNode => {
      if (!node) return {};

      const dataNode: CoreBSTDataNode = {
        value: node.value,
      };

      const left = node.left?.end;
      const right = node.right?.end;

      if (left) dataNode.left = recurse(left);
      if (right) dataNode.right = recurse(right);

      return dataNode;
    };

    return recurse(this.root);
  }

  serialize(frame: CoreFrame): void {
    const traverse = (node: CoreBSTNode | null) => {
      if (!node) return;

      node.serialize(frame);

      if (node.left) {
        node.left.serialize(frame);
        traverse(node.left.end);
      }

      if (node.right) {
        node.right.serialize(frame);
        traverse(node.right.end);
      }
    };

    traverse(this.root);

    this.name?.serialize(frame);
  }

  rearrange(): void {
    if (!this.root) return;

    let x = this.x;

    const traverse = (node: CoreBSTNode | null, level: number) => {
      if (!node) return;

      if (node.left) {
        if (this.opacity !== 1) node.left.opacity = this.opacity;
        traverse(node.left.end, level + 1);
      }

      node.moveTo(x, this.y + level * CANVAS_NODE_HEIGHT * 2);
      if (this.opacity !== 1) node.opacity = this.opacity;
      x += CANVAS_NODE_WIDTH;

      if (node.right) {
        if (this.opacity !== 1) node.right.opacity = this.opacity;
        traverse(node.right.end, level + 1);
      }
    };

    traverse(this.root, 0);

    this.root.setLabel('top', 'root');
    this.root.rearrange();

    if (this.name) {
      this.name.x = this.x - CANVAS_NODE_WIDTH;
      this.name.y = this.y;
    }
  }

  setName(name?: string) {
    if (name) this.name = new CoreLabel(name);
    else this.name = undefined;
  }

  setRoot(node?: CoreBSTNode | null) {
    if (node) {
      this.root?.setLabel('top');
      this.root = node;
    } else {
      this.root = null;
    }
  }
}
