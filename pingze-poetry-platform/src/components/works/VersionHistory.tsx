import type { PoemVersion } from '../../api/client';
import Button from '../Button';

interface VersionHistoryProps {
  versions: PoemVersion[];
  currentVersionId: string;
  onRestore: (version: PoemVersion) => void;
}

export default function VersionHistory({
  versions,
  currentVersionId,
  onRestore,
}: VersionHistoryProps) {
  if (versions.length === 0) {
    return (
      <div className="mt-4 p-4 border border-ink-black/8 rounded-sm text-center">
        <p className="text-sm text-ink-black/40 tracking-wider">暂无版本历史</p>
      </div>
    );
  }

  const sortedVersions = [...versions].sort((a, b) =>
    b.version_number - a.version_number
  );

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes} 分钟前`;
    if (hours < 24) return `${hours} 小时前`;
    if (days < 7) return `${days} 天前`;

    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="mt-6 border-t border-ink-black/8 pt-4 animate-fade-in">
      <h4 className="text-sm font-medium text-ink-black tracking-wider mb-4">
        版本历史
      </h4>
      <div className="space-y-0">
        {sortedVersions.map((version, index) => {
          const isCurrent = version.version_id === currentVersionId ||
            version.version_number.toString() === currentVersionId;

          return (
            <div
              key={version.version_id}
              className={`flex items-start gap-3 py-3 ${
                index < sortedVersions.length - 1 ? 'border-b border-ink-black/5' : ''
              }`}
            >
              <div className="flex flex-col items-center flex-shrink-0">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    isCurrent
                      ? 'bg-cinnabar text-white'
                      : 'bg-ink-black/10 text-ink-black/50'
                  }`}
                >
                  {version.version_number}
                </div>
                {index < sortedVersions.length - 1 && (
                  <div className="w-px h-8 bg-ink-black/10 mt-1" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-ink-black/70 tracking-wider">
                    v{version.version_number}
                  </span>
                  {isCurrent && (
                    <span className="text-xs text-cinnabar bg-cinnabar/10 px-2 py-0.5 rounded-sm">
                      当前版本
                    </span>
                  )}
                </div>
                {version.change_summary && (
                  <p className="text-xs text-ink-black/50 mt-0.5">
                    {version.change_summary}
                  </p>
                )}
                <time
                  dateTime={version.created_at}
                  className="text-xs text-ink-black/30 mt-0.5 block"
                >
                  {formatTime(version.created_at)}
                </time>
              </div>

              {!isCurrent && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRestore(version)}
                  className="flex-shrink-0"
                >
                  恢复
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
