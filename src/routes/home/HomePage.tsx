import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';

import cn from '#utils/cn.tsx';

function HomePage() {
  const structures = [
    {
      title: 'Array',
      description:
        'An array is a fixed-size collection of elements stored in order, where each element can be accessed directly by its index.',
    },
    {
      title: 'Linked List',
      description:
        'A linked list is a linear collection of nodes, where each node contains data and a reference to the next node in sequence.',
    },
    {
      title: 'Binary Search Tree',
      description:
        'A binary search tree stores elements in nodes, ensuring left children are smaller and right children are larger than their parent node.',
    },
    {
      title: 'Red-Black Tree',
      description:
        'A red-black tree is a self-balancing binary search tree that maintains balance using color properties and rotation rules.',
    },
    {
      title: 'Max Heap',
      description:
        'A max heap is a complete binary tree where the value of each node is greater than or equal to the values of its children.',
    },
  ];

  return (
    <div className="h-screen w-screen overflow-auto bg-neutral-900 text-white [view-transition-name:page]">
      {/* Hero Section */}
      <section className="m-auto flex min-h-1/3 max-w-4xl flex-col items-center justify-center px-6 text-center">
        <h1 className="mb-4 text-4xl font-bold lg:text-5xl">Code Canvas</h1>
        <p className="max-w-3xl text-base text-neutral-300 lg:text-lg">
          An interactive platform to explore and understand algorithms visually.
          Watch code come alive as you step through each line and see how data
          structures change in real time.
        </p>
      </section>

      {/* Cards Section */}
      <section className="m-auto grid grid-cols-1 gap-6 px-6 pb-12 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {structures.map((structure) => (
          <Link
            key={structure.title}
            to="/$structureID"
            params={{ structureID: structure.title }}
            className={cn(
              'group relative flex h-full w-full cursor-pointer flex-col justify-between rounded-2xl bg-gradient-to-b from-neutral-800 to-neutral-900 p-6 text-left shadow-sm ring-1 ring-white/5 transition-all duration-200 hover:-translate-y-1 hover:shadow-blue-400/40 hover:ring-blue-400/40 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none active:scale-[0.98]',
            )}
            viewTransition={{ types: ['fade'] }}
          >
            <div>
              <h2 className="mb-2 text-xl font-bold">{structure.title}</h2>
              <p className="text-base text-neutral-300">
                {structure.description}
              </p>
            </div>

            {/* Always visible on mobile, hover-only on desktop */}
            <div className="mt-4 flex items-center text-blue-400 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100">
              <span className="mr-1 text-sm font-medium">Explore</span>
              <ArrowRight className="h-5 w-5" strokeWidth={2} />
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}

export default HomePage;
