import React from 'react';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  className?: string;
}

export default function Input({
  label,
  value,
  onChange,
  placeholder,
  error,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id || `input-${label}`;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm text-ink-black/70 mb-2 tracking-wider font-medium"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`
          w-full px-4 py-3 bg-transparent text-ink-black
          placeholder-ink-black/30 text-sm tracking-wider
          border rounded-sm
          transition-all duration-200
          focus:outline-none focus:ring-1 focus:ring-cinnabar/30 focus:border-cinnabar
          ${error
            ? 'border-cinnabar/60 bg-cinnabar/5'
            : 'border-ink-black/20 hover:border-ink-black/30'
          }
        `}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error && (
        <p
          id={`${inputId}-error`}
          className="mt-1.5 text-xs text-cinnabar tracking-wider"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}
