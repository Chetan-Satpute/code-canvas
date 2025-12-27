import cn from '#utils/cn.tsx';

type ToastType = 'success' | 'error';

interface ToastProps {
  type: ToastType;
  title: string;
  subtitle: string;
}

function ToastComponent({ type, title, subtitle }: ToastProps) {
  const isSuccess = type === 'success';

  return (
    <div
      className={cn(
        'font-ubuntu-mono',
        'flex w-full items-center gap-4 rounded-none px-6 py-2 min-[480px]:rounded-full',
        'border border-white/10 bg-gradient-to-b from-neutral-700 to-neutral-800 text-white hover:from-white/20 hover:to-white/10',
      )}
    >
      <span
        className={cn(
          'h-3 w-3 shrink-0 rounded-sm',
          isSuccess ? 'bg-blue-400' : 'bg-yellow-400',
        )}
      />
      <div>
        <p className="font-ubuntu text-sm text-neutral-200">{title}</p>
        <p className="text-xs text-neutral-400">{subtitle}</p>
      </div>
    </div>
  );
}

export default ToastComponent;
