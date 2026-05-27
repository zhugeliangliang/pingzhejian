import type { Poetry } from '../types';

interface PoemCardTemplate {
  id: string;
  name: string;
  background: string;
  fontFamily: string;
  titleFont: string;
  contentFont: string;
  titleColor: string;
  contentColor: string;
  accentColor: string;
  sealStyle: 'classical' | 'modern' | 'ink';
  borderColor?: string;
  decorativeElements?: string[];
}

export const templates: PoemCardTemplate[] = [
  {
    id: 'classical',
    name: '古典',
    background: `linear-gradient(135deg, #F7F4ED 0%, #F5F0E6 50%, #F0EBE0 100%)`,
    fontFamily: '"Noto Serif SC", "Source Han Serif SC", "SimSun", serif',
    titleFont: '"KaiTi", "STKaiti", "楷体", serif',
    contentFont: '"Noto Serif SC", "Source Han Serif SC", "SimSun", serif',
    titleColor: '#2C2C2C',
    contentColor: '#4A4A4A',
    accentColor: '#C4453A',
    sealStyle: 'classical',
    borderColor: '#8B7355',
    decorativeElements: ['回纹边框', '印章'],
  },
  {
    id: 'modern',
    name: '现代',
    background: `linear-gradient(180deg, #FFFFFF 0%, #F8F8F8 100%)`,
    fontFamily: '"Noto Sans SC", "Source Han Sans CN", "Microsoft YaHei", sans-serif',
    titleFont: '"Noto Sans SC", "Source Han Sans CN", "Microsoft YaHei", sans-serif',
    contentFont: '"Noto Sans SC", "Source Han Sans CN", "Microsoft YaHei", sans-serif',
    titleColor: '#1A1A1A',
    contentColor: '#555555',
    accentColor: '#2B5B84',
    sealStyle: 'modern',
    decorativeElements: [],
  },
  {
    id: 'ink',
    name: '水墨',
    background: `radial-gradient(ellipse at 30% 20%, rgba(180,180,180,0.1) 0%, transparent 50%),
      radial-gradient(ellipse at 70% 60%, rgba(120,120,120,0.08) 0%, transparent 40%),
      linear-gradient(200deg, #F5F2EB 0%, #EDE8DF 40%, #F0EBE3 70%, #E8E3DA 100%)`,
    fontFamily: '"Noto Serif SC", "Source Han Serif SC", "SimSun", serif',
    titleFont: '"KaiTi", "STKaiti", "楷体", serif',
    contentFont: '"KaiTi", "STKaiti", "楷体", serif',
    titleColor: '#333333',
    contentColor: '#5A5A5A',
    accentColor: '#4A6B8C',
    sealStyle: 'ink',
    borderColor: '#A0907B',
    decorativeElements: ['水墨晕染'],
  },
];

export function formatPoemText(poem: Poetry): string {
  const lines = poem.content.split('\n').filter((line) => line.trim());
  const titleLine = poem.title || '无题';
  const authorLine = poem.author ? `〔${poem.author}〕` : '';
  const formLine = poem.form ? `（${poem.form}）` : '';

  return `${titleLine}
${authorLine}${formLine}

${lines.join('\n')}

—— 选自「平仄间」`;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fallback
  }

  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const result = document.execCommand('copy');
    document.body.removeChild(textArea);
    return result;
  } catch {
    return false;
  }
}

function getSealSVG(style: 'classical' | 'modern' | 'ink', size: number = 48): string {
  const seals = {
    classical: `<svg width="${size}" height="${size}" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="44" height="44" rx="2" fill="none" stroke="#C4453A" stroke-width="2"/>
      <rect x="5" y="5" width="38" height="38" rx="1" fill="none" stroke="#C4453A" stroke-width="1"/>
      <text x="24" y="20" text-anchor="middle" fill="#C4453A" font-family="KaiTi, STKaiti, serif" font-size="12" font-weight="bold">平</text>
      <text x="24" y="34" text-anchor="middle" fill="#C4453A" font-family="KaiTi, STKaiti, serif" font-size="12" font-weight="bold">仄</text>
      <line x1="5" y1="24" x2="43" y2="24" stroke="#C4453A" stroke-width="0.8"/>
    </svg>`,
    modern: `<svg width="${size}" height="${size}" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="20" fill="none" stroke="#2B5B84" stroke-width="1.5"/>
      <text x="24" y="29" text-anchor="middle" fill="#2B5B84" font-family="sans-serif" font-size="14" font-weight="300">仄</text>
    </svg>`,
    ink: `<svg width="${size}" height="${size}" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="42" height="42" rx="21" fill="none" stroke="#4A6B8C" stroke-width="1.5" opacity="0.8"/>
      <text x="24" y="28" text-anchor="middle" fill="#4A6B8C" font-family="KaiTi, STKaiti, serif" font-size="16" opacity="0.9">韵</text>
    </svg>`,
  };
  return seals[style];
}

function getDecorativeBorder(style: string): string {
  if (style === 'classical') {
    return `
    <style>
      .poem-card-border {
        position: absolute;
        inset: 12px;
        border: 1px solid #8B7355;
        pointer-events: none;
      }
      .poem-card-border::before {
        content: '';
        position: absolute;
        inset: 3px;
        border: 0.5px solid #8B7355;
        opacity: 0.5;
      }
      .corner-decoration {
        position: absolute;
        width: 20px;
        height: 20px;
        opacity: 0.6;
      }
      .corner-tl { top: 8px; left: 8px; border-top: 2px solid #8B7355; border-left: 2px solid #8B7355; }
      .corner-tr { top: 8px; right: 8px; border-top: 2px solid #8B7355; border-right: 2px solid #8B7355; }
      .corner-bl { bottom: 8px; left: 8px; border-bottom: 2px solid #8B7355; border-left: 2px solid #8B7355; }
      .corner-br { bottom: 8px; right: 8px; border-bottom: 2px solid #8B7355; border-right: 2px solid #8B7355; }
    </style>`;
  }
  return '';
}

function getInkWashBackground(): string {
  return `
    <style>
      @keyframes inkFloat {
        0%, 100% { opacity: 0.06; }
        50% { opacity: 0.1; }
      }
      .ink-blob {
        position: absolute;
        border-radius: 50%;
        filter: blur(40px);
        pointer-events: none;
      }
    </style>`;
}

export function generatePoemCardHTML(poem: Poetry, templateId: string = 'classical'): string {
  const template = templates.find((t) => t.id === templateId) || templates[0];
  const lines = poem.content.split('\n').filter((line) => line.trim());
  const sealSVG = getSealSVG(template.sealStyle);
  const decorativeBorder = getDecorativeBorder(templateId);
  const inkWash = templateId === 'ink' ? getInkWashBackground() : '';

  const inkBlobs = templateId === 'ink'
    ? `<div class="ink-blob" style="width:200px;height:200px;background:rgba(80,80,80,0.15);top:10%;right:-5%;"></div>
       <div class="ink-blob" style="width:150px;height:150px;background:rgba(60,80,100,0.1);bottom:20%;left:-3%;"></div>
       <div class="ink-blob" style="width:100px;height:100px;background:rgba(100,90,80,0.08);top:50%;right:20%;"></div>`
    : '';

  const linesHTML = lines
    .map(
      (line) =>
        `<div class="poem-line">${line.trim()}</div>`
    )
    .join('\n');

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${poem.title || '无题'}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  
  body {
    width: 420px;
    min-height: 560px;
    font-family: ${template.fontFamily};
    background: ${template.background};
    position: relative;
    overflow: hidden;
  }

  ${decorativeBorder}
  ${inkWash}

  .card-container {
    position: relative;
    z-index: 1;
    padding: 48px 36px;
    min-height: 560px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .poem-title {
    font-family: ${template.titleFont};
    font-size: 28px;
    color: ${template.titleColor};
    letter-spacing: 0.2em;
    margin-bottom: 8px;
    text-align: center;
    font-weight: 600;
  }

  .poem-author {
    font-size: 13px;
    color: ${template.contentColor};
    opacity: 0.6;
    letter-spacing: 0.15em;
    margin-bottom: 6px;
    text-align: center;
  }

  .poem-form-badge {
    font-size: 11px;
    color: ${template.accentColor};
    opacity: 0.7;
    letter-spacing: 0.1em;
    margin-bottom: 28px;
    padding: 2px 10px;
    border: 0.5px solid ${template.accentColor};
    border-radius: 2px;
    opacity: 0.5;
  }

  .poem-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin-bottom: 32px;
  }

  .poem-line {
    font-family: ${template.contentFont};
    font-size: 20px;
    color: ${template.contentColor};
    letter-spacing: 0.25em;
    line-height: 1.8;
    text-align: center;
  }

  .divider {
    width: 60px;
    height: 1px;
    background: ${template.accentColor};
    opacity: 0.3;
    margin: 16px 0;
  }

  .seal-container {
    margin-top: auto;
    opacity: 0.85;
  }

  .footer-text {
    font-size: 10px;
    color: ${template.contentColor};
    opacity: 0.4;
    letter-spacing: 0.1em;
    margin-top: 12px;
    text-align: center;
  }

  ${templateId === 'ink' ? `
  .poem-line {
    text-shadow: 0 0 1px rgba(0,0,0,0.05);
  }
  ` : ''}
</style>
</head>
<body>
  ${inkBlobs}
  ${templateId === 'classical' ? `<div class="poem-card-border"></div>
  <div class="corner-decoration corner-tl"></div>
  <div class="corner-decoration corner-tr"></div>
  <div class="corner-decoration corner-bl"></div>
  <div class="corner-decoration corner-br"></div>` : ''}
  
  <div class="card-container">
    <div class="poem-title">${poem.title || '无题'}</div>
    ${poem.author ? `<div class="poem-author">${poem.author}</div>` : ''}
    ${poem.form ? `<div class="poem-form-badge">${poem.form}</div>` : ''}
    
    <div class="poem-content">
      ${linesHTML}
    </div>
    
    <div class="divider"></div>
    
    <div class="seal-container">
      ${sealSVG}
    </div>
    
    <div class="footer-text">平仄间 · PingZe Jian</div>
  </div>
</body>
</html>`;
}
