import { ArrowRight } from 'lucide-react';

import cn from '#utils/cn.tsx';

function HomePage() {
  return (
    <div className="h-screen w-screen overflow-auto">
      <section className="m-auto flex min-h-1/3 max-w-3xl flex-col items-center justify-center px-4 text-center">
        <h1 className="mb-4 text-4xl font-bold lg:text-5xl">Code Canvas</h1>
        <p className="text-base lg:text-lg">
          An interactive space to explore and understand algorithms visually.
          Watch code come alive as you step through each line and see how data
          structures change in real time.
        </p>
      </section>
      <section className="bg-neutral-800">
        <div className="w-full p-4 lg:w-1/2 lg:px-8">
          <h2 className="mb-4 text-3xl font-bold">Array</h2>
          <p className="mb-4 text-base lg:text-lg">
            An array is a fixed-size collection of elements stored in order,
            where each element can be accessed directly by its index.
          </p>
          <button
            className={cn(
              'flex items-center justify-center gap-2',
              'rounded rounded-lg px-4 py-2 font-bold',
              'bg-gradient-to-r from-indigo-600 to-blue-600',
              'cursor-pointer hover:from-indigo-600/80 hover:to-blue-600/80',
              'transition active:scale-95'
            )}
          >
            <span>Explore Array Algorithms</span>
            <ArrowRight size={14} strokeWidth={4} />
          </button>
        </div>
        <div className="hidden lg:block"></div>
      </section>
    </div>
  );
}

export default HomePage;
