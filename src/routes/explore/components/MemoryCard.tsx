import Card from '#components/Card.tsx';

export interface MemoryVariable {
  name: string;
  value: string;
}

interface MemoryCardProps {
  variables: MemoryVariable[];
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

                <dd className="font-code text-card-foreground min-w-0 text-right text-sm break-all">
                  {variable.value}
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
