interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export default function LoadingSpinner({ size = 'md', text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 p-8">
      <div className={`relative ${sizeClasses[size]}`}>
        <svg
          className="w-full h-full animate-spin"
          viewBox="0 0 50 50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="25"
            cy="25"
            r="20"
            stroke="currentColor"
            strokeWidth="2"
            className="text-ink-black/10"
          />
          <circle
            cx="25"
            cy="25"
            r="20"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="31.4 125.6"
            className="text-cinnabar"
          />
        </svg>
      </div>
      {text && (
        <span className={`${textSizeClasses[size]} text-ink-black/50 tracking-wider animate-pulse`}>
          {text}
        </span>
      )}
    </div>
  );
}
