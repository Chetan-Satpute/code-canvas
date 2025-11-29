import CodeBlock from './components/CodeBlock';
import Controls from './components/Controls';

function AlgorithmPage() {
  return (
    <aside className="m-1 flex flex-1 flex-col rounded-lg bg-neutral-800 lg:m-2">
      <Controls />
      <CodeBlock />
    </aside>
  );
}

export default AlgorithmPage;
