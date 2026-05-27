import React, { useRef, useEffect, useState } from 'react';

interface TextAreaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
  className?: string;
  autoResize?: boolean;
  showCount?: boolean;
}

export default function TextArea({
  label,
  value,
  onChange,
  placeholder,
  error,
  className = '',
  rows = 4,
  maxLength,
  autoResize = false,
  showCount = false,
  id,
  ...props
}: TextAreaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [internalRows, setInternalRows] = useState(rows);
  const textareaId = id || `textarea-${label}`;

  useEffect(() => {
    if (autoResize && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      setInternalRows(Math.ceil(textareaRef.current.scrollHeight / 24));
    }
  }, [value, autoResize]);

  const currentLength = value.length;
  const charCount = maxLength ? `${currentLength}/${maxLength}` : `${currentLength}`;

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-2">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm text-ink-black/70 tracking-wider font-medium"
          >
            {label}
          </label>
        )}
        {showCount && (
          <span className="text-xs text-ink-black/40 tracking-wider tabular-nums">
            {charCount}
          </span>
        )}
      </div>
      <textarea
        ref={textareaRef}
        id={textareaId}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={autoResize ? internalRows : rows}
        maxLength={maxLength}
        className={`
          w-full px-4 py-3 bg-transparent text-ink-black resize-y
          placeholder-ink-black/30 text-sm tracking-wider leading-relaxed
          border rounded-sm
          transition-all duration-200
          focus:outline-none focus:ring-1 focus:ring-cinnabar/30 focus:border-cinnabar
          ${error
            ? 'border-cinnabar/60 bg-cinnabar/5'
            : 'border-ink-black/20 hover:border-ink-black/30'
          }
        `}
        aria-invalid={!!error}
        aria-describedby={error ? `${textareaId}-error` : undefined}
        {...props}
      />
      {error && (
        <p
          id={`${textareaId}-error`}
          className="mt-1.5 text-xs text-cinnabar tracking-wider"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}
