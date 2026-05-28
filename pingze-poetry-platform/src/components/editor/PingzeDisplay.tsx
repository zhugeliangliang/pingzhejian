import type { CharAnalysis, PatternMatchResult } from '../../utils/pingze-detector';

interface PingzeDisplayProps {
  lineAnalysis: { chars: CharAnalysis[] } | null;
  isRhymeLine?: boolean;
  showErrors?: boolean;
  errors?: PatternMatchResult['errors'];
  lineIndex?: number;
  className?: string;
}

export default function PingzeDisplay({
  lineAnalysis,
  isRhymeLine = false,
  showErrors = true,
  errors = [],
  lineIndex = -1,
  className = '',
}: PingzeDisplayProps) {
  if (!lineAnalysis || lineAnalysis.chars.length === 0) return null;

  const lineErrors = lineIndex >= 0 ? errors.filter((e) => e.line === lineIndex) : [];
  const errorIndices = new Set(lineErrors.map((e) => e.charIndex));

  return (
    <div className={`flex items-center gap-1 flex-wrap ${className}`}>
      {lineAnalysis.chars.map((char, i) => {
        if (char.pingze === '标点') return null;

        const hasError = errorIndices.has(i);

        let pingzeColor = 'text-ink-black/30';
        let bgColor = 'bg-transparent';
        let borderColor = 'border-transparent';

        if (char.pingze === '平') {
          pingzeColor = 'text-indigo-blue/70';
        } else if (char.pingze === '仄') {
          pingzeColor = 'text-cinnabar/70';
        } else {
          pingzeColor = 'text-ink-black/30';
        }

        if (hasError && showErrors) {
          pingzeColor = 'text-red-700 font-bold';
          bgColor = 'bg-red-100/60';
          borderColor = 'border-red-400/40';
        }

        return (
          <span
            key={i}
            className={`inline-flex items-center justify-center min-w-[1.25rem] px-0.5 text-xs font-mono rounded-sm border ${pingzeColor} ${bgColor} ${borderColor} transition-colors duration-150`}
            title={`${char.char} - ${char.pingze}${char.pinyin ? ' (' + char.pinyin + ')' : ''}`}
          >
            {char.pingze}
          </span>
        );
      })}

      {isRhymeLine && (
        <span
          className="ml-1 text-xs text-cinnabar/80 border border-cinnabar/30 px-1 py-0.5 rounded-sm bg-cinnabar/5"
          title="韵脚"
        >
          韵
        </span>
      )}
    </div>
  );
}
