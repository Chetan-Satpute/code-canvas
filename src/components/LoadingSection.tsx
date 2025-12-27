function LoadingSection() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
      <div className="flex items-center gap-2 text-neutral-400">
        <span className="inline-block h-3 w-3 animate-pulse rounded-sm bg-blue-400" />
        <span className="text-sm font-medium">Loading content</span>
      </div>

      <p className="text-sm text-neutral-500">
        Loading section, please wait...
      </p>
    </div>
  );
}

export default LoadingSection;
