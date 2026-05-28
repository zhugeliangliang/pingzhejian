import { RhymeSuggestion } from './RhymeSuggestion';
import { ParallelismSuggestion } from './ParallelismSuggestion';
import type { RhymeSuggestionItem, ParallelismSuggestionItem, MoodSuggestionItem, SuggestionType } from '../../hooks/useSuggestions';
import { getPatternString } from '../../utils/pingze-detector';

interface SuggestionPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentLine: string;
  lines: string[];
  lineIndex: number;
  rhymeSuggestions: RhymeSuggestionItem[];
  parallelismSuggestions: ParallelismSuggestionItem[];
  moodSuggestions: MoodSuggestionItem[];
  activeTab: SuggestionType;
  onTabChange: (tab: SuggestionType) => void;
  onInsert: (suggestion: string) => void;
  currentRhymeGroup: string | null;
  currentLinePingze: string | null;
}

const TABS: { key: SuggestionType; label: string; icon: string }[] = [
  { key: 'rhyme', label: '韵脚', icon: '韵' },
  { key: 'parallelism', label: '对仗', icon: '对' },
  { key: 'mood', label: '意境', icon: '境' },
];

export function SuggestionPanel({
  isOpen,
  onClose,
  currentLine,
  lines,
  lineIndex,
  rhymeSuggestions,
  parallelismSuggestions,
  moodSuggestions,
  activeTab,
  onTabChange,
  onInsert,
  currentRhymeGroup,
  currentLinePingze,
}: SuggestionPanelProps) {
  const patternString = currentLine ? getPatternString(currentLine) : '';

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}
      <div
        className={`fixed top-0 right-0 h-full bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out
          w-full sm:w-[28rem] md:w-96
          ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-5 py-4 border-b border-ink-black/10">
            <h2 className="text-lg font-semibold text-ink-black tracking-wider">AI 建议</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-sm hover:bg-ink-black/5 text-ink-black/60 hover:text-ink-black transition-colors"
              aria-label="关闭建议面板"
            >
              ✕
            </button>
          </div>

          <div className="flex border-b border-ink-black/10">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => onTabChange(tab.key)}
                className={`flex-1 py-3 text-sm tracking-wider transition-colors duration-200 ${
                  activeTab === tab.key
                    ? 'text-cinnabar border-b-2 border-cinnabar bg-cinnabar/5 font-medium'
                    : 'text-ink-black/50 hover:text-ink-black/80 hover:bg-ink-black/5'
                }`}
              >
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-sm bg-ink-black/10 text-xs flex items-center justify-center text-ink-black/60">
                    {tab.icon}
                  </span>
                  {tab.label}
                </span>
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {currentLine && (
              <div className="bg-ink-black/5 rounded-sm p-4 space-y-2">
                <div className="text-xs text-ink-black/50 tracking-wider">当前句</div>
                <div className="text-lg text-ink-black tracking-widest font-medium">
                  {currentLine || '—'}
                </div>
                <div className="flex items-center gap-3 text-xs text-ink-black/40">
                  {currentRhymeGroup && (
                    <span>韵部：{currentRhymeGroup}</span>
                  )}
                  {currentLinePingze && (
                    <span>句脚：{currentLinePingze}声</span>
                  )}
                  {patternString && (
                    <span className="font-mono">平仄：{patternString}</span>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'rhyme' && (
              <RhymeSuggestion
                currentLine={currentLine}
                rhymeSuggestions={rhymeSuggestions}
                currentRhymeGroup={currentRhymeGroup}
                onInsert={onInsert}
              />
            )}

            {activeTab === 'parallelism' && (
              <ParallelismSuggestion
                referenceLine={lines[lineIndex - 1] || currentLine}
                suggestions={parallelismSuggestions}
                onInsert={onInsert}
              />
            )}

            {activeTab === 'mood' && (
              <MoodSuggestionList
                suggestions={moodSuggestions}
                onInsert={onInsert}
              />
            )}
          </div>

          <div className="px-5 py-3 border-t border-ink-black/10 text-xs text-ink-black/40 tracking-wider text-center">
            点击建议可插入到当前句
          </div>
        </div>
      </div>
    </>
  );
}

interface MoodSuggestionListProps {
  suggestions: MoodSuggestionItem[];
  onInsert: (suggestion: string) => void;
}

function MoodSuggestionList({ suggestions, onInsert }: MoodSuggestionListProps) {
  const grouped = suggestions.reduce<Record<string, MoodSuggestionItem[]>>((acc, item) => {
    if (!acc[item.mood]) acc[item.mood] = [];
    acc[item.mood].push(item);
    return acc;
  }, {});

  if (suggestions.length === 0) {
    return (
      <div className="text-center py-8 text-ink-black/40 text-sm tracking-wider">
        暂无意境建议
      </div>
    );
  }

  const moodEmojis: Record<string, string> = {
    '豪放': '🏔️',
    '婉约': '🌸',
    '思乡': '🌙',
    '怀古': '🏛️',
    '山水': '🏞️',
    '离别': '🍂',
  };

  return (
    <div className="space-y-4">
      {Object.entries(grouped).map(([mood, items]) => (
        <div key={mood} className="space-y-2">
          <h4 className="text-sm font-medium text-ink-black/70 tracking-wider">
            {moodEmojis[mood] || '✨'} {mood}
          </h4>
          <div className="flex flex-wrap gap-2">
            {items.map((item) => (
              <button
                key={item.word}
                onClick={() => onInsert(item.word)}
                className="group relative px-3 py-1.5 rounded-sm border border-ink-black/15 bg-white hover:border-cinnabar hover:bg-cinnabar/5 text-ink-black/80 hover:text-cinnabar transition-all duration-200 text-sm tracking-wider"
                title={`平仄：${item.pingze} | 意境：${item.mood}`}
              >
                {item.word}
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-ink-black/80 text-white text-xs px-2 py-0.5 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {item.pingze} · {item.mood}
                </span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
