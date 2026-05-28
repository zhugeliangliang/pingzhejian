import { useMemo } from 'react';
import type { TemplateData } from '../data/templates';
import TemplateCard from './TemplateCard';

interface TemplateListProps {
  templates: TemplateData[];
  onSelect: (template: TemplateData) => void;
  search: string;
  onSearchChange: (value: string) => void;
  typeFilter: 'all' | '词牌' | '诗体';
  onTypeFilterChange: (value: 'all' | '词牌' | '诗体') => void;
  dynastyFilter: string;
  onDynastyFilterChange: (value: string) => void;
  sortOption: SortOption;
  onSortChange: (value: SortOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (value: ViewMode) => void;
  onReset: () => void;
}

export type SortOption = 'name' | 'chars-asc' | 'chars-desc' | 'lines';
export type ViewMode = 'grid' | 'list';

export default function TemplateList({
  templates,
  onSelect,
  search,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  dynastyFilter,
  onDynastyFilterChange,
  sortOption,
  onSortChange,
  viewMode,
  onViewModeChange,
  onReset,
}: TemplateListProps) {
  const dynasties = useMemo(() => {
    const set = new Set(templates.map((t) => t.dynasty).filter(Boolean));
    return Array.from(set).sort();
  }, [templates]);

  const { filtered, totalCount } = useMemo(() => {
    const result = templates.filter((t) => {
      if (typeFilter !== 'all' && t.type !== typeFilter) return false;
      if (dynastyFilter !== 'all' && t.dynasty !== dynastyFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !t.name.toLowerCase().includes(q) &&
          !t.description.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });

    result.sort((a, b) => {
      switch (sortOption) {
        case 'name':
          return a.name.localeCompare(b.name, 'zh');
        case 'chars-asc':
          return a.totalChars - b.totalChars;
        case 'chars-desc':
          return b.totalChars - a.totalChars;
        case 'lines':
          return a.lineCount - b.lineCount;
        default:
          return 0;
      }
    });

    return { filtered: result, totalCount: templates.length };
  }, [templates, typeFilter, dynastyFilter, search, sortOption]);

  const hasActiveFilters =
    search || typeFilter !== 'all' || dynastyFilter !== 'all';

  return (
    <div>
      <div className="mb-6 p-4 border border-ink-black/10 rounded-sm bg-rice-paper">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs text-ink-black/50 mb-1">搜索</label>
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="搜索词牌名或描述..."
              className="w-full px-3 py-2 text-sm border border-ink-black/15 rounded-sm
                         bg-white focus:outline-none focus:ring-1 focus:ring-cinnabar/40
                         placeholder:text-ink-black/30"
            />
          </div>

          <div>
            <label className="block text-xs text-ink-black/50 mb-1">类型</label>
            <select
              value={typeFilter}
              onChange={(e) => onTypeFilterChange(e.target.value as typeof typeFilter)}
              className="px-3 py-2 text-sm border border-ink-black/15 rounded-sm bg-white
                         focus:outline-none focus:ring-1 focus:ring-cinnabar/40 cursor-pointer"
            >
              <option value="all">全部</option>
              <option value="词牌">词牌</option>
              <option value="诗体">诗体</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-ink-black/50 mb-1">朝代</label>
            <select
              value={dynastyFilter}
              onChange={(e) => onDynastyFilterChange(e.target.value)}
              className="px-3 py-2 text-sm border border-ink-black/15 rounded-sm bg-white
                         focus:outline-none focus:ring-1 focus:ring-cinnabar/40 cursor-pointer"
            >
              <option value="all">全部</option>
              {dynasties.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-ink-black/50 mb-1">排序</label>
            <select
              value={sortOption}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="px-3 py-2 text-sm border border-ink-black/15 rounded-sm bg-white
                         focus:outline-none focus:ring-1 focus:ring-cinnabar/40 cursor-pointer"
            >
              <option value="name">名称</option>
              <option value="chars-asc">字数升序</option>
              <option value="chars-desc">字数降序</option>
              <option value="lines">句数</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-ink-black/50 mb-1">视图</label>
            <div className="flex border border-ink-black/15 rounded-sm overflow-hidden">
              <button
                onClick={() => onViewModeChange('grid')}
                className={`px-3 py-2 text-sm transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-cinnabar text-white'
                    : 'bg-white text-ink-black/60 hover:bg-ink-black/5'
                }`}
                title="网格视图"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                </svg>
              </button>
              <button
                onClick={() => onViewModeChange('list')}
                className={`px-3 py-2 text-sm transition-colors ${
                  viewMode === 'list'
                    ? 'bg-cinnabar text-white'
                    : 'bg-white text-ink-black/60 hover:bg-ink-black/5'
                }`}
                title="列表视图"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="8" y1="6" x2="21" y2="6" />
                  <line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" />
                  <line x1="3" y1="6" x2="3.01" y2="6" />
                  <line x1="3" y1="12" x2="3.01" y2="12" />
                  <line x1="3" y1="18" x2="3.01" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="mt-3 pt-3 border-t border-ink-black/5 flex items-center justify-between">
            <span className="text-xs text-ink-black/30">
              Showing {filtered.length} of {totalCount} templates
            </span>
            <button
              onClick={onReset}
              className="text-xs text-cinnabar hover:text-cinnabar/80 transition-colors"
            >
              重置筛选
            </button>
          </div>
        )}
      </div>

      <p className="text-xs text-ink-black/40 mb-4">
        共 {totalCount} 个模板 · 显示 {filtered.length} 个
        {search && `（搜索「${search}」）`}
      </p>

      <div className="transition-all duration-300">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-ink-black/40 animate-fade-in">
            <svg
              className="w-16 h-16 mx-auto mb-4 text-ink-black/10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <p className="text-lg mb-2">未找到匹配的模板</p>
            <p className="text-sm">请调整筛选条件后重试</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((t) => (
              <TemplateCard key={t.id} template={t} onSelect={onSelect} />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((t) => (
              <TemplateCard key={t.id} template={t} onSelect={onSelect} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
