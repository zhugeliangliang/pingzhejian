import { findRhymeGroup } from './rhyme-dictionary';
import { PINGZE_DICT } from './pingze-dictionary';

export interface CharAnalysis {
  char: string;
  pingze: '平' | '仄' | '未知' | '标点';
  pinyin?: string;
}

export interface LineAnalysis {
  chars: CharAnalysis[];
}

export interface PoemAnalysis {
  lines: LineAnalysis[];
}

export interface PatternMatchResult {
  isMatch: boolean;
  errors: { line: number; charIndex: number; char: string; expected: '平' | '仄'; actual: '平' | '仄' | '未知' }[];
}

export interface RhymeAnalysisResult {
  rhymeGroups: string[][];
  unrhymedLines: number[];
}

const PUNCTUATION = new Set(['，', '。', '！', '？', '；', '：', '、', '「', '」', '『', '』', '（', '）', '【', '】', '《', '》', '"', "'", '(', ')', '[', ']', '{', '}', '—', '…', '·']);

const POLYPHONIC_CONTEXT_RULES: Record<string, { pattern: RegExp; pingze: '平' | '仄'; pinyin: string }[]> = {
  '长': [{ pattern: /长[风沙]/, pingze: '平', pinyin: 'cháng' }, { pattern: /长[大老]/, pingze: '仄', pinyin: 'zhǎng' }],
  '空': [{ pattern: /空[山天云层]/, pingze: '平', pinyin: 'kōng' }, { pattern: /空[闲白]/, pingze: '仄', pinyin: 'kòng' }],
  '看': [{ pattern: /看[守门]/, pingze: '平', pinyin: 'kān' }, { pattern: /看[见望到]/, pingze: '仄', pinyin: 'kàn' }],
  '行': [{ pattern: /[独自漫]行/, pingze: '平', pinyin: 'xíng' }],
  '重': [{ pattern: /重[复山层]/, pingze: '平', pinyin: 'chóng' }, { pattern: /重[量要]/, pingze: '仄', pinyin: 'zhòng' }],
  '难': [{ pattern: /难[关忘度]/, pingze: '平', pinyin: 'nán' }, { pattern: /难[民难]/, pingze: '仄', pinyin: 'nàn' }],
  '为': [{ pattern: /[因以认]为/, pingze: '仄', pinyin: 'wèi' }],
  '兴': [{ pattern: /[乘夙夙]兴/, pingze: '平', pinyin: 'xīng' }, { pattern: /兴[致趣]/, pingze: '仄', pinyin: 'xìng' }],
  '相': [{ pattern: /相[思逢逢信]/, pingze: '平', pinyin: 'xiāng' }, { pattern: /相[国爷]/, pingze: '仄', pinyin: 'xiàng' }],
  '和': [{ pattern: /和[平风平]/, pingze: '平', pinyin: 'hé' }, { pattern: /和[诗唱]/, pingze: '仄', pinyin: 'hè' }],
  '分': [{ pattern: /分[明开]/, pingze: '平', pinyin: 'fēn' }, { pattern: /名[分]/, pingze: '仄', pinyin: 'fèn' }],
  '当': [{ pattern: /当[时年春]/, pingze: '平', pinyin: 'dāng' }, { pattern: /当[作恰]/, pingze: '仄', pinyin: 'dàng' }],
  '应': [{ pattern: /应[该当如]/, pingze: '平', pinyin: 'yīng' }, { pattern: /应[答和]/, pingze: '仄', pinyin: 'yìng' }],
  '藏': [{ pattern: /[隐潜]藏/, pingze: '平', pinyin: 'cáng' }, { pattern: /宝[藏]/, pingze: '仄', pinyin: 'zàng' }],
  '将': [{ pattern: /将[来军帅]/, pingze: '平', pinyin: 'jiāng' }, { pattern: /[大主]将/, pingze: '仄', pinyin: 'jiàng' }],
  '朝': [{ pattern: /朝[阳夕露暮]/, pingze: '平', pinyin: 'zhāo' }, { pattern: /[唐王]朝/, pingze: '平', pinyin: 'cháo' }],
  '更': [{ pattern: /[三初五]更/, pingze: '平', pinyin: 'gēng' }, { pattern: /更[加好]/, pingze: '仄', pinyin: 'gèng' }],
  '中': [{ pattern: /山[中]$/, pingze: '平', pinyin: 'zhōng' }],
  '斜': [{ pattern: /斜[阳晖晖]/, pingze: '平', pinyin: 'xiá' }],
};

export function analyzeChar(char: string): CharAnalysis | null {
  if (PUNCTUATION.has(char)) {
    return { char, pingze: '标点' };
  }

  const info = PINGZE_DICT.get(char);
  if (info) {
    return { char, pingze: info.pingze, pinyin: info.pinyin };
  }

  return { char, pingze: '未知' };
}

export function analyzeLine(line: string): CharAnalysis[] {
  const chars: CharAnalysis[] = [];
  for (const char of line) {
    if (char === ' ' || char === '\t' || char === '\n' || char === '\r') continue;
    const analysis = analyzeChar(char);
    if (analysis) {
      chars.push(analysis);
    }
  }
  return chars;
}

export function analyzePoem(lines: string[]): PoemAnalysis {
  return {
    lines: lines.map(line => ({ chars: analyzeLine(line) })),
  };
}

export function matchPattern(lines: string[], pattern: string): PatternMatchResult {
  const errors: PatternMatchResult['errors'] = [];
  const patternLines = pattern.split(/[,，。.!！?\n]+/).filter(l => l.trim().length > 0);

  for (let i = 0; i < Math.min(lines.length, patternLines.length); i++) {
    const lineAnalysis = analyzeLine(lines[i]);
    const patternChars = patternLines[i].trim();

    for (let j = 0; j < Math.min(lineAnalysis.length, patternChars.length); j++) {
      const expected = patternChars[j];
      const actual = lineAnalysis[j];

      if (expected === '平' || expected === '仄') {
        if (actual.pingze !== expected && actual.pingze !== '标点') {
          errors.push({
            line: i,
            charIndex: j,
            char: actual.char,
            expected: expected as '平' | '仄',
            actual: actual.pingze as '平' | '仄' | '未知',
          });
        }
      }
    }
  }

  return { isMatch: errors.length === 0, errors };
}

export function getPatternString(line: string): string {
  const analysis = analyzeLine(line);
  return analysis.map(c => {
    if (c.pingze === '标点') return '';
    return c.pingze === '未知' ? '?' : c.pingze;
  }).join('');
}

export function checkRhyme(lines: string[]): RhymeAnalysisResult {
  const lastChars = lines
    .map(line => {
      const analysis = analyzeLine(line);
      const nonPunct = analysis.filter(c => c.pingze !== '标点');
      return nonPunct.length > 0 ? nonPunct[nonPunct.length - 1].char : '';
    })
    .filter(c => c.length > 0);

  const rhymeGroups: string[][] = [];
  const assignedLines = new Set<number>();
  const unrhymedLines: number[] = [];

  for (let i = 0; i < lastChars.length; i++) {
    if (assignedLines.has(i)) continue;

    const char1 = lastChars[i];
    const group = [char1];
    assignedLines.add(i);

    for (let j = i + 1; j < lastChars.length; j++) {
      if (assignedLines.has(j)) continue;
      const char2 = lastChars[j];

      const isRhyme = _checkRhymeSimple(char1, char2);
      if (isRhyme) {
        group.push(char2);
        assignedLines.add(j);
      }
    }

    if (group.length > 1) {
      rhymeGroups.push(group);
    } else {
      unrhymedLines.push(i);
    }
  }

  return { rhymeGroups, unrhymedLines };
}

function _checkRhymeSimple(char1: string, char2: string): boolean {
  const g1 = findRhymeGroup(char1);
  const g2 = findRhymeGroup(char2);

  if (g1 && g2) {
    return g1.name === g2.name;
  }

  if (!g1 || !g2) {
    const f1 = _getFinal(char1);
    const f2 = _getFinal(char2);
    if (f1 && f2) {
      return f1 === f2;
    }
  }

  return false;
}

function _getFinal(char: string): string | null {
  const info = PINGZE_DICT.get(char);
  if (!info?.pinyin) return null;
  const pinyin = info.pinyin.toLowerCase().replace(/[āáǎà]/g, 'a').replace(/[ēéěè]/g, 'e').replace(/[īíǐì]/g, 'i').replace(/[ōóǒò]/g, 'o').replace(/[ūúǔù]/g, 'u').replace(/[ǖǘǚǜ]/g, 'v');
  const match = pinyin.match(/([aeiou]+n?g?)$/);
  return match ? match[1] : null;
}

export function resolvePolyphonicChar(char: string, context: string): { pingze: '平' | '仄'; pinyin: string } {
  const info = PINGZE_DICT.get(char);
  if (!info?.variants || info.variants.length === 0) {
    return { pingze: info?.pingze || '平', pinyin: info?.pinyin || '' };
  }

  const rules = POLYPHONIC_CONTEXT_RULES[char];
  if (rules) {
    for (const rule of rules) {
      if (rule.pattern.test(context)) {
        return { pingze: rule.pingze, pinyin: rule.pinyin };
      }
    }
  }

  return { pingze: info.variants[0].pingze, pinyin: info.variants[0].pinyin };
}
