import Card from '#components/Card.tsx';

import StructureOperationRow from './StructureOperationRow.tsx';

export interface StructureOperation {
  id: string;
  label: string;
  placeholder?: string;
}

interface StructureCardProps {
  operations: StructureOperation[];
  onSubmit: (operationId: string, value: string) => void;
}

function StructureCard(props: StructureCardProps) {
  const { operations, onSubmit } = props;

  return (
    <Card
      title="Structure"
      description="Change the data the algorithm runs against."
    >
      <div className="flex flex-col gap-3">
        {operations.map((operation) => (
          <StructureOperationRow
            key={operation.id}
            label={operation.label}
            placeholder={operation.placeholder}
            onSubmit={(value) => onSubmit(operation.id, value)}
          />
        ))}
      </div>
    </Card>
  );
}

export default StructureCard;
