import { Link } from '@tanstack/react-router';

function StructurePage() {
  return (
    <div className="flex h-screen w-screen items-center justify-center [view-transition-name:page]">
      <h1 className="text-xl font-bold">Structure Page</h1>
      <Link
        to="/"
        viewTransition={{ types: ['fade'] }}
        className="m-2 rounded-lg border border-neutral-200/20 px-4 py-2 font-bold"
      >
        Home Page
      </Link>
    </div>
  );
}

export default StructurePage;
