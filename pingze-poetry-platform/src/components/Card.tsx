import React from 'react';

type CardVariant = 'default' | 'raised';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: CardVariant;
}

const variantClasses: Record<CardVariant, string> = {
  default: 'bg-rice-paper border border-ink-black/8',
  raised: 'bg-rice-paper border border-ink-black/8 shadow-md hover:shadow-lg',
};

export default function Card({
  children,
  className = '',
  variant = 'default',
}: CardProps) {
  return (
    <div
      className={`
        rounded-sm transition-all duration-300
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
