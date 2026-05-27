import { useState, useCallback } from 'react';
import {
  suggestRhymeChars,
  findRhymeCandidates,
  getLastChar,
  getRhymeGroupForLine,
  getLastCharPingze,
} from '../utils/rhyme-suggester';
import { suggestParallelLine } from '../utils/parallelism-suggester';
import type { TemplateData } from '../data/templates';

export type SuggestionType = 'rhyme' | 'parallelism' | 'mood';

export interface RhymeSuggestionItem {
  char: string;
  rhymeGroup: string;
  pingze: '平' | '仄' | '未知';
  frequency: '常见' | '较常见' | '少见';
}

export interface ParallelismSuggestionItem {
  suggestion: string;
  explanation: string;
}

export interface MoodSuggestionItem {
  word: string;
  mood: string;
  pingze: string;
}

export interface SuggestionState {
  rhymeSuggestions: RhymeSuggestionItem[];
  parallelismSuggestions: ParallelismSuggestionItem[];
  moodSuggestions: MoodSuggestionItem[];
  isLoading: boolean;
}

export interface UseSuggestionsReturn {
  state: SuggestionState;
  activeTab: SuggestionType;
  setActiveTab: (tab: SuggestionType) => void;
  currentRhymeGroup: string | null;
  currentLinePingze: string | null;
  insertSuggestion: (
    lines: string[],
    lineIndex: number,
    suggestion: string
  ) => string[];
  refreshSuggestions: (
    lines: string[],
    lineIndex: number,
    template?: TemplateData | null
  ) => void;
}

const MOOD_WORDS: Record<string, { words: string[]; pingze: string }[]> = {
  '豪放': [
    { words: ['长风', '大江', '万里', '千秋', '铁马', '金戈'], pingze: '平平/仄平/仄仄/平平/仄仄/平平' },
  ],
  '婉约': [
    { words: ['细雨', '落花', '轻风', '微雨', '残月', '疏影'], pingze: '仄仄/仄平/平平/平仄/平仄/平仄' },
  ],
  '思乡': [
    { words: ['归雁', '故园', '乡愁', '天涯', '明月', '秋风'], pingze: '平仄/仄平/平平/平平/平仄/平平' },
  ],
  '怀古': [
    { words: ['千古', '旧时', '残阳', '故国', '荒城', '断碑'], pingze: '平仄/仄平/平平/仄仄/平平/仄平' },
  ],
  '山水': [
    { words: ['青山', '绿水', '白云', '清泉', '翠微', '苍苔'], pingze: '平平/仄仄/仄平/平平/仄平/平平' },
  ],
  '离别': [
    { words: ['长亭', '归舟', '别酒', '离歌', '远行', '孤帆'], pingze: '平平/平平/仄仄/平平/仄平/平平' },
  ],
};

export function useSuggestions(): UseSuggestionsReturn {
  const [state, setState] = useState<SuggestionState>({
    rhymeSuggestions: [],
    parallelismSuggestions: [],
    moodSuggestions: [],
    isLoading: false,
  });
  const [activeTab, setActiveTab] = useState<SuggestionType>('rhyme');

  const [currentRhymeGroup, setCurrentRhymeGroup] = useState<string | null>(null);
  const [currentLinePingze, setCurrentLinePingze] = useState<string | null>(null);

  const refreshSuggestions = useCallback(
    (lines: string[], lineIndex: number, template?: TemplateData | null) => {
      if (lineIndex < 0 || lineIndex >= lines.length) return;

      const currentLine = lines[lineIndex] || '';
      setState((prev) => ({ ...prev, isLoading: true }));

      const lastChar = getLastChar(currentLine);
      const rhymeGroup = getRhymeGroupForLine(currentLine);
      const pingze = getLastCharPingze(currentLine);

      setCurrentRhymeGroup(rhymeGroup?.name || null);
      setCurrentLinePingze(pingze === '平' || pingze === '仄' ? pingze : null);

      let rhymeSuggestions: RhymeSuggestionItem[] = [];
      if (rhymeGroup) {
        const requiredPingze = pingze === '平' || pingze === '仄' ? pingze : '平';
        const chars = suggestRhymeChars(rhymeGroup.name, requiredPingze);
        rhymeSuggestions = chars.slice(0, 20).map((char) => ({
          char,
          rhymeGroup: rhymeGroup.name,
          pingze: requiredPingze,
          frequency: _estimateFrequency(char),
        }));
      } else if (lastChar) {
        const candidates = findRhymeCandidates(lastChar, 15);
        const rhymeName = getRhymeGroupForLine(currentLine)?.name || '未知';
        rhymeSuggestions = candidates.map((char) => ({
          char,
          rhymeGroup: rhymeName,
          pingze: pingze === '平' || pingze === '仄' ? pingze : '平',
          frequency: _estimateFrequency(char),
        }));
      }

      const parallelismSuggestions: ParallelismSuggestionItem[] = [];
      if (template && template.type === '诗体' && lines.length >= 4) {
        const refLineIndex = lineIndex % 2 === 0 ? lineIndex - 1 : lineIndex + 1;
        if (refLineIndex >= 0 && refLineIndex < lines.length && lines[refLineIndex]) {
          const suggestions = suggestParallelLine(lines[refLineIndex]);
          parallelismSuggestions.push(...suggestions.map((s) => ({
            suggestion: s.suggestion,
            explanation: s.explanation,
          })));
        }
      }

      if (currentLine) {
        const suggestions = suggestParallelLine(currentLine);
        if (parallelismSuggestions.length === 0) {
          parallelismSuggestions.push(...suggestions.map((s) => ({
            suggestion: s.suggestion,
            explanation: s.explanation,
          })));
        }
      }

      const allMoodWords: MoodSuggestionItem[] = [];
      for (const [mood, entries] of Object.entries(MOOD_WORDS)) {
        for (const entry of entries) {
          const pingzeList = entry.pingze.split('/');
          entry.words.forEach((word, idx) => {
            allMoodWords.push({
              word,
              mood,
              pingze: pingzeList[idx] || '',
            });
          });
        }
      }

      setState({
        rhymeSuggestions,
        parallelismSuggestions: parallelismSuggestions.slice(0, 10),
        moodSuggestions: allMoodWords.slice(0, 20),
        isLoading: false,
      });
    },
    []
  );

  const insertSuggestion = useCallback(
    (lines: string[], lineIndex: number, suggestion: string): string[] => {
      const newLines = [...lines];
      const currentLine = newLines[lineIndex] || '';

      const lastChar = getLastChar(currentLine);
      if (lastChar && currentLine.endsWith(lastChar)) {
        newLines[lineIndex] = currentLine.slice(0, -lastChar.length) + suggestion;
      } else {
        newLines[lineIndex] = currentLine + suggestion;
      }

      return newLines;
    },
    []
  );

  return {
    state,
    activeTab,
    setActiveTab,
    currentRhymeGroup,
    currentLinePingze,
    insertSuggestion,
    refreshSuggestions,
  };
}

function _estimateFrequency(char: string): '常见' | '较常见' | '少见' {
  const common = new Set(
    '风花雪月山水云天心春秋明光清香长深高寒烟霜星河湖池波涛流舟帆'.split('')
  );
  const rare = new Set(
    '砻峒螽讧冻忡酆恫懵倥艨邛筇蛩供喁饔跫悰凇痈豇腔幢桩咙哝逄'.split('')
  );
  if (common.has(char)) return '常见';
  if (rare.has(char)) return '少见';
  return '较常见';
}
