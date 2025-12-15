import { useAppSelector } from '#redux/hooks.tsx';

import CallStackItem from './CallStackItem';

function CallStack() {
  const items = useAppSelector((state) => state.app.callStack);

  return (
    <div className="flex h-1/4 flex-col gap-1 pb-2">
      <h4 className="px-2 text-sm font-bold">Call Stack</h4>
      <div className="flex flex-1 flex-col overflow-auto">
        {items.map((item, index) => (
          <CallStackItem
            key={`${item.name}-${index}`}
            active={index === 0}
            item={item}
          />
        ))}
      </div>
    </div>
  );
}

export default CallStack;
