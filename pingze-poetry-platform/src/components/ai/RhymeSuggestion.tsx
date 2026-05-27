import type { RhymeSuggestionItem } from '../../hooks/useSuggestions';
import { analyzeChar } from '../../utils/pingze-detector';

interface RhymeSuggestionProps {
  currentLine: string;
  rhymeSuggestions: RhymeSuggestionItem[];
  currentRhymeGroup: string | null;
  onInsert: (suggestion: string) => void;
}

export function RhymeSuggestion({
  currentLine,
  rhymeSuggestions,
  currentRhymeGroup,
  onInsert,
}: RhymeSuggestionProps) {
  const lastChar = _getLastChar(currentLine);
  const lastCharAnalysis = lastChar ? analyzeChar(lastChar) : null;
  const pingzeColors = {
    '平': 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-100',
    '仄': 'bg-amber-50 text-amber-700 border-amber-200 hover:border-amber-400 hover:bg-amber-100',
    '未知': 'bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-400 hover:bg-gray-100',
  };

  const groupedByPingze = rhymeSuggestions.reduce<{
    平: RhymeSuggestionItem[];
    仄: RhymeSuggestionItem[];
    其他: RhymeSuggestionItem[];
  }>(
    (acc, item) => {
      if (item.pingze === '平') acc.平.push(item);
      else if (item.pingze === '仄') acc.仄.push(item);
      else acc.其他.push(item);
      return acc;
    },
    { 平: [], 仄: [], 其他: [] }
  );

  if (rhymeSuggestions.length === 0) {
    return (
      <div className="space-y-4">
        {lastChar && (
          <div className="text-sm text-ink-black/50">
            结尾字「{lastChar}」未找到对应韵部，建议先确定韵部
          </div>
        )}
        {!lastChar && (
          <div className="text-sm text-ink-black/40">
            输入诗句后将显示韵脚建议
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {lastChar && (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-sm bg-cinnabar/10 flex items-center justify-center text-2xl text-cinnabar font-medium">
            {lastChar}
          </div>
          <div className="space-y-1">
            <div className="text-sm text-ink-black/70">
              韵部：{currentRhymeGroup || '未知'}
            </div>
            <div className="text-xs text-ink-black/40">
              平仄：{lastCharAnalysis?.pingze || '未知'}
              {lastCharAnalysis?.pinyin && ` · 拼音：${lastCharAnalysis.pinyin}`}
            </div>
          </div>
        </div>
      )}

      <div>
        <h4 className="text-sm font-medium text-ink-black/70 mb-3 tracking-wider">
          平声候选（{groupedByPingze.平.length}）
        </h4>
        <div className="flex flex-wrap gap-2">
          {groupedByPingze.平.map((item) => (
            <button
              key={item.char}
              onClick={() => onInsert(item.char)}
              className={`group relative px-3 py-2 rounded-sm border transition-all duration-200 ${
                pingzeColors[item.pingze]
              }`}
              title={`韵部：${item.rhymeGroup} · 频率：${item.frequency}`}
            >
              <span className="text-lg font-medium">{item.char}</span>
              <span className="absolute -top-5 left-1/2 -translate-x-1/2 bg-ink-black/80 text-white text-xs px-2 py-0.5 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {item.rhymeGroup} · {item.frequency}
              </span>
            </button>
          ))}
          {groupedByPingze.平.length === 0 && (
            <div className="text-xs text-ink-black/30 italic">无平声候选</div>
          )}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-ink-black/70 mb-3 tracking-wider">
          仄声候选（{groupedByPingze.仄.length}）
        </h4>
        <div className="flex flex-wrap gap-2">
          {groupedByPingze.仄.map((item) => (
            <button
              key={item.char}
              onClick={() => onInsert(item.char)}
              className={`group relative px-3 py-2 rounded-sm border transition-all duration-200 ${
                pingzeColors[item.pingze]
              }`}
              title={`韵部：${item.rhymeGroup} · 频率：${item.frequency}`}
            >
              <span className="text-lg font-medium">{item.char}</span>
              <span className="absolute -top-5 left-1/2 -translate-x-1/2 bg-ink-black/80 text-white text-xs px-2 py-0.5 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {item.rhymeGroup} · {item.frequency}
              </span>
            </button>
          ))}
          {groupedByPingze.仄.length === 0 && (
            <div className="text-xs text-ink-black/30 italic">无仄声候选</div>
          )}
        </div>
      </div>
    </div>
  );
}

function _getLastChar(line: string): string {
  for (let i = line.length - 1; i >= 0; i--) {
    const ch = line[i];
    if (ch !== ' ' && ch !== '\t' && ch !== '\n') {
      const analysis = analyzeChar(ch);
      if (analysis && analysis.pingze !== '标点') {
        return ch;
      }
    }
  }
  return '';
}
