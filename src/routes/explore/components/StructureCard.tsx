import Card from '#components/Card.tsx';

import StructureOperationRow from './StructureOperationRow.tsx';

export interface StructureOperationArgument {
  name: string;
  placeholder?: string;
}

export interface StructureOperation {
  id: string;
  label: string;
  args: StructureOperationArgument[];
}

interface StructureCardProps {
  operations: StructureOperation[];
  onSubmit: (operationId: string, values: Record<string, string>) => void;
}

function StructureCard(props: StructureCardProps) {
  const { operations, onSubmit } = props;

  return (
    <Card
      title="Structure"
      description="Change the data the algorithm runs against."
      padded={false}
    >
      {/* Capped on small screens, where the card is in page flow; on large
          screens it fills the height the sidebar leaves it. */}
      <div className="flex max-h-[40vh] flex-col gap-8 overflow-auto p-5 lg:h-full lg:max-h-none">
        {operations.map((operation) => (
          <StructureOperationRow
            key={operation.id}
            label={operation.label}
            args={operation.args}
            onSubmit={(values) => onSubmit(operation.id, values)}
          />
        ))}
      </div>
    </Card>
  );
}

export default StructureCard;
