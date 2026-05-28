import type { CharacterInfo } from './pingze-dictionary';

type DictLoader = () => Promise<Map<string, CharacterInfo>>;

let dictPromise: Promise<Map<string, CharacterInfo>> | null = null;
let dictCache: Map<string, CharacterInfo> | null = null;

const loader: DictLoader = async () => {
  if (dictCache) return dictCache;
  if (!dictPromise) {
    dictPromise = import('./pingze-dictionary').then((mod) => {
      dictCache = mod.PINGZE_DICT;
      return mod.PINGZE_DICT;
    });
  }
  return dictPromise;
};

export async function loadPingzeDict(): Promise<Map<string, CharacterInfo>> {
  return loader();
}

export function getPreloadedDict(): Map<string, CharacterInfo> | null {
  return dictCache;
}

export function detectPingzeIdle(
  text: string,
  callback: (result: { char: string; pingze: '平' | '仄' }[]) => void
) {
  if (typeof requestIdleCallback !== 'undefined') {
    requestIdleCallback(async () => {
      const dict = await loadPingzeDict();
      const result = text
        .replace(/[，。.!！？、；：""''（）【】《》\s]/g, '')
        .split('')
        .map((char) => {
          const info = dict.get(char);
          return { char, pingze: info?.pingze || '平' };
        });
      callback(result);
    });
  } else {
    setTimeout(async () => {
      const dict = await loadPingzeDict();
      const result = text
        .replace(/[，。.!！？、；：""''（）【】《》\s]/g, '')
        .split('')
        .map((char) => {
          const info = dict.get(char);
          return { char, pingze: info?.pingze || '平' };
        });
      callback(result);
    }, 0);
  }
}
