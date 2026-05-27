import React from 'react';
import type { CardTheme } from './PoemCardPreview';

interface ThemeSelectorProps {
  selectedTheme: CardTheme;
  onChange: (theme: CardTheme) => void;
}

const themes: { id: CardTheme; name: string; desc: string; preview: React.CSSProperties }[] = [
  {
    id: 'classical',
    name: '古典',
    desc: '传统印章与回纹边框',
    preview: {
      background: 'linear-gradient(135deg, #F7F4ED 0%, #F0EBE0 100%)',
      borderColor: '#8B7355',
    },
  },
  {
    id: 'modern',
    name: '现代',
    desc: '简洁干净的现代设计',
    preview: {
      background: 'linear-gradient(180deg, #FFFFFF 0%, #F8F8F8 100%)',
      borderColor: '#E0E0E0',
    },
  },
  {
    id: 'ink',
    name: '水墨',
    desc: '水墨晕染效果',
    preview: {
      background: 'radial-gradient(ellipse at 30% 30%, rgba(150,150,150,0.15) 0%, transparent 50%), linear-gradient(200deg, #F5F2EB 0%, #E8E3DA 100%)',
      borderColor: '#A0907B',
    },
  },
];

export default function ThemeSelector({ selectedTheme, onChange }: ThemeSelectorProps) {
  return (
    <div className="flex gap-3">
      {themes.map((t) => {
        const isSelected = selectedTheme === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={`flex flex-col items-center gap-2 p-3 rounded-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cinnabar/40 ${
              isSelected
                ? 'ring-2 ring-cinnabar/60 bg-cinnabar/5'
                : 'hover:bg-ink-black/5'
            }`}
            aria-label={`选择${t.name}主题`}
          >
            <div
              className="w-16 h-20 rounded-sm border-2 transition-all duration-200"
              style={{
                ...t.preview,
                borderColor: isSelected ? '#C4453A' : t.preview.borderColor || '#DDD',
                boxShadow: isSelected ? '0 2px 8px rgba(196,69,58,0.15)' : '0 1px 3px rgba(0,0,0,0.08)',
              }}
            >
              <div className="w-full h-full flex items-center justify-center">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: t.id === 'classical' ? '#C4453A' : t.id === 'modern' ? '#2B5B84' : '#4A6B8C',
                    opacity: 0.6,
                  }}
                />
              </div>
            </div>
            <span className="text-xs text-ink-black tracking-wider font-medium">
              {t.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
