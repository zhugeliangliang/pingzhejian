import { useMemo } from 'react';
import {
  analyzePoem,
  matchPattern,
  checkRhyme,
  getPatternString,
  resolvePolyphonicChar,
  type PoemAnalysis,
  type PatternMatchResult,
  type RhymeAnalysisResult,
  type CharAnalysis,
} from '../utils/pingze-detector';

interface UsePingzeAnalysisReturn {
  analysis: PoemAnalysis;
  patternMatch: PatternMatchResult | null;
  rhymeAnalysis: RhymeAnalysisResult;
  patternStrings: string[];
  errors: { line: number; charIndex: number; char: string; expected: '平' | '仄'; actual: '平' | '仄' | '未知' }[];
  isMatch: boolean;
  getCharInfo: (lineIndex: number, charIndex: number) => CharAnalysis | undefined;
  getResolvedChar: (lineIndex: number, charIndex: number) => { pingze: '平' | '仄'; pinyin: string } | null;
  analysisTime: number;
}

export function usePingzeAnalysis(lines: string[], pattern?: string): UsePingzeAnalysisReturn {
  const startTime = useMemo(() => performance.now(), []);

  const analysis = useMemo(() => {
    return analyzePoem(lines);
  }, [lines]);

  const patternStrings = useMemo(() => {
    return lines.map(line => getPatternString(line));
  }, [lines]);

  const patternMatch = useMemo(() => {
    if (!pattern || pattern.trim().length === 0) return null;
    return matchPattern(lines, pattern);
  }, [lines, pattern]);

  const rhymeAnalysis = useMemo(() => {
    return checkRhyme(lines);
  }, [lines]);

  const errors = useMemo(() => {
    return patternMatch?.errors || [];
  }, [patternMatch]);

  const isMatch = useMemo(() => {
    return patternMatch?.isMatch ?? true;
  }, [patternMatch]);

  const analysisTime = useMemo(() => {
    return performance.now() - startTime;
  }, [analysis, patternMatch, rhymeAnalysis, startTime]);

  const getCharInfo = useMemo(() => {
    return (lineIndex: number, charIndex: number): CharAnalysis | undefined => {
      if (lineIndex < 0 || lineIndex >= analysis.lines.length) return undefined;
      const line = analysis.lines[lineIndex];
      if (charIndex < 0 || charIndex >= line.chars.length) return undefined;
      return line.chars[charIndex];
    };
  }, [analysis]);

  const getResolvedChar = useMemo(() => {
    return (lineIndex: number, charIndex: number): { pingze: '平' | '仄'; pinyin: string } | null => {
      const info = getCharInfo(lineIndex, charIndex);
      if (!info || info.char.length !== 1) return null;
      const fullLine = lines[lineIndex] || '';
      return resolvePolyphonicChar(info.char, fullLine);
    };
  }, [getCharInfo, lines]);

  return {
    analysis,
    patternMatch,
    rhymeAnalysis,
    patternStrings,
    errors,
    isMatch,
    getCharInfo,
    getResolvedChar,
    analysisTime,
  };
}
