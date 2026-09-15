import Card from '#components/Card.tsx';
import type { StructureOperation } from '#constants/structures.ts';

import StructureOperationRow from './StructureOperationRow.tsx';

interface StructureCardProps {
  title: string;
  description: string;
  operations: StructureOperation[];
  onSubmit: (operationId: string, values: Record<string, string>) => void;
}

function StructureCard(props: StructureCardProps) {
  const { title, description, operations, onSubmit } = props;

  return (
    <Card title={title} description={description} padded={false}>
      {/* Capped on small screens, where the card is in page flow; on large
          screens it fills the height the sidebar leaves it. */}
      <div className="flex max-h-[40vh] flex-col gap-8 overflow-auto p-5 lg:h-full lg:max-h-none">
        {operations.map((operation) => (
          <StructureOperationRow
            key={operation.id}
            label={operation.label}
            args={operation.args}
            applicable={operation.apply !== undefined}
            onSubmit={(values) => onSubmit(operation.id, values)}
          />
        ))}
      </div>
    </Card>
  );
}

export default StructureCard;
