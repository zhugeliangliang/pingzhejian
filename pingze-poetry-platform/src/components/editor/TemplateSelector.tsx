import { useState, useMemo } from 'react';
import type { TemplateData } from '../../data/templates';
import { templates } from '../../data/templates';

interface TemplateSelectorProps {
  onSelect: (template: TemplateData | null) => void;
  onClose: () => void;
}

type FilterType = '全部' | '词牌' | '诗体';

export default function TemplateSelector({ onSelect, onClose }: TemplateSelectorProps) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('全部');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateData | null>(null);

  const filteredTemplates = useMemo(() => {
    return templates.filter((t) => {
      const matchesFilter = filter === '全部' || t.type === filter;
      const matchesSearch =
        search.length === 0 ||
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [filter, search]);

  const handleSelect = (template: TemplateData) => {
    setSelectedTemplate(template);
  };

  const handleConfirm = () => {
    if (selectedTemplate) {
      onSelect(selectedTemplate);
    }
  };

  const handleFreeForm = () => {
    onSelect(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-ink-black/50 backdrop-blur-sm" />

      <div
        className="relative z-10 w-full max-w-3xl max-h-[85vh] mx-4 bg-rice-paper
                    rounded-sm shadow-2xl overflow-hidden flex flex-col animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="shrink-0 px-6 py-5 border-b border-ink-black/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-ink-black tracking-wider">
              选择模板
            </h2>
            <button
              onClick={onClose}
              className="p-1 text-ink-black/40 hover:text-ink-black transition-colors"
              aria-label="关闭"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="搜索词牌名、诗体..."
                className="w-full pl-9 pr-4 py-2 bg-white/60 border border-ink-black/10 rounded-sm
                           text-sm text-ink-black placeholder-ink-black/30
                           focus:outline-none focus:ring-1 focus:ring-cinnabar/30 focus:border-cinnabar"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-black/30" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>

            <div className="flex gap-1">
              {(['全部', '词牌', '诗体'] as FilterType[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 text-xs rounded-sm border transition-colors duration-200 ${
                    filter === f
                      ? 'border-cinnabar/40 bg-cinnabar/10 text-cinnabar'
                      : 'border-ink-black/15 text-ink-black/50 hover:border-ink-black/30'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleSelect(template)}
                className={`text-left p-4 border rounded-sm transition-all duration-200 group ${
                  selectedTemplate?.id === template.id
                    ? 'border-cinnabar bg-cinnabar/5 shadow-sm'
                    : 'border-ink-black/10 hover:border-ink-black/25 hover:shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className={`text-base font-medium tracking-wider transition-colors ${
                    selectedTemplate?.id === template.id
                      ? 'text-cinnabar'
                      : 'text-ink-black group-hover:text-cinnabar/80'
                  }`}>
                    {template.name}
                  </h3>
                  <span
                    className={`shrink-0 text-xs px-1.5 py-0.5 border rounded-sm ml-2 ${
                      template.type === '词牌'
                        ? 'border-cinnabar/30 text-cinnabar bg-cinnabar/5'
                        : 'border-indigo-blue/30 text-indigo-blue bg-indigo-blue/5'
                    }`}
                  >
                    {template.type}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-ink-black/40 mb-2">
                  {template.dynasty && <span>{template.dynasty}</span>}
                  <span>{template.lineCount}句</span>
                  <span>{template.totalChars}字</span>
                </div>

                <p className="text-xs text-ink-black/50 leading-relaxed line-clamp-2">
                  {template.description}
                </p>

                {selectedTemplate?.id === template.id && (
                  <div className="mt-3 pt-3 border-t border-cinnabar/10">
                    <div className="text-xs text-ink-black/40 mb-1">格律：</div>
                    <div className="text-sm text-indigo-blue/70 font-mono tracking-wider leading-relaxed">
                      {template.pingzePattern.slice(0, 2).join('\n')}
                      {template.pingzePattern.length > 2 && '...'}
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12 text-ink-black/30">
              <p className="text-sm">未找到匹配的模板</p>
            </div>
          )}
        </div>

        <div className="shrink-0 px-6 py-4 border-t border-ink-black/10 flex items-center justify-between gap-3">
          <button
            onClick={handleFreeForm}
            className="px-5 py-2.5 text-sm border border-ink-black/15 rounded-sm
                       text-ink-black/70 hover:border-indigo-blue/40 hover:text-indigo-blue
                       transition-colors"
          >
            自由创作
          </button>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-sm border border-ink-black/15 rounded-sm
                         text-ink-black/70 hover:bg-ink-black/5 transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedTemplate}
              className="px-5 py-2.5 text-sm bg-cinnabar text-white rounded-sm
                         hover:bg-cinnabar/90 transition-colors shadow-sm
                         disabled:opacity-40 disabled:cursor-not-allowed"
            >
              使用此模板
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
