import type { SaveStatus } from '../../hooks/useAutoSave';

interface SaveBarProps {
  saveStatus: SaveStatus;
  lastSaved: Date | null;
  onSave: () => void;
  onShare: () => void;
  onExport: () => void;
  poemTitle?: string;
  templateName?: string;
}

export default function SaveBar({
  saveStatus,
  lastSaved,
  onSave,
  onShare,
  onExport,
  poemTitle,
  templateName,
}: SaveBarProps) {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    if (diff < 60000) return '刚刚';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  };

  const statusText = {
    idle: '',
    saving: '保存中...',
    saved: '已保存',
    error: '保存失败',
  };

  const statusColor = {
    idle: 'text-ink-black/30',
    saving: 'text-indigo-blue/70',
    saved: 'text-green-700/70',
    error: 'text-red-600/70',
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 bg-rice-paper/95 backdrop-blur-sm
                 border-t border-ink-black/10 shadow-lg animate-slide-up"
    >
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {saveStatus === 'saving' && (
              <svg className="animate-spin w-4 h-4 text-indigo-blue/70" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            {saveStatus === 'saved' && (
              <svg className="w-4 h-4 text-green-700/70" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
            {saveStatus === 'error' && (
              <svg className="w-4 h-4 text-red-600/70" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            )}
            <span className={`text-xs ${statusColor[saveStatus]}`}>
              {statusText[saveStatus]}
            </span>
          </div>

          {lastSaved && (
            <span className="text-xs text-ink-black/25">
              {formatTime(lastSaved)}
            </span>
          )}

          {templateName && (
            <span className="text-xs text-ink-black/30 px-2 py-0.5 bg-ink-black/5 rounded-sm">
              {templateName}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {poemTitle && (
            <span className="text-xs text-ink-black/40 mr-2 max-w-32 truncate">
              {poemTitle}
            </span>
          )}

          <button
            onClick={onExport}
            className="px-3 py-1.5 text-xs border border-ink-black/15 rounded-sm
                       text-ink-black/60 hover:border-indigo-blue/40 hover:text-indigo-blue
                       transition-colors"
          >
            导出
          </button>

          <button
            onClick={onShare}
            className="px-3 py-1.5 text-xs border border-ink-black/15 rounded-sm
                       text-ink-black/60 hover:border-indigo-blue/40 hover:text-indigo-blue
                       transition-colors"
          >
            分享
          </button>

          <button
            onClick={onSave}
            className="px-4 py-1.5 text-xs bg-cinnabar text-white rounded-sm
                       hover:bg-cinnabar/90 transition-colors shadow-sm"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}
