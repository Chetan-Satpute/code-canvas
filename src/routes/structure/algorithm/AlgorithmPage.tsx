import { Navigate, useParams } from '@tanstack/react-router';

import { usePlayContextRef } from '#hooks/playContext.tsx';

import CallStack from './components/CallStack';
import CodeBlock from './components/CodeBlock';
import Controls from './components/Controls';

function AlgorithmPage() {
  const { structureID } = useParams({ from: '/$structureID/$algorithmID' });

  const playGeneratorRef = usePlayContextRef();

  // Redirect to structure page if play generator isn't available
  if (!playGeneratorRef.current || !playGeneratorRef.current.generator) {
    return <Navigate to="/$structureID" params={{ structureID }} />;
  }

  return (
    <aside className="m-1 flex flex-1 flex-col overflow-auto rounded-lg bg-neutral-800 lg:m-2">
      <Controls />
      <CodeBlock />
      <CallStack />
    </aside>
  );
}

export default AlgorithmPage;
