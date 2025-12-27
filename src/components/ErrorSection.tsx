interface ErrorSectionProps {
  onRetry: () => void;
}

function ErrorSection(props: ErrorSectionProps) {
  const { onRetry } = props;

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
      <div className="flex items-center gap-2 text-neutral-400">
        <span className="h-3 w-3 rounded-sm bg-yellow-400" />
        <span className="text-sm font-medium">Unable to load content</span>
      </div>

      <p className="text-sm text-neutral-500">
        There was an issue fetching this section.
      </p>

      <button
        className="mt-2 w-full max-w-xs cursor-pointer rounded-md border border-neutral-700/40 px-3 py-1.5 text-sm text-neutral-300 hover:bg-neutral-800/60"
        onClick={onRetry}
      >
        Retry
      </button>
    </div>
  );
}

export default ErrorSection;
