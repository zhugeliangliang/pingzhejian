import { describe, it, expect } from 'vitest';
import {
  analyzeChar,
  analyzeLine,
  analyzePoem,
  matchPattern,
  getPatternString,
  checkRhyme,
  resolvePolyphonicChar,
} from '../utils/pingze-detector';
import { PINGZE_DICT } from '../utils/pingze-dictionary';
import { RHYME_GROUPS, findRhymeGroup, checkSameRhyme } from '../utils/rhyme-dictionary';

describe('平仄字典', () => {
  it('应该包含至少500个字符', () => {
    expect(PINGZE_DICT.size).toBeGreaterThanOrEqual(500);
  });

  it('平声字符应正确标记', () => {
    const pingChars = ['天', '山', '风', '花', '云', '心', '春', '江', '明', '光'];
    pingChars.forEach(char => {
      const info = PINGZE_DICT.get(char);
      expect(info?.pingze).toBe('平');
    });
  });

  it('仄声字符应正确标记', () => {
    const zeChars = ['月', '水', '雪', '雨', '梦', '路', '树', '酒', '海', '远'];
    zeChars.forEach(char => {
      const info = PINGZE_DICT.get(char);
      expect(info?.pingze).toBe('仄');
    });
  });

  it('多音字应有variants信息', () => {
    const polyChars = ['长', '空', '看', '重', '难', '为'];
    polyChars.forEach(char => {
      const info = PINGZE_DICT.get(char);
      expect(info?.variants).toBeDefined();
      expect(info?.variants?.length).toBeGreaterThan(0);
    });
  });
});

describe('字符分析', () => {
  it('应正确识别平声字符', () => {
    const result = analyzeChar('天');
    expect(result?.pingze).toBe('平');
    expect(result?.pinyin).toBe('tiān');
  });

  it('应正确识别仄声字符', () => {
    const result = analyzeChar('月');
    expect(result?.pingze).toBe('仄');
    expect(result?.pinyin).toBe('yuè');
  });

  it('应识别标点符号', () => {
    const result = analyzeChar('。');
    expect(result?.pingze).toBe('标点');
  });

  it('未知字符应返回未知', () => {
    const result = analyzeChar('😀');
    expect(result?.pingze).toBe('未知');
  });

  it('应包含拼音信息', () => {
    const result = analyzeChar('山');
    expect(result?.pinyin).toBeDefined();
  });
});

describe('行分析', () => {
  it('应分析整行诗的平仄', () => {
    const line = '床前明月光';
    const result = analyzeLine(line);
    expect(result.length).toBe(5);
    expect(result[0].pingze).toBe('平');
    expect(result[1].pingze).toBe('仄');
    expect(result[2].pingze).toBe('平');
    expect(result[3].pingze).toBe('仄');
    expect(result[4].pingze).toBe('平');
  });

  it('应跳过空格和换行', () => {
    const line = '床 前\n明 月 光';
    const result = analyzeLine(line);
    expect(result.length).toBe(5);
  });

  it('应正确处理标点符号', () => {
    const line = '床前明月光，';
    const result = analyzeLine(line);
    expect(result[result.length - 1].pingze).toBe('标点');
  });
});

describe('诗分析', () => {
  it('应分析多行诗', () => {
    const poem = ['床前明月光', '疑是地上霜', '举头望明月', '低头思故乡'];
    const result = analyzePoem(poem);
    expect(result.lines.length).toBe(4);
    result.lines.forEach(line => {
      expect(line.chars.length).toBeGreaterThan(0);
    });
  });

  it('应生成正确的平仄模式字符串', () => {
    const line = '床前明月光';
    const pattern = getPatternString(line);
    expect(pattern).toContain('平');
    expect(pattern).toContain('仄');
  });
});

describe('模式匹配', () => {
  it('应匹配正确的平仄模式', () => {
    const lines = ['床前明月光'];
    const pattern = '平平平仄平';
    const result = matchPattern(lines, pattern);
    expect(result.isMatch).toBe(true);
    expect(result.errors.length).toBe(0);
  });

  it('应检测不匹配的平仄模式', () => {
    const lines = ['床前明月光'];
    const pattern = '仄仄仄平平';
    const result = matchPattern(lines, pattern);
    expect(result.isMatch).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('应报告具体的错误位置', () => {
    const lines = ['床前明月光'];
    const pattern = '仄仄仄平平';
    const result = matchPattern(lines, pattern);
    if (!result.isMatch) {
      expect(result.errors[0]).toHaveProperty('line');
      expect(result.errors[0]).toHaveProperty('char');
      expect(result.errors[0]).toHaveProperty('expected');
      expect(result.errors[0]).toHaveProperty('actual');
    }
  });
});

describe('押韵检测', () => {
  it('应检测同韵脚的字', () => {
    expect(checkSameRhyme('东', '同')).toBe(true);
    expect(checkSameRhyme('天', '边')).toBe(true);
  });

  it('应检测不同韵脚的字', () => {
    expect(checkSameRhyme('东', '天')).toBe(false);
    expect(checkSameRhyme('花', '月')).toBe(false);
  });

  it('应分析诗的押韵', () => {
    const poem = ['床前明月光', '疑是地上霜', '举头望明月', '低头思故乡'];
    const result = checkRhyme(poem);
    expect(result.rhymeGroups.length).toBeGreaterThan(0);
  });

  it('应找到韵部', () => {
    const group = findRhymeGroup('东');
    expect(group).toBeDefined();
    expect(group?.name).toBe('一东');
    expect(group?.category).toBe('上平');
  });
});

describe('多音字解析', () => {
  it('应根据上下文解析多音字', () => {
    const result1 = resolvePolyphonicChar('长', '长风破浪会有时');
    expect(result1.pingze).toBe('平');
    expect(result1.pinyin).toBe('cháng');

    const result2 = resolvePolyphonicChar('长', '长大有出息');
    expect(result2.pingze).toBe('仄');
    expect(result2.pinyin).toBe('zhǎng');
  });

  it('应处理无规则的多音字', () => {
    const result = resolvePolyphonicChar('看', '看山不是山');
    expect(result).toBeDefined();
    expect(result.pingze).toBeDefined();
    expect(result.pinyin).toBeDefined();
  });
});

describe('韵部字典', () => {
  it('应包含所有30个韵部', () => {
    expect(RHYME_GROUPS.length).toBe(30);
  });

  it('应正确分类上平和下平', () => {
    const shangping = RHYME_GROUPS.filter(g => g.category === '上平');
    const xiaping = RHYME_GROUPS.filter(g => g.category === '下平');
    expect(shangping.length).toBe(15);
    expect(xiaping.length).toBe(15);
  });

  it('每个韵部应有代表字符', () => {
    RHYME_GROUPS.forEach(group => {
      expect(group.characters.size).toBeGreaterThan(0);
    });
  });

  it('应能查找字符所属韵部', () => {
    const group = findRhymeGroup('风');
    expect(group).toBeDefined();
    expect(group?.category).toBe('上平');
  });
});

describe('性能测试', () => {
  it('应在500ms内分析典型诗歌', () => {
    const poem = [
      '床前明月光',
      '疑是地上霜',
      '举头望明月',
      '低头思故乡',
      '白日依山尽',
      '黄河入海流',
      '欲穷千里目',
      '更上一层楼',
    ];

    const start = performance.now();
    for (let i = 0; i < 100; i++) {
      analyzePoem(poem);
    }
    const elapsed = performance.now() - start;

    expect(elapsed).toBeLessThan(500);
  });
});
