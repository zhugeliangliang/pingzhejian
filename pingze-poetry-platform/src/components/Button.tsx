import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-cinnabar text-rice-paper hover:bg-cinnabar/90 active:bg-cinnabar/80 shadow-sm',
  secondary: 'bg-transparent border border-ink-black/30 text-ink-black hover:border-indigo-blue hover:text-indigo-blue active:border-indigo-blue/80',
  ghost: 'bg-transparent text-ink-black/70 hover:text-cinnabar hover:bg-cinnabar/5 active:bg-cinnabar/10',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs tracking-wider',
  md: 'px-5 py-2.5 text-sm tracking-wider',
  lg: 'px-8 py-3 text-base tracking-wider',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  disabled = false,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center font-medium
        rounded-sm transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-cinnabar/40 focus:ring-offset-2 focus:ring-offset-rice-paper
        disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
