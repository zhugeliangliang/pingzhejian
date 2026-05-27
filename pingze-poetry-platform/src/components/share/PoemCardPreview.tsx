import React from 'react';
import type { Poetry } from '../../types';

export type CardTheme = 'classical' | 'modern' | 'ink';

interface PoemCardPreviewProps {
  poem: Poetry;
  theme?: CardTheme;
  cardRef?: React.RefObject<HTMLDivElement | null>;
}

const themeStyles: Record<CardTheme, {
  bg: string;
  titleFont: string;
  contentFont: string;
  titleColor: string;
  contentColor: string;
  accentColor: string;
  borderColor?: string;
  extra: string;
}> = {
  classical: {
    bg: 'linear-gradient(135deg, #F7F4ED 0%, #F5F0E6 50%, #F0EBE0 100%)',
    titleFont: '"KaiTi", "STKaiti", "楷体", "Noto Serif SC", serif',
    contentFont: '"Noto Serif SC", "Source Han Serif SC", "SimSun", serif',
    titleColor: '#2C2C2C',
    contentColor: '#4A4A4A',
    accentColor: '#C4453A',
    borderColor: '#8B7355',
    extra: '',
  },
  modern: {
    bg: 'linear-gradient(180deg, #FFFFFF 0%, #F8F8F8 100%)',
    titleFont: '"Noto Sans SC", "Source Han Sans CN", "Microsoft YaHei", sans-serif',
    contentFont: '"Noto Sans SC", "Source Han Sans CN", "Microsoft YaHei", sans-serif',
    titleColor: '#1A1A1A',
    contentColor: '#555555',
    accentColor: '#2B5B84',
    extra: '',
  },
  ink: {
    bg: 'radial-gradient(ellipse at 30% 20%, rgba(180,180,180,0.1) 0%, transparent 50%), radial-gradient(ellipse at 70% 60%, rgba(120,120,120,0.08) 0%, transparent 40%), linear-gradient(200deg, #F5F2EB 0%, #EDE8DF 40%, #F0EBE3 70%, #E8E3DA 100%)',
    titleFont: '"KaiTi", "STKaiti", "楷体", "Noto Serif SC", serif',
    contentFont: '"KaiTi", "STKaiti", "楷体", "Noto Serif SC", serif',
    titleColor: '#333333',
    contentColor: '#5A5A5A',
    accentColor: '#4A6B8C',
    borderColor: '#A0907B',
    extra: 'ink-extra',
  },
};

function SealIcon({ theme }: { theme: CardTheme }) {
  if (theme === 'classical') {
    return (
      <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="44" height="44" rx="2" fill="none" stroke="#C4453A" strokeWidth="2" />
        <rect x="5" y="5" width="38" height="38" rx="1" fill="none" stroke="#C4453A" strokeWidth="1" />
        <text x="24" y="20" textAnchor="middle" fill="#C4453A" fontFamily="KaiTi, STKaiti, serif" fontSize="12" fontWeight="bold">平</text>
        <text x="24" y="34" textAnchor="middle" fill="#C4453A" fontFamily="KaiTi, STKaiti, serif" fontSize="12" fontWeight="bold">仄</text>
        <line x1="5" y1="24" x2="43" y2="24" stroke="#C4453A" strokeWidth="0.8" />
      </svg>
    );
  }
  if (theme === 'modern') {
    return (
      <svg width="40" height="40" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="20" fill="none" stroke="#2B5B84" strokeWidth="1.5" />
        <text x="24" y="29" textAnchor="middle" fill="#2B5B84" fontFamily="sans-serif" fontSize="14" fontWeight="300">仄</text>
      </svg>
    );
  }
  return (
    <svg width="44" height="44" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="42" height="42" rx="21" fill="none" stroke="#4A6B8C" strokeWidth="1.5" opacity="0.8" />
      <text x="24" y="28" textAnchor="middle" fill="#4A6B8C" fontFamily="KaiTi, STKaiti, serif" fontSize="16" opacity="0.9">韵</text>
    </svg>
  );
}

export default function PoemCardPreview({ poem, theme = 'classical', cardRef }: PoemCardPreviewProps) {
  const style = themeStyles[theme];
  const lines = poem.content.split('\n').filter((line) => line.trim());

  return (
    <div
      ref={cardRef}
      className="poem-card-inner"
      style={{
        width: '360px',
        minHeight: '480px',
        background: style.bg,
        fontFamily: style.contentFont,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '40px 32px',
      }}
    >
      {theme === 'classical' && (
        <>
          <div
            style={{
              position: 'absolute',
              inset: '10px',
              border: `1px solid ${style.borderColor}`,
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: '14px',
              border: `0.5px solid ${style.borderColor}`,
              opacity: 0.4,
              pointerEvents: 'none',
            }}
          />
          {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((corner) => {
            const positions: Record<string, React.CSSProperties> = {
              'top-left': { top: '6px', left: '6px', borderTop: '2px solid #8B7355', borderLeft: '2px solid #8B7355' },
              'top-right': { top: '6px', right: '6px', borderTop: '2px solid #8B7355', borderRight: '2px solid #8B7355' },
              'bottom-left': { bottom: '6px', left: '6px', borderBottom: '2px solid #8B7355', borderLeft: '2px solid #8B7355' },
              'bottom-right': { bottom: '6px', right: '6px', borderBottom: '2px solid #8B7355', borderRight: '2px solid #8B7355' },
            };
            return (
              <div
                key={corner}
                style={{
                  position: 'absolute',
                  width: '16px',
                  height: '16px',
                  opacity: 0.5,
                  ...positions[corner],
                }}
              />
            );
          })}
        </>
      )}

      {theme === 'ink' && (
        <>
          <div
            style={{
              position: 'absolute',
              width: '180px',
              height: '180px',
              borderRadius: '50%',
              background: 'rgba(80,80,80,0.08)',
              filter: 'blur(30px)',
              top: '8%',
              right: '-5%',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: 'rgba(60,80,100,0.06)',
              filter: 'blur(25px)',
              bottom: '15%',
              left: '-3%',
              pointerEvents: 'none',
            }}
          />
        </>
      )}

      <div style={{ position: 'relative', zIndex: 1, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
        <h2
          style={{
            fontFamily: style.titleFont,
            fontSize: '26px',
            color: style.titleColor,
            letterSpacing: '0.2em',
            marginBottom: '8px',
            textAlign: 'center',
            fontWeight: 600,
          }}
        >
          {poem.title || '无题'}
        </h2>

        {poem.author && (
          <p
            style={{
              fontSize: '13px',
              color: style.contentColor,
              opacity: 0.6,
              letterSpacing: '0.15em',
              marginBottom: '6px',
              textAlign: 'center',
            }}
          >
            {poem.author}
          </p>
        )}

        {poem.form && (
          <span
            style={{
              fontSize: '11px',
              color: style.accentColor,
              letterSpacing: '0.1em',
              marginBottom: '24px',
              padding: '2px 10px',
              border: `0.5px solid ${style.accentColor}`,
              borderRadius: '2px',
              opacity: 0.5,
            }}
          >
            {poem.form}
          </span>
        )}

        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            marginBottom: '24px',
            width: '100%',
          }}
        >
          {lines.map((line, i) => (
            <p
              key={i}
              style={{
                fontFamily: style.contentFont,
                fontSize: '18px',
                color: style.contentColor,
                letterSpacing: '0.25em',
                lineHeight: '1.8',
                textAlign: 'center',
                ...(theme === 'ink' ? { textShadow: '0 0 1px rgba(0,0,0,0.05)' } : {}),
              }}
            >
              {line.trim()}
            </p>
          ))}
        </div>

        <div
          style={{
            width: '50px',
            height: '1px',
            background: style.accentColor,
            opacity: 0.3,
            marginBottom: '16px',
          }}
        />

        <div style={{ opacity: 0.85 }}>
          <SealIcon theme={theme} />
        </div>

        <p
          style={{
            fontSize: '10px',
            color: style.contentColor,
            opacity: 0.4,
            letterSpacing: '0.1em',
            marginTop: '10px',
            textAlign: 'center',
          }}
        >
          平仄间 · PingZe Jian
        </p>
      </div>
    </div>
  );
}
