import { analyzeChar, getPatternString as _gps } from './pingze-detector';

export type WordCategory = '名词' | '动词' | '形容词' | '副词' | '代词' | '介词' | '连词' | null;

export interface ParallelSuggestion {
  suggestion: string;
  explanation: string;
  wordCategories: WordCategory[];
  pingzeMatch: boolean;
}

const CHAR_CATEGORIES: Record<string, WordCategory> = {
  '山': '名词', '水': '名词', '风': '名词', '花': '名词', '云': '名词', '月': '名词',
  '天': '名词', '地': '名词', '日': '名词', '星': '名词', '河': '名词', '湖': '名词',
  '海': '名词', '江': '名词', '松': '名词', '梅': '名词', '竹': '名词', '菊': '名词',
  '柳': '名词', '桃': '名词', '林': '名词', '泉': '名词', '溪': '名词', '峰': '名词',
  '楼': '名词', '台': '名词', '亭': '名词', '舟': '名词', '帆': '名词', '桥': '名词',
  '门': '名词', '窗': '名词', '庭': '名词', '院': '名词', '城': '名词', '关': '名词',
  '春': '名词', '秋': '名词', '夏': '名词', '冬': '名词', '晨': '名词', '暮': '名词',
  '朝': '名词', '夕': '名词', '夜': '名词', '晓': '名词', '霜': '名词', '雪': '名词',
  '雨': '名词', '雷': '名词', '霞': '名词', '烟': '名词', '露': '名词', '雾': '名词',
  '鸟': '名词', '鱼': '名词', '龙': '名词', '鹤': '名词', '燕': '名词', '莺': '名词',
  '琴': '名词', '书': '名词', '诗': '名词', '酒': '名词', '剑': '名词', '灯': '名词',
  '人': '名词', '心': '名词', '梦': '名词', '情': '名词', '愁': '名词', '思': '名词',
  '家': '名词', '乡': '名词', '路': '名词', '年': '名词', '时': '名词', '声': '名词',

  '来': '动词', '去': '动词', '看': '动词', '闻': '动词', '听': '动词', '望': '动词',
  '见': '动词', '行': '动词', '归': '动词', '回': '动词', '飞': '动词', '落': '动词',
  '开': '动词', '闭': '动词', '生': '动词', '灭': '动词', '知': '动词', '问': '动词',
  '吟': '动词', '唱': '动词', '醉': '动词', '眠': '动词', '忆': '动词', '念': '动词',
  '寻': '动词', '登': '动词', '观': '动词', '怀': '动词',
  '送': '动词', '迎': '动词', '别': '动词', '逢': '动词', '聚': '动词', '散': '动词',
  '流': '动词', '浮': '动词', '沉': '动词', '摇': '动词', '飘': '动词', '舞': '动词',
  '穿': '动词', '过': '动词', '入': '动词', '出': '动词', '升': '动词', '降': '动词',
  '映': '动词', '照': '动词', '伴': '动词', '随': '动词', '追': '动词', '引': '动词',

  '高': '形容词', '低': '形容词', '远': '形容词', '近': '形容词', '长': '形容词', '短': '形容词',
  '深': '形容词', '浅': '形容词', '大': '形容词', '小': '形容词', '新': '形容词', '旧': '形容词',
  '明': '形容词', '暗': '形容词', '清': '形容词', '浊': '形容词', '寒': '形容词', '暖': '形容词',
  '冷': '形容词', '热': '形容词', '晴': '形容词', '阴': '形容词', '红': '形容词', '绿': '形容词',
  '青': '形容词', '白': '形容词', '黄': '形容词', '紫': '形容词', '碧': '形容词', '翠': '形容词',
  '幽': '形容词', '闲': '形容词', '孤': '形容词', '独': '形容词', '空': '形容词', '静': '形容词',
  '寂': '形容词', '悲': '形容词', '欢': '形容词', '美': '形容词', '好': '形容词',
  '残': '形容词', '枯': '形容词', '荣': '形容词', '繁': '形容词', '稀': '形容词', '疏': '形容词',

  '自': '副词', '相': '副词', '共': '副词', '俱': '副词', '皆': '副词',
  '忽': '副词', '渐': '副词', '犹': '副词', '尚': '副词', '还': '副词', '已': '副词',
  '未': '副词', '正': '副词', '才': '副词', '方': '副词', '频': '副词',

  '谁': '代词', '何': '代词', '此': '代词', '彼': '代词', '其': '代词', '吾': '代词',
  '君': '代词', '尔': '代词', '我': '代词', '汝': '代词', '斯': '代词',

  '于': '介词', '在': '介词', '向': '介词', '从': '介词', '对': '介词', '凭': '介词',
  '到': '介词', '经': '介词', '沿': '介词',

  '而': '连词', '且': '连词', '与': '连词', '和': '连词', '但': '连词', '因': '连词',
  '若': '连词', '虽': '连词', '却': '连词', '又': '连词', '更': '连词',
};

const OPPOSITE_PAIRS: Record<string, string[]> = {
  '山': ['水', '河', '海', '江'],
  '水': ['山', '峰', '石', '云'],
  '风': ['雨', '雪', '霜', '露'],
  '花': ['叶', '草', '柳', '竹'],
  '云': ['水', '风', '月', '雨'],
  '月': ['日', '星', '风', '云'],
  '天': ['地', '海', '山', '水'],
  '地': ['天', '云', '山', '空'],
  '春': ['秋', '冬', '夏'],
  '秋': ['春', '冬', '夏'],
  '朝': ['暮', '夕', '晚'],
  '暮': ['朝', '晨', '晓'],
  '晨': ['暮', '夕', '晚'],
  '晓': ['暮', '昏', '晚'],
  '来': ['去', '归', '回'],
  '去': ['来', '归', '回'],
  '归': ['去', '来', '离'],
  '回': ['去', '来', '往'],
  '飞': ['落', '沉', '栖'],
  '落': ['飞', '升', '开'],
  '开': ['落', '闭', '谢'],
  '高': ['低', '矮', '深'],
  '低': ['高'],
  '远': ['近'],
  '近': ['远'],
  '长': ['短'],
  '深': ['浅', '高'],
  '浅': ['深'],
  '大': ['小'],
  '小': ['大'],
  '新': ['旧', '故'],
  '旧': ['新'],
  '明': ['暗'],
  '暗': ['明'],
  '清': ['浊'],
  '浊': ['清'],
  '寒': ['暖', '热'],
  '暖': ['寒', '冷'],
  '冷': ['热', '暖'],
  '晴': ['阴', '雨'],
  '阴': ['晴'],
  '红': ['绿', '翠', '碧'],
  '绿': ['红'],
  '青': ['白', '红'],
  '白': ['青', '黑'],
  '黄': ['绿', '青'],
  '孤': ['双', '群', '众'],
  '独': ['群', '双', '共'],
  '空': ['满', '实'],
  '静': ['动', '闹'],
  '幽': ['明', '喧'],
  '闲': ['忙'],
  '悲': ['欢', '喜'],
  '欢': ['悲', '愁'],
  '愁': ['欢', '喜'],
  '枯': ['荣', '繁'],
  '荣': ['枯'],
  '繁': ['稀', '疏'],
  '疏': ['密', '繁'],
  '稀': ['密', '繁'],
  '千': ['百', '万', '十'],
  '百': ['千', '万'],
  '万': ['千', '一'],
  '东': ['西'],
  '西': ['东'],
  '南': ['北'],
  '北': ['南'],
  '前': ['后'],
  '后': ['前'],
  '上': ['下'],
  '下': ['上'],
  '左': ['右'],
  '右': ['左'],
  '内': ['外'],
  '外': ['内'],
  '中': ['外'],
  '生': ['灭', '死'],
  '灭': ['生'],
  '浮': ['沉'],
  '沉': ['浮'],
  '升': ['降', '落'],
  '降': ['升'],
  '流': ['驻', '停'],
  '摇': ['定', '静'],
  '飘': ['落', '定'],
  '舞': ['停', '息'],
};

export function getWordCategory(char: string): WordCategory {
  return CHAR_CATEGORIES[char] || null;
}

export function getOppositePingze(pingze: string): string {
  return pingze
    .split('')
    .map((c) => {
      if (c === '平') return '仄';
      if (c === '仄') return '平';
      return c;
    })
    .join('');
}

export function getOppositeChar(char: string): string[] {
  return OPPOSITE_PAIRS[char] || [];
}

export function suggestParallelLine(line: string): { suggestion: string; explanation: string }[] {
  const suggestions: { suggestion: string; explanation: string }[] = [];
  const chars = line.split('').filter((c) => c.trim().length > 0);

  if (chars.length === 0) return suggestions;

  getOppositeChar(chars[0]);

  const categoryPairs = [
    { ref: '青山', para: '绿水' },
    { ref: '白云', para: '清风' },
    { ref: '春风', para: '秋雨' },
    { ref: '明月', para: '清风' },
    { ref: '长风', para: '细雨' },
    { ref: '落花', para: '流水' },
    { ref: '归鸟', para: '游鱼' },
    { ref: '孤舟', para: '独钓' },
    { ref: '千山', para: '万水' },
    { ref: '寒山', para: '秋水' },
    { ref: '远山', para: '近水' },
    { ref: '高楼', para: '深院' },
    { ref: '空山', para: '静水' },
    { ref: '新雨', para: '旧风' },
    { ref: '残星', para: '落月' },
    { ref: '落日', para: '归鸟' },
    { ref: '归雁', para: '落花' },
    { ref: '寒梅', para: '暖柳' },
    { ref: '清风', para: '明月' },
    { ref: '明月', para: '繁星' },
    { ref: '朝露', para: '晚霞' },
    { ref: '晨钟', para: '暮鼓' },
    { ref: '春水', para: '秋山' },
    { ref: '秋霜', para: '春雨' },
    { ref: '冬雪', para: '春风' },
    { ref: '夏云', para: '秋月' },
    { ref: '飞鸟', para: '游鱼' },
    { ref: '鸣蝉', para: '啼鸟' },
    { ref: '行舟', para: '归客' },
    { ref: '天涯', para: '海角' },
    { ref: '人间', para: '天上' },
    { ref: '故园', para: '他乡' },
    { ref: '故乡', para: '天涯' },
    { ref: '长亭', para: '短亭' },
    { ref: '关山', para: '烽火' },
    { ref: '烽火', para: '关河' },
    { ref: '黄沙', para: '白骨' },
    { ref: '铁衣', para: '金甲' },
    { ref: '朱门', para: '白发' },
    { ref: '红尘', para: '青山' },
    { ref: '浮生', para: '旧梦' },
    { ref: '流光', para: '逝水' },
    { ref: '残阳', para: '新月' },
    { ref: '夕阳', para: '朝霞' },
    { ref: '晚风', para: '朝雨' },
    { ref: '夜月', para: '晨霜' },
    { ref: '寒灯', para: '暖酒' },
    { ref: '孤灯', para: '残梦' },
    { ref: '疏影', para: '暗香' },
    { ref: '浅草', para: '繁花' },
    { ref: '细柳', para: '轻杨' },
    { ref: '微雨', para: '轻风' },
  ];

  for (const pair of categoryPairs) {
    if (line.includes(pair.ref)) {
      const replacement = line.replace(pair.ref, pair.para);
      suggestions.push({
        suggestion: replacement,
        explanation: `"${pair.ref}" 对 "${pair.para}"：${getWordCategory(pair.ref[0]) || '名词'}类对仗，词性相同，意境相对`,
      });
    }
  }

  if (suggestions.length === 0) {
    const builtSuggestions: string[] = [];

    const built = [];
    for (let i = 0; i < Math.min(chars.length, 10); i++) {
      const char = chars[i];
      const opposites = getOppositeChar(char);
      if (opposites.length > 0) {
        built.push(opposites[Math.floor(Math.random() * opposites.length)]);
      } else {
        const category = getWordCategory(char);
        if (category) {
          const sameCategoryChars = Object.entries(CHAR_CATEGORIES)
            .filter(([, cat]) => cat === category && _getPingzeMatch(char))
            .map(([ch]) => ch);
          if (sameCategoryChars.length > 0) {
            built.push(sameCategoryChars[Math.floor(Math.random() * sameCategoryChars.length)]);
          } else {
            built.push(char);
          }
        } else {
          built.push(char);
        }
      }
    }
    if (built.length > 0) {
      builtSuggestions.push(built.join(''));
    }

    if (builtSuggestions.length > 0) {
      suggestions.push({
        suggestion: builtSuggestions[0],
        explanation: '根据原句词性与平仄，自动生成的对仗候选',
      });
    }
  }

  return suggestions.slice(0, 5);
}

function _getPingzeMatch(char: string): boolean {
  const analysis = analyzeChar(char);
  return analysis !== null && analysis.pingze !== '标点';
}

export function getParallelismExplanation(refLine: string, paraLine: string): string {
  const refChars = refLine.split('').filter((c) => c.trim().length > 0);
  const paraChars = paraLine.split('').filter((c) => c.trim().length > 0);
  const len = Math.min(refChars.length, paraChars.length);

  const matchedCategories: string[] = [];
  const oppositeCount = { ping: 0, ze: 0 };

  for (let i = 0; i < len; i++) {
    const refCat = getWordCategory(refChars[i]);
    const paraCat = getWordCategory(paraChars[i]);
    if (refCat && paraCat && refCat === paraCat) {
      matchedCategories.push(refCat);
    }

    const refAnalysis = analyzeChar(refChars[i]);
    const paraAnalysis = analyzeChar(paraChars[i]);
    if (
      refAnalysis?.pingze &&
      paraAnalysis?.pingze &&
      refAnalysis.pingze !== '标点' &&
      paraAnalysis.pingze !== '标点' &&
      refAnalysis.pingze !== paraAnalysis.pingze
    ) {
      if (refAnalysis.pingze === '平') {
        oppositeCount.ping++;
      } else {
        oppositeCount.ze++;
      }
    }
  }

  const uniqueCategories = [...new Set(matchedCategories)];
  let parts: string[] = [];

  if (uniqueCategories.length > 0) {
    parts.push(`词性对应：${uniqueCategories.join('、')}`);
  }

  const totalOpposite = oppositeCount.ping + oppositeCount.ze;
  if (totalOpposite > 0) {
    parts.push(`平仄相对：${totalOpposite}字平仄相反`);
  }

  if (parts.length === 0) {
    parts.push('基础对仗建议');
  }

  return parts.join('；');
}
