import { useRef, useState, useCallback } from 'react';
import html2canvas from 'html2canvas';
import type { Poetry } from '../../types';
import Modal from '../Modal';
import Button from '../Button';
import PoemCardPreview, { type CardTheme } from './PoemCardPreview';
import ThemeSelector from './ThemeSelector';
import { formatPoemText, copyToClipboard } from '../../utils/export';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  poem: Poetry;
}

export default function ShareModal({ isOpen, onClose, poem }: ShareModalProps) {
  const [theme, setTheme] = useState<CardTheme>('classical');
  const [isGenerating, setIsGenerating] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  }, []);

  const handleCopyText = async () => {
    const text = formatPoemText(poem);
    const ok = await copyToClipboard(text);
    showToast(ok ? '已复制诗词文本' : '复制失败，请手动复制');
  };

  const handleCopyImage = async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
        logging: false,
      });
      canvas.toBlob(async (blob) => {
        if (!blob) {
          showToast('图片生成失败');
          return;
        }
        try {
          if (navigator.clipboard && navigator.clipboard.write) {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob }),
            ]);
            showToast('已复制图片到剪贴板');
          } else {
            showToast('浏览器不支持图片复制，请使用下载功能');
          }
        } catch {
          showToast('图片复制失败，请使用下载功能');
        }
      }, 'image/png');
    } catch {
      showToast('图片生成失败');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
        logging: false,
      });
      const link = document.createElement('a');
      link.download = `${poem.title || '诗词'}_平仄间.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      showToast('图片已下载');
    } catch {
      showToast('图片生成失败');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShareLink = async () => {
    const url = window.location.href;
    const ok = await copyToClipboard(url);
    showToast(ok ? '已复制分享链接' : '复制失败');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="分享诗词">
      <div className="space-y-6">
        {toast && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] bg-ink-black text-rice-paper px-4 py-2 text-sm tracking-wider rounded-sm animate-slide-up shadow-lg">
            {toast}
          </div>
        )}

        <div>
          <label className="block text-sm text-ink-black/70 mb-3 tracking-wider font-medium">
            卡片风格
          </label>
          <ThemeSelector selectedTheme={theme} onChange={setTheme} />
        </div>

        <div className="flex justify-center bg-rice-paper p-4 rounded-sm border border-ink-black/8">
          <div className="shadow-lg">
            <PoemCardPreview poem={poem} theme={theme} cardRef={cardRef} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Button variant="secondary" size="sm" onClick={handleCopyText} disabled={isGenerating}>
            <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            复制文本
          </Button>
          <Button variant="secondary" size="sm" onClick={handleCopyImage} disabled={isGenerating}>
            <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            复制图片
          </Button>
          <Button variant="secondary" size="sm" onClick={handleDownloadImage} disabled={isGenerating}>
            <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            下载图片
          </Button>
        </div>

        <div>
          <label className="block text-sm text-ink-black/70 mb-3 tracking-wider font-medium">
            分享到
          </label>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleShareLink}
              className="flex items-center gap-2 px-4 py-2 text-sm border border-ink-black/20 rounded-sm text-ink-black/70 hover:border-green-600 hover:text-green-600 transition-colors duration-200"
              aria-label="分享到微信"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.294.29.294a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05a6.42 6.42 0 0 1-.248-1.753c0-3.694 3.387-6.69 7.57-6.69.25 0 .493.02.736.04C17.088 4.832 13.214 2.188 8.691 2.188zm-2.6 4.408c-.58 0-1.05-.47-1.05-1.05s.47-1.05 1.05-1.05 1.05.47 1.05 1.05-.47 1.05-1.05 1.05zm5.2 0c-.58 0-1.05-.47-1.05-1.05s.47-1.05 1.05-1.05 1.05.47 1.05 1.05-.47 1.05-1.05 1.05zm4.79 3.374c-3.488 0-6.32 2.536-6.32 5.666 0 3.13 2.832 5.666 6.32 5.666a7.62 7.62 0 0 0 2.12-.3.628.628 0 0 1 .522.072l1.4.82a.24.24 0 0 0 .124.04c.117 0 .213-.098.213-.216a.57.57 0 0 0-.036-.157l-.287-1.087a.437.437 0 0 1 .156-.49C22.694 18.884 24 17.136 24 15.136c0-3.13-2.832-5.666-6.319-5.666zm-2.186 3.492c-.426 0-.772-.346-.772-.772s.346-.772.772-.772.772.346.772.772-.346.772-.772.772zm4.372 0c-.426 0-.772-.346-.772-.772s.346-.772.772-.772.772.346.772.772-.346.772-.772.772z" />
              </svg>
              微信
            </button>
            <button
              onClick={handleShareLink}
              className="flex items-center gap-2 px-4 py-2 text-sm border border-ink-black/20 rounded-sm text-ink-black/70 hover:border-red-500 hover:text-red-500 transition-colors duration-200"
              aria-label="分享到微博"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10.098 20.325c-3.977.391-7.415-1.406-7.672-4.02-.258-2.614 2.789-5.045 6.767-5.436 3.977-.391 7.414 1.406 7.671 4.02.258 2.614-2.789 5.045-6.766 5.436zM9.05 17.59c-.391.183-.857.183-1.04-.036-.183-.22-.036-.544.354-.726.391-.183.857-.183 1.04.036.183.219.036.544-.354.726zm1.167-.934c-.57.232-1.08.087-1.14-.324-.06-.41.338-.93.907-1.16.57-.232 1.08-.087 1.14.324.06.41-.338.93-.907 1.16zm.472-1.425c-.342.15-.66.08-.708-.154-.048-.233.18-.54.522-.69.342-.15.66-.08.708.154.048.233-.18.54-.522.69zM20.02 7.85c-.391-.15-.9-.183-1.32-.08-.391.097-.734.33-.734.33s-.183-.087-.183-.273c0-.183.15-.48.42-.69.48-.39 1.26-.57 1.83-.42.57.15.87.63.69 1.14l-.708-.007zm-.232-1.35c-.087-.48-.57-.72-.96-.72-.15 0-.273.03-.39.08-.273.12-.48.39-.48.66 0 .15.03.273.087.39.12.273.39.48.66.48.15 0 .273-.03.39-.08.273-.12.48-.39.48-.66 0-.087-.03-.15-.087-.22l.3-.03z" />
              </svg>
              微博
            </button>
            <button
              onClick={handleShareLink}
              className="flex items-center gap-2 px-4 py-2 text-sm border border-ink-black/20 rounded-sm text-ink-black/70 hover:text-cinnabar transition-colors duration-200"
              aria-label="复制链接"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
              复制链接
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
