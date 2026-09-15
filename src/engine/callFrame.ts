import type { CallStackFrame } from './step.ts';
import {
  type CoreValue,
  type CoreVariable,
  formatCoreValue,
  isScalarValue,
} from './value.ts';

// One function call in progress, and everything the reader can see of it: the
// signature in the call stack, and the variables in memory.
export class CoreCallFrame {
  readonly id: string;
  readonly name: string;

  // Parameters first, in declaration order, then locals in the order they
  // were first set.
  variables: CoreVariable[];

  private readonly parameterCount: number;

  constructor(id: string, name: string, parameters: CoreVariable[]) {
    this.id = id;
    this.name = name;

    this.variables = [...parameters];
    this.parameterCount = parameters.length;
  }

  // Declares a local, or updates an existing variable in place. Setting a
  // parameter's name again refreshes the signature rather than adding a
  // local, which is how an algorithm that mutates an argument keeps the
  // signature true — v1's was a snapshot taken at call time and went stale.
  set(name: string, value: CoreValue) {
    const existing = this.variables.find((variable) => variable.name === name);

    if (existing === undefined) this.variables.push({ name, value });
    else existing.value = value;
  }

  // Drops a local that has left scope. Parameters live as long as the call,
  // so they are never dropped.
  clear(name: string) {
    const index = this.variables.findIndex(
      (variable) => variable.name === name,
    );

    if (index < this.parameterCount) return;

    this.variables.splice(index, 1);
  }

  signature(): string {
    const parameters = this.variables
      .slice(0, this.parameterCount)
      .map((variable) => `${variable.name}: ${formatCoreValue(variable.value)}`)
      .join(', ');

    return `${this.name}(${parameters})`;
  }

  serialize(): CallStackFrame {
    return {
      id: this.id,
      signature: this.signature(),
      variables: this.variables.filter((variable) =>
        isScalarValue(variable.value),
      ),
    };
  }
}
