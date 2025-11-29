import React from 'react';

import type { CoreFunction } from '#core/elements/function.tsx';
import cn from '#utils/cn.tsx';

interface CallStackItemProps {
  active: boolean;
  item: CoreFunction;
}

function CallStackItem(props: CallStackItemProps) {
  const { active, item } = props;

  const argItems: React.ReactNode[] = [];

  item.arguments.forEach(({ parameter, argument }, index) => {
    // parameter name
    argItems.push(
      <span key={`param-${index}`} style={{ color: '#EEFFFF' }}>
        {parameter}
        {': '}
      </span>,
    );

    if (Array.isArray(argument)) {
      // opening bracket
      argItems.push(
        <span key={`open-${index}`} style={{ color: '#EEFFFF' }}>
          [
        </span>,
      );

      argument.forEach((value, valueIndex) => {
        argItems.push(
          <span key={`val-${index}-${valueIndex}`} style={{ color: '#F78C6C' }}>
            {value}
          </span>,
        );

        if (valueIndex !== argument.length - 1) {
          argItems.push(
            <span
              key={`comma-${index}-${valueIndex}`}
              style={{ color: '#89DDFF' }}
            >
              ,
            </span>,
          );
        }
      });

      // closing bracket
      argItems.push(
        <span key={`close-${index}`} style={{ color: '#EEFFFF' }}>
          ]
        </span>,
      );
    } else if (typeof argument === 'number') {
      argItems.push(
        <span key={`num-${index}`} style={{ color: '#F78C6C' }}>
          {argument}
        </span>,
      );
    }

    if (index !== item.arguments.length - 1) {
      argItems.push(
        <span key={`sep-${index}`} style={{ color: '#89DDFF' }}>
          {', '}
        </span>,
      );
    }
  });

  return (
    <div
      className={cn(
        'no-scrollbar shrink-0 overflow-auto p-1 text-xs',
        active && 'bg-gradient-to-r from-white/20 to-transparent',
      )}
    >
      <code className="size-min min-w-full px-2 text-nowrap">
        <span key="name" style={{ color: '#82AAFF' }}>
          {item.name}
        </span>
        <span key="open-paren" style={{ color: '#EEFFFF' }}>
          (
        </span>
        {argItems}
        <span key="close-paren" style={{ color: '#EEFFFF' }}>
          )
        </span>
      </code>
    </div>
  );
}

export default CallStackItem;
