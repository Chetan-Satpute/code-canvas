import { useParams } from '@tanstack/react-router';

function ExplorePage() {
  const { algorithmId } = useParams({
    from: '/$algorithmId',
  });

  return (
    <div className="bg-background flex h-screen w-screen items-center justify-center">
      <h1 className="text-foreground font-en-display text-xl font-bold">
        {algorithmId}
      </h1>
    </div>
  );
}

export default ExplorePage;
