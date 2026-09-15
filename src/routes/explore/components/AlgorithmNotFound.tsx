import Card from '#components/Card.tsx';

import ExploreHeader from './ExploreHeader.tsx';

interface AlgorithmNotFoundProps {
  algorithmId: string;
}

// The route's id is whatever the URL carries, so it may name no algorithm.
function AlgorithmNotFound(props: AlgorithmNotFoundProps) {
  const { algorithmId } = props;

  return (
    <div className="bg-background text-foreground flex h-dvh flex-col">
      <ExploreHeader />

      <main className="flex min-h-0 flex-1 items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md">
          <Card
            title="Algorithm not found"
            description={`Nothing in the catalog is named "${algorithmId}".`}
            padded={false}
          />
        </div>
      </main>
    </div>
  );
}

export default AlgorithmNotFound;
