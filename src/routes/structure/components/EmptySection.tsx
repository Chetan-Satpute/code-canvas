function EmptySection() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
      <div className="flex items-center gap-2 text-neutral-400">
        <span className="inline-block h-3 w-3 rounded-sm border border-neutral-600" />
        <span className="text-sm font-medium uppercase">Coming Soon</span>
      </div>

      <p className="text-sm text-neutral-500">
        Algorithms for this structure are planned but not available yet.
      </p>
    </div>
  );
}

export default EmptySection;
