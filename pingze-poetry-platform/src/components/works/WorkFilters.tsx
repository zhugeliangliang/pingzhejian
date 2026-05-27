import type { PoemType } from '../../api/client';
import Input from '../Input';

export interface WorkFilterState {
  poemType?: PoemType | '全部';
  search?: string;
  sortBy?: 'created_at' | 'updated_at' | 'like_count';
  sortOrder?: 'ASC' | 'DESC';
}

interface WorkFiltersProps {
  filters: WorkFilterState;
  onChange: (filters: WorkFilterState) => void;
  onReset: () => void;
}

const poemTypes: (PoemType | '全部')[] = ['全部', '诗', '词', '曲', '赋'];

const sortOptions = [
  { value: 'created_at_desc', label: '最新创建' },
  { value: 'created_at_asc', label: '最早创建' },
  { value: 'updated_at_desc', label: '最近更新' },
  { value: 'updated_at_asc', label: '最早更新' },
  { value: 'like_count_desc', label: '最多点赞' },
  { value: 'like_count_asc', label: '最少点赞' },
];

export default function WorkFilters({
  filters,
  onChange,
  onReset,
}: WorkFiltersProps) {
  const hasActiveFilters =
    (filters.poemType && filters.poemType !== '全部') ||
    filters.search ||
    filters.sortBy;

  const handleTypeChange = (type: PoemType | '全部') => {
    onChange({
      ...filters,
      poemType: type === '全部' ? undefined : type,
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...filters,
      search: e.target.value || undefined,
    });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (!value) {
      onChange({
        ...filters,
        sortBy: undefined,
        sortOrder: undefined,
      });
      return;
    }
    const [sortBy, sortOrder] = value.split('_') as [
      'created_at' | 'updated_at' | 'like_count',
      'ASC' | 'DESC',
    ];
    onChange({
      ...filters,
      sortBy,
      sortOrder,
    });
  };

  const getSortValue = (): string => {
    if (!filters.sortBy) return '';
    return `${filters.sortBy}_${filters.sortOrder || 'DESC'}`;
  };

  const handleReset = () => {
    onReset();
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            value={filters.search || ''}
            onChange={handleSearchChange}
            placeholder="搜索作品标题或内容..."
          />
        </div>

        <div className="w-full sm:w-48">
          <select
            value={getSortValue()}
            onChange={handleSortChange}
            className="w-full px-4 py-3 bg-transparent text-ink-black text-sm tracking-wider border border-ink-black/20 hover:border-ink-black/30 rounded-sm transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-cinnabar/30 focus:border-cinnabar"
          >
            <option value="">排序方式</option>
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-ink-black/50 tracking-wider">体裁:</span>
        {poemTypes.map((type) => (
          <button
            key={type}
            onClick={() => handleTypeChange(type)}
            className={`px-3 py-1.5 text-xs rounded-sm border transition-all duration-200 ${
              (type === '全部' && !filters.poemType) || filters.poemType === type
                ? 'border-cinnabar bg-cinnabar/10 text-cinnabar'
                : 'border-ink-black/20 text-ink-black/60 hover:border-ink-black/40'
            }`}
          >
            {type}
          </button>
        ))}

        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="ml-2 px-3 py-1.5 text-xs text-cinnabar border border-cinnabar/20 hover:border-cinnabar/40 hover:bg-cinnabar/5 rounded-sm transition-all duration-200"
          >
            重置筛选
          </button>
        )}
      </div>
    </div>
  );
}
