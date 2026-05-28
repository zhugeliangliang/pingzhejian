import type { Poem } from '../../api/client';
import Badge from '../Badge';
import Card from '../Card';

const poemTypeLabels: Record<string, string> = {
  '诗': '诗',
  '词': '词',
  '曲': '曲',
  '赋': '赋',
};

interface WorkCardProps {
  work: Poem;
  onView: (work: Poem) => void;
  onEdit: (work: Poem) => void;
  onDelete: (work: Poem) => void;
  onShare: (work: Poem) => void;
}

export default function WorkCard({
  work,
  onView,
  onEdit,
  onDelete,
  onShare,
}: WorkCardProps) {
  const previewLines = work.content
    .split('\n')
    .filter((line: string) => line.trim().length > 0)
    .slice(0, 2)
    .join('\n');

  const createdDate = new Date(work.created_at);
  const formattedDate = createdDate.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const updatedDate = new Date(work.updated_at);
  const isUpdated = updatedDate.getTime() - createdDate.getTime() > 60000;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(work);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(work);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShare(work);
  };

  return (
    <Card
      variant="raised"
      className="cursor-pointer group animate-slide-up"
    >
      <div
        className="p-6"
        onClick={() => onView(work)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter') onView(work); }}
      >
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-medium text-ink-black tracking-wider group-hover:text-cinnabar transition-colors duration-200 line-clamp-1">
            {work.title}
          </h3>
          <Badge variant="cinnabar" className="ml-2 flex-shrink-0">
            {poemTypeLabels[work.poem_type] || work.poem_type}
          </Badge>
        </div>

        <p className="text-sm text-ink-black/60 leading-relaxed whitespace-pre-line mb-4 line-clamp-2 font-serif">
          {previewLines}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-ink-black/8">
          <div className="flex items-center gap-3 text-xs text-ink-black/40">
            <time dateTime={work.created_at}>
              {formattedDate}
            </time>
            {isUpdated && (
              <span className="text-ink-black/30">
                已编辑
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="flex items-center gap-1 text-xs text-ink-black/40">
              <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
              </svg>
              {work.like_count}
            </span>
          </div>
        </div>
      </div>

      <div className="px-6 pb-4 flex items-center gap-2">
        <button
          onClick={() => onView(work)}
          className="flex-1 py-1.5 text-xs text-ink-black/60 hover:text-cinnabar border border-ink-black/10 hover:border-cinnabar/30 rounded-sm transition-all duration-200 text-center"
        >
          查看
        </button>
        <button
          onClick={handleEdit}
          className="flex-1 py-1.5 text-xs text-ink-black/60 hover:text-indigo-blue border border-ink-black/10 hover:border-indigo-blue/30 rounded-sm transition-all duration-200 text-center"
        >
          编辑
        </button>
        <button
          onClick={handleShare}
          className="flex-1 py-1.5 text-xs text-ink-black/60 hover:text-indigo-blue border border-ink-black/10 hover:border-indigo-blue/30 rounded-sm transition-all duration-200 text-center"
        >
          分享
        </button>
        <button
          onClick={handleDelete}
          className="py-1.5 px-3 text-xs text-ink-black/40 hover:text-cinnabar border border-ink-black/10 hover:border-cinnabar/30 rounded-sm transition-all duration-200"
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </Card>
  );
}
