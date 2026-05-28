import React from 'react';

type BadgeVariant = 'default' | 'cinnabar' | 'indigo';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-ink-black/8 text-ink-black/70',
  cinnabar: 'bg-cinnabar/10 text-cinnabar border border-cinnabar/20',
  indigo: 'bg-indigo-blue/10 text-indigo-blue border border-indigo-blue/20',
};

export default function Badge({
  children,
  variant = 'default',
  className = '',
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5
        text-xs font-medium tracking-wider
        rounded-sm transition-colors duration-200
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
