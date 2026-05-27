import { RHYME_GROUPS, findRhymeGroup, type RhymeGroup } from './rhyme-dictionary';
import { analyzeChar } from './pingze-detector';

export interface RhymeCharSuggestion {
  char: string;
  rhymeGroup: string;
  pingze: '平' | '仄';
  frequency: '常见' | '较常见' | '少见';
}

const COMMON_CHARS = new Set(
  '风花雪月山水云天心春秋明光清香长深高寒烟霜星河湖池波涛流舟帆'.split('')
);

const LESS_COMMON_CHARS = new Set(
  '砻峒螽讧冻忡酆恫懵倥艨邛筇蛩供喁饔跫悰凇痈豇腔幢桩咙哝逄'.split('')
);

function getFrequency(char: string): '常见' | '较常见' | '少见' {
  if (COMMON_CHARS.has(char)) return '常见';
  if (LESS_COMMON_CHARS.has(char)) return '少见';
  return '较常见';
}

export function suggestRhymeChars(rhymeGroup: string, pingze: '平' | '仄'): string[] {
  const group = RHYME_GROUPS.find((g) => g.name === rhymeGroup);
  if (!group) return [];

  const chars: string[] = [];
  for (const char of group.characters) {
    const analysis = analyzeChar(char);
    if (analysis && (analysis.pingze === pingze || analysis.pingze === '未知')) {
      chars.push(char);
    }
  }

  chars.sort((a, b) => {
    const freqA = getFrequency(a);
    const freqB = getFrequency(b);
    const order = { '常见': 0, '较常见': 1, '少见': 2 };
    return order[freqA] - order[freqB];
  });

  return chars;
}

export function findRhymeCandidates(char: string, count: number = 10): string[] {
  const group = findRhymeGroup(char);
  if (!group) return [];

  const chars: string[] = [];
  for (const c of group.characters) {
    if (c !== char) {
      chars.push(c);
    }
  }

  chars.sort((a, b) => {
    const freqA = getFrequency(a);
    const freqB = getFrequency(b);
    const order = { '常见': 0, '较常见': 1, '少见': 2 };
    return order[freqA] - order[freqB];
  });

  return chars.slice(0, count);
}

export function getLastChar(line: string): string {
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

export function getRhymeGroupForLine(line: string): RhymeGroup | null {
  const lastChar = getLastChar(line);
  if (!lastChar) return null;
  return findRhymeGroup(lastChar);
}

export function getLastCharPingze(line: string): '平' | '仄' | '未知' {
  const lastChar = getLastChar(line);
  if (!lastChar) return '未知';
  const analysis = analyzeChar(lastChar);
  return analysis?.pingze === '平' || analysis?.pingze === '仄'
    ? analysis.pingze
    : '未知';
}
