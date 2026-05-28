import { getWordCategory, getOppositePingze } from '../../utils/parallelism-suggester';
import { getPatternString, analyzeLine } from '../../utils/pingze-detector';

interface ParallelismSuggestionProps {
  referenceLine: string;
  suggestions: { suggestion: string; explanation: string }[];
  onInsert: (suggestion: string) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  '名词': 'text-blue-600 bg-blue-50 border-blue-200',
  '动词': 'text-red-600 bg-red-50 border-red-200',
  '形容词': 'text-green-600 bg-green-50 border-green-200',
  '副词': 'text-purple-600 bg-purple-50 border-purple-200',
  '代词': 'text-yellow-600 bg-yellow-50 border-yellow-200',
  '介词': 'text-indigo-600 bg-indigo-50 border-indigo-200',
  '连词': 'text-pink-600 bg-pink-50 border-pink-200',
};

export function ParallelismSuggestion({
  referenceLine,
  suggestions,
  onInsert,
}: ParallelismSuggestionProps) {
  const refPattern = referenceLine ? getPatternString(referenceLine) : '';

  if (suggestions.length === 0) {
    return (
      <div className="space-y-4">
        {referenceLine && (
          <div className="bg-ink-black/5 rounded-sm p-3 space-y-2">
            <div className="text-xs text-ink-black/50 tracking-wider">参考句</div>
            <div className="text-base text-ink-black tracking-wider">{referenceLine}</div>
            {refPattern && (
              <div className="text-xs font-mono text-ink-black/40">平仄：{refPattern}</div>
            )}
          </div>
        )}
        <div className="text-sm text-ink-black/40 text-center py-4">
          暂无对仗建议，可先输入参考句
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {referenceLine && (
        <div className="bg-ink-black/5 rounded-sm p-3 space-y-2">
          <div className="text-xs text-ink-black/50 tracking-wider">参考句</div>
          <div className="text-base text-ink-black tracking-wider">{referenceLine}</div>
          <div className="flex flex-wrap gap-1">
            {referenceLine.split('').map((char, i) => {
              const category = getWordCategory(char);
              const analysis = analyzeLine(referenceLine)[i];
              return (
                <span
                  key={i}
                  className={`inline-flex items-center justify-center w-6 h-6 text-xs rounded-sm border transition-all ${
                    category
                      ? CATEGORY_COLORS[category] || 'text-gray-600 bg-gray-50 border-gray-200'
                      : 'text-ink-black/30 bg-transparent border-transparent'
                  }`}
                  title={category || analysis?.pingze || ''}
                >
                  {char}
                </span>
              );
            })}
          </div>
          {refPattern && (
            <div className="text-xs font-mono text-ink-black/40">
              平仄：{refPattern} → {getOppositePingze(refPattern)}
            </div>
          )}
        </div>
      )}

      <div className="space-y-3">
        <h4 className="text-sm font-medium text-ink-black/70 tracking-wider">
          对仗候选
        </h4>
        {suggestions.map((item, index) => (
          <ParallelismCard
            key={index}
            suggestion={item.suggestion}
            explanation={item.explanation}
            referenceLine={referenceLine}
            onInsert={onInsert}
          />
        ))}
      </div>
    </div>
  );
}

interface ParallelismCardProps {
  suggestion: string;
  explanation: string;
  referenceLine: string;
  onInsert: (suggestion: string) => void;
}

function ParallelismCard({
  suggestion,
  explanation,
  referenceLine,
  onInsert,
}: ParallelismCardProps) {
  const suggestionPattern = getPatternString(suggestion);
  const refPattern = referenceLine ? getPatternString(referenceLine) : '';

  const suggestionChars = suggestion.split('');
  const refChars = referenceLine.split('');

  return (
    <div className="border border-ink-black/10 rounded-sm p-4 space-y-3 hover:border-cinnabar/30 transition-colors">
      <button
        onClick={() => onInsert(suggestion)}
        className="w-full text-left"
      >
        <div className="text-base text-ink-black tracking-widest font-medium hover:text-cinnabar transition-colors">
          {suggestion}
        </div>
      </button>

      <div className="flex flex-wrap gap-1">
        {suggestionChars.map((char, i) => {
          const category = getWordCategory(char);
          const refChar = refChars[i];
          const refCategory = refChar ? getWordCategory(refChar) : null;
          const match = category && refCategory && category === refCategory;

          return (
            <span
              key={i}
              className={`inline-flex items-center justify-center w-6 h-6 text-xs rounded-sm border transition-all ${
                match
                  ? CATEGORY_COLORS[category] || 'text-gray-600 bg-gray-50 border-gray-200'
                  : 'text-ink-black/40 bg-transparent border-transparent'
              }`}
              title={`${category || '未分类'}${refCategory ? ` | 参考：${refCategory}` : ''}`}
            >
              {char}
            </span>
          );
        })}
      </div>

      {refPattern && suggestionPattern && (
        <div className="flex items-center gap-2 text-xs">
          <div className="font-mono text-ink-black/40">
            <span className="text-ink-black/30">参</span> {refPattern}
          </div>
          <div className="text-ink-black/20">→</div>
          <div className="font-mono text-ink-black/40">
            <span className="text-ink-black/30">对</span> {suggestionPattern}
          </div>
          {refPattern && suggestionPattern && refPattern.length === suggestionPattern.length && (
            <span className="text-xs">
              {refPattern.split('').every((c, i) => c === '平' ? suggestionPattern[i] === '仄' : c === '仄' ? suggestionPattern[i] === '平' : true)
                ? '✅ 平仄相对'
                : '⚠️ 平仄不完全相对'}
            </span>
          )}
        </div>
      )}

      <div className="text-xs text-ink-black/50 leading-relaxed">
        {explanation}
      </div>
    </div>
  );
}
