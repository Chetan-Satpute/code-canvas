import type { PropsWithChildren } from 'react';

function Card(props: PropsWithChildren) {
  const { children } = props;

  return (
    <div className="bg-card border-border rounded-xl border p-6">
      {children}
    </div>
  );
}

export default Card;
