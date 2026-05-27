import type { Poem } from '../../api/client';
import WorkCard from './WorkCard';

interface PaginationInfo {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

interface WorkListProps {
  works: Poem[];
  loading: boolean;
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
  onView: (work: Poem) => void;
  onEdit: (work: Poem) => void;
  onDelete: (work: Poem) => void;
  onShare: (work: Poem) => void;
}

export default function WorkList({
  works,
  loading,
  pagination,
  onPageChange,
  onView,
  onEdit,
  onDelete,
  onShare,
}: WorkListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="p-6 border border-ink-black/8 rounded-sm bg-rice-paper animate-pulse"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="h-6 w-32 bg-ink-black/8 rounded-sm" />
              <div className="h-5 w-10 bg-ink-black/8 rounded-sm" />
            </div>
            <div className="space-y-2 mb-4">
              <div className="h-4 w-full bg-ink-black/5 rounded-sm" />
              <div className="h-4 w-3/4 bg-ink-black/5 rounded-sm" />
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-ink-black/8">
              <div className="h-3 w-24 bg-ink-black/5 rounded-sm" />
              <div className="h-3 w-12 bg-ink-black/5 rounded-sm" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (works.length === 0) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <div className="inline-flex items-center justify-center w-24 h-24 mb-6 rounded-full bg-ink-black/5">
          <svg
            className="h-12 w-12 text-ink-black/20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              d="M12 6.036v.01M12 10v5M4.5 18.5h15M8 3h8l2 4H6l2-4z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7 8h10M7 11h7M7 14h4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-ink-black/60 tracking-wider mb-2">
          暂无作品
        </h3>
        <p className="text-sm text-ink-black/40 tracking-wider">
          开始创作你的第一首诗词吧
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {works.map((work) => (
          <WorkCard
            key={work.poem_id}
            work={work}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
            onShare={onShare}
          />
        ))}
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <button
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="px-3 py-2 text-sm border border-ink-black/10 rounded-sm text-ink-black/60 hover:border-cinnabar/30 hover:text-cinnabar disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-ink-black/10 disabled:hover:text-ink-black/60 transition-all duration-200"
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>

          {Array.from({ length: pagination.totalPages }).map((_, i) => {
            const pageNum = i + 1;
            const isCurrent = pageNum === pagination.page;
            const isNear = Math.abs(pageNum - pagination.page) <= 2;

            if (!isNear && !isCurrent) {
              if (pageNum === 1 || pageNum === pagination.totalPages) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    className="px-3 py-2 text-sm border border-ink-black/10 rounded-sm text-ink-black/60 hover:border-cinnabar/30 hover:text-cinnabar transition-all duration-200"
                  >
                    {pageNum}
                  </button>
                );
              }
              if (Math.abs(pageNum - pagination.page) === 3) {
                return (
                  <span key={pageNum} className="px-1 text-ink-black/30">
                    ...
                  </span>
                );
              }
              return null;
            }

            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`px-3 py-2 text-sm border rounded-sm transition-all duration-200 ${
                  isCurrent
                    ? 'border-cinnabar bg-cinnabar/10 text-cinnabar'
                    : 'border-ink-black/10 text-ink-black/60 hover:border-cinnabar/30 hover:text-cinnabar'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
            className="px-3 py-2 text-sm border border-ink-black/10 rounded-sm text-ink-black/60 hover:border-cinnabar/30 hover:text-cinnabar disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-ink-black/10 disabled:hover:text-ink-black/60 transition-all duration-200"
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>

          <span className="ml-4 text-xs text-ink-black/40">
            共 {pagination.total} 条
          </span>
        </div>
      )}
    </div>
  );
}
