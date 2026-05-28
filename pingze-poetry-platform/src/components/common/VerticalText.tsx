interface VerticalTextProps {
  children: React.ReactNode;
  className?: string;
}

export default function VerticalText({ children, className = '' }: VerticalTextProps) {
  return (
    <div
      className={`inline-flex flex-col items-center writing-mode-vertical ${className}`}
      style={{
        writingMode: 'vertical-rl',
        textOrientation: 'mixed',
        letterSpacing: '0.3em',
        lineHeight: '1.8',
      }}
    >
      {children}
    </div>
  );
}
