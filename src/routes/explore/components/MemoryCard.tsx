import Card from '#components/Card.tsx';
import CodeTokens from '#components/CodeTokens.tsx';
import { type CoreVariable, formatCoreValue } from '#engine/value.ts';
import { highlightSignature } from '#utils/signature.ts';

interface MemoryCardProps {
  variables: CoreVariable[];
}

// The variables of the frame the run is currently inside — the one the call
// stack highlights. Structures live on the canvas, so this holds the scalars.
function MemoryCard(props: MemoryCardProps) {
  const { variables } = props;

  return (
    <Card title="Memory" padded={false}>
      <div className="max-h-[40vh] overflow-auto p-5 lg:h-full lg:max-h-none">
        {variables.length === 0 ? (
          <p className="text-muted-foreground font-en text-sm">
            No variables in scope yet.
          </p>
        ) : (
          <dl className="flex flex-col gap-2">
            {variables.map((variable) => (
              <div
                key={variable.name}
                className="flex items-baseline justify-between gap-3"
              >
                <dt className="font-code text-muted-foreground shrink-0 text-sm">
                  {variable.name}
                </dt>

                {/* Painted from the same palette as the listing above, so a
                    number here is the color it is there. */}
                <dd className="font-code min-w-0 text-right text-sm break-all">
                  <CodeTokens
                    tokens={highlightSignature(formatCoreValue(variable.value))}
                  />
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </Card>
  );
}

export default MemoryCard;
