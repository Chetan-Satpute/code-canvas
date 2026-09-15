// What a typed argument has to look like to be accepted. Declared on the
// argument in the catalog so the field and the engine that parses it cannot
// disagree about what is valid.
export type ArgumentKind = 'number' | 'integer';

// The minimum an argument declaration has to carry to be checked. Both
// `AlgorithmArgument` and `StructureOperationArgument` satisfy it.
interface CheckableArgument {
  name: string;
  kind?: ArgumentKind;
}

// Blank counts as unanswered rather than as zero — `Number('')` is 0, which
// would quietly turn an empty index into a valid 0.
export function parseArgument(
  raw: string,
  kind: ArgumentKind = 'number',
): number | null {
  const text = raw.trim();
  if (text === '') return null;

  const value = Number(text);
  if (!Number.isFinite(value)) return null;
  if (kind === 'integer' && !Number.isInteger(value)) return null;

  return value;
}

// The names of the arguments a submission cannot use, which is what the form
// marks. Whether a value is in range is not decided here: an index is checked
// against the structure's current length, which only the engine knows.
export function invalidArguments(
  args: CheckableArgument[],
  values: Record<string, string>,
): string[] {
  return args
    .filter((arg) => parseArgument(values[arg.name] ?? '', arg.kind) === null)
    .map((arg) => arg.name);
}
