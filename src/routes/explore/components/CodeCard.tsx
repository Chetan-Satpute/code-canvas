import Card from '#components/Card.tsx';

interface CodeCardProps {
  lines: string[];
}

function CodeCard(props: CodeCardProps) {
  const { lines } = props;

  return (
    <Card title="Code" padded={false}>
      {/* Capped on small screens, where the card is in page flow; on large
          screens it fills the grid row the page gives it. */}
      <div className="max-h-[50vh] overflow-auto p-5 lg:h-full lg:max-h-none">
        <ol className="font-code text-sm leading-relaxed">
          {lines.map((line, index) => (
            <li key={index} className="flex gap-4">
              <span className="text-muted-foreground w-6 shrink-0 text-right select-none">
                {index + 1}
              </span>
              <code className="text-card-foreground whitespace-pre">
                {line}
              </code>
            </li>
          ))}
        </ol>
      </div>
    </Card>
  );
}

export default CodeCard;
