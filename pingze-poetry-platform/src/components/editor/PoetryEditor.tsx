import { useState, useCallback, useEffect, useRef } from 'react';
import type { TemplateData } from '../../data/templates';
import { usePingzeAnalysis } from '../../hooks/usePingzeAnalysis';
import { useSuggestions, type SuggestionType } from '../../hooks/useSuggestions';
import { SuggestionPanel } from '../ai/SuggestionPanel';
import PingzeDisplay from './PingzeDisplay';

interface PoetryEditorProps {
  template: TemplateData | null;
  onSave: (data: { title: string; lines: string[]; template: TemplateData | null }) => void;
  initialData?: { title: string; lines: string[] };
  onAddLine?: () => void;
  onRemoveLine?: (index: number) => void;
  className?: string;
}

export default function PoetryEditor({
  template,
  onSave,
  initialData,
  onAddLine,
  onRemoveLine,
  className = '',
}: PoetryEditorProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [lines, setLines] = useState<string[]>(initialData?.lines || (template ? Array(template.lineCount).fill('') : ['']));
  const titleRef = useRef<HTMLInputElement>(null);
  const lineRefs = useRef<(HTMLTextAreaElement | null)[]>([]);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [suggestionLineIndex, setSuggestionLineIndex] = useState(-1);
  const [suggestionOpen, setSuggestionOpen] = useState(false);

  const {
    state: suggestionState,
    activeTab,
    setActiveTab,
    currentRhymeGroup,
    currentLinePingze,
    insertSuggestion,
    refreshSuggestions,
  } = useSuggestions();

  const templatePattern = template ? template.pingzePattern.join('\n') : '';
  const { analysis, rhymeAnalysis, errors, isMatch } = usePingzeAnalysis(lines, template ? templatePattern : '');

  const rhymeLineIndices = new Set<number>();
  if (rhymeAnalysis) {
    for (const group of rhymeAnalysis.rhymeGroups) {
      const chars = lines.map((line, i) => {
        const last = line.trim().slice(-1);
        return group.includes(last) ? i : -1;
      });
      chars.forEach((i) => {
        if (i >= 0) rhymeLineIndices.add(i);
      });
    }
  }

  useEffect(() => {
    if (!hasInteracted && initialData?.title) {
      setTitle(initialData.title);
      setLines(initialData.lines || (template ? Array(template.lineCount).fill('') : ['']));
    }
  }, [initialData, template, hasInteracted]);

  useEffect(() => {
    if (template && !hasInteracted) {
      setLines(Array(template.lineCount).fill(''));
    }
  }, [template, hasInteracted]);

  const handleLineChange = useCallback(
    (index: number, value: string) => {
      setHasInteracted(true);
      setLines((prev) => {
        const next = [...prev];
        next[index] = value;
        return next;
      });
    },
    []
  );

  const handleAddLine = useCallback(() => {
    setHasInteracted(true);
    setLines((prev) => [...prev, '']);
    onAddLine?.();
  }, [onAddLine]);

  const handleRemoveLine = useCallback(
    (index: number) => {
      setHasInteracted(true);
      setLines((prev) => prev.filter((_, i) => i !== index));
      onRemoveLine?.(index);
    },
    [onRemoveLine]
  );

  const handleOpenSuggestions = useCallback(
    (index: number) => {
      setSuggestionLineIndex(index);
      setSuggestionOpen(true);
      refreshSuggestions(lines, index, template);
    },
    [lines, template, refreshSuggestions]
  );

  const handleInsertSuggestion = useCallback(
    (suggestion: string) => {
      if (suggestionLineIndex < 0) return;
      const newLines = insertSuggestion(lines, suggestionLineIndex, suggestion);
      setLines(newLines);
    },
    [lines, suggestionLineIndex, insertSuggestion]
  );

  const handleSuggestionTabChange = useCallback(
    (tab: SuggestionType) => {
      setActiveTab(tab);
    },
    [setActiveTab]
  );

  const currentLineForSuggestion = suggestionLineIndex >= 0 ? lines[suggestionLineIndex] || '' : '';

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        onSave({ title, lines, template });
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleAddLine();
      }
    },
    [title, lines, template, onSave, handleAddLine]
  );

  const patternMatchLine = (lineIndex: number): string | undefined => {
    if (!template) return undefined;
    return template.pingzePattern[lineIndex];
  };

  const countNonPunct = (line: string): number => {
    return line.replace(/[，。.!！？、；：""''（）【】《》\s]/g, '').length;
  };

  return (
    <div className={`w-full ${className}`} onKeyDown={handleKeyDown}>
      <div className="mb-8">
        <input
          ref={titleRef}
          type="text"
          value={title}
          onChange={(e) => {
            setHasInteracted(true);
            setTitle(e.target.value);
          }}
          placeholder="请输入标题"
          className="w-full bg-transparent text-xl sm:text-2xl font-serif text-ink-black placeholder-ink-black/20
                     border-none outline-none tracking-widest text-center py-3"
        />
        {template && (
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="text-xs px-2 py-0.5 border border-cinnabar/30 text-cinnabar rounded-sm bg-cinnabar/5">
              {template.name}
            </span>
            {template.type === '词牌' && (
              <span className="text-xs text-ink-black/40">({template.dynasty})</span>
            )}
          </div>
        )}
        <div className="border-b border-ink-black/10 mt-4 mx-16" />
      </div>

      <div className="space-y-5 max-w-2xl mx-auto px-2 sm:px-4">
        {lines.map((line, index) => {
          const linePattern = patternMatchLine(index);
          const charCount = countNonPunct(line);
          const isRhyme = rhymeLineIndices.has(index);
          const lineErrors = errors.filter((e) => e.line === index);
          const lineHasError = lineErrors.length > 0;
          const lineMatchStatus = lineHasError
            ? 'error'
            : linePattern && charCount > 0
              ? isMatch
                ? 'match'
                : 'partial'
              : 'none';

          return (
            <div key={index} className="group relative">
              <div className="flex items-start gap-3">
                <span className="text-xs text-ink-black/25 w-6 pt-3 text-right tabular-nums shrink-0">
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="relative">
                    <textarea
                      ref={(el) => {
                        lineRefs.current[index] = el;
                      }}
                      value={line}
                      onChange={(e) => handleLineChange(index, e.target.value)}
                      placeholder={`第${index + 1}句`}
                      rows={1}
                      className={`w-full bg-transparent text-base sm:text-lg font-serif text-ink-black placeholder-ink-black/15
                                 border-none outline-none resize-none py-2 leading-loose tracking-widest
                                 transition-colors duration-200
                                 ${lineHasError ? 'text-red-700/90' : ''}`}
                    />
                  </div>

                  <div className="flex items-center gap-2 mt-0.5 min-h-[1.25rem]">
                    <PingzeDisplay
                      lineAnalysis={analysis.lines[index] || null}
                      isRhymeLine={isRhyme && line.trim().length > 0}
                      showErrors={true}
                      errors={errors}
                      lineIndex={index}
                    />

                    <div className="flex items-center gap-1 ml-auto">
                      <button
                        onClick={() => handleOpenSuggestions(index)}
                        className="shrink-0 w-6 h-6 flex items-center justify-center rounded-sm text-ink-black/15 hover:text-cinnabar hover:bg-cinnabar/5 transition-all duration-200 opacity-0 group-hover:opacity-100"
                        title="AI 建议"
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                        </svg>
                      </button>

                      <span className={`text-xs tabular-nums transition-colors duration-200 ${
                        charCount > 0 ? 'text-ink-black/40' : 'text-ink-black/15'
                      }`}>
                        {charCount}
                      </span>

                      {lineMatchStatus === 'match' && (
                        <span className="text-xs text-green-700/60">✓</span>
                      )}
                      {lineMatchStatus === 'error' && (
                        <span className="text-xs text-red-600/70" title={`${lineErrors.length}处平仄不合`}>
                          ✗ {lineErrors.length}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {!template && lines.length > 1 && (
                  <button
                    onClick={() => handleRemoveLine(index)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0
                               p-1 text-ink-black/20 hover:text-cinnabar/80"
                    title="删除此行"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {!template && (
          <button
            onClick={handleAddLine}
            className="w-full py-3 text-sm text-ink-black/30 hover:text-cinnabar/70
                       border border-dashed border-ink-black/15 hover:border-cinnabar/30
                       rounded-sm transition-all duration-200 mt-2"
          >
            + 添加一行
          </button>
        )}
      </div>

      {template && !isMatch && lines.some((l) => l.trim().length > 0) && (
        <div className="max-w-2xl mx-auto px-4 mt-4">
          <div className="flex items-center gap-2 text-xs text-cinnabar/70">
            <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>当前内容与格律有 {errors.length} 处不符</span>
          </div>
        </div>
      )}

      <SuggestionPanel
        isOpen={suggestionOpen}
        onClose={() => setSuggestionOpen(false)}
        currentLine={currentLineForSuggestion}
        lines={lines}
        lineIndex={suggestionLineIndex}
        rhymeSuggestions={suggestionState.rhymeSuggestions}
        parallelismSuggestions={suggestionState.parallelismSuggestions}
        moodSuggestions={suggestionState.moodSuggestions}
        activeTab={activeTab}
        onTabChange={handleSuggestionTabChange}
        onInsert={handleInsertSuggestion}
        currentRhymeGroup={currentRhymeGroup}
        currentLinePingze={currentLinePingze}
      />
    </div>
  );
}
