import { useState, useCallback, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { templates } from '../data/templates';
import type { TemplateData } from '../data/templates';
import TemplateList, { type SortOption, type ViewMode } from '../components/TemplateList';
import TemplateDetail from '../components/TemplateDetail';
import PageTransition from '../components/common/PageTransition';
import Button from '../components/Button';

const poetryFormInfo = [
  {
    title: '什么是词牌？',
    content: '词牌是词的曲调名称，规定了词的句数、字数、平仄和韵脚。每个词牌都有固定的格律格式，如《水调歌头》《满江红》等。词起源于隋唐，兴盛于宋代，是中国古典诗歌的重要形式。',
  },
  {
    title: '什么是诗体？',
    content: '诗体指诗歌的体裁形式，包括绝句（四句）、律诗（八句）等近体诗，以及古体诗。近体诗讲究平仄对仗，格律严谨；古体诗则相对自由。五言和七言是最常见的句式。',
  },
  {
    title: '平仄是什么？',
    content: '平仄是汉语声调的分类。平声包括现代的一声（阴平）和二声（阳平），仄声包括三声（上声）和四声（去声），以及古入声字。平仄交替使用，形成诗词的音律美感。',
  },
  {
    title: '押韵规则',
    content: '诗词押韵是指在特定句末使用韵母相同或相近的字。近体诗一般押平声韵，一韵到底；词则根据词牌规定，有的押平韵，有的押仄韵，有的换韵。',
  },
];

const quickStartSteps = [
  { step: '1', title: '选择体裁', desc: '在模板库中选择诗体或词牌，也可以自由创作' },
  { step: '2', title: '填写内容', desc: '根据格律提示逐句填写，系统会实时检测平仄' },
  { step: '3', title: '保存分享', desc: '完成后保存作品，支持导出文本或生成诗词卡片' },
];

function filtersToQueryParams(state: {
  search: string;
  typeFilter: string;
  dynastyFilter: string;
  sortOption: string;
  viewMode: string;
}): Record<string, string> {
  const params: Record<string, string> = {};
  if (state.search) params.q = state.search;
  if (state.typeFilter !== 'all') params.type = state.typeFilter;
  if (state.dynastyFilter !== 'all') params.dynasty = state.dynastyFilter;
  if (state.sortOption !== 'name') params.sort = state.sortOption;
  if (state.viewMode !== 'grid') params.view = state.viewMode;
  return params;
}

function queryParamsToState(params: URLSearchParams) {
  return {
    search: params.get('q') || '',
    typeFilter: (params.get('type') as '词牌' | '诗体' | 'all') || 'all',
    dynastyFilter: params.get('dynasty') || 'all',
    sortOption: (params.get('sort') as SortOption) || 'name',
    viewMode: (params.get('view') as ViewMode) || 'grid',
  };
}

export default function TemplatesPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selected, setSelected] = useState<TemplateData | null>(null);
  const [showLearnMore, setShowLearnMore] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const [search, setSearch] = useState(() => queryParamsToState(searchParams).search);
  const [typeFilter, setTypeFilter] = useState(() => queryParamsToState(searchParams).typeFilter);
  const [dynastyFilter, setDynastyFilter] = useState(() => queryParamsToState(searchParams).dynastyFilter);
  const [sortOption, setSortOption] = useState(() => queryParamsToState(searchParams).sortOption);
  const [viewMode, setViewMode] = useState(() => queryParamsToState(searchParams).viewMode);

  useEffect(() => {
    const params = filtersToQueryParams({ search, typeFilter, dynastyFilter, sortOption, viewMode });
    setSearchParams(params, { replace: true });
  }, [search, typeFilter, dynastyFilter, sortOption, viewMode, setSearchParams]);

  useEffect(() => {
    const state = queryParamsToState(searchParams);
    setSearch(state.search);
    setTypeFilter(state.typeFilter);
    setDynastyFilter(state.dynastyFilter);
    setSortOption(state.sortOption);
    setViewMode(state.viewMode);
  }, [searchParams]);

  const handleSelect = useCallback((template: TemplateData) => {
    setSelected(template);
  }, []);

  const handleClose = useCallback(() => {
    setSelected(null);
  }, []);

  const handleUse = useCallback((_template: TemplateData) => {
    navigate('/create');
    setSelected(null);
  }, [navigate]);

  const handleReset = useCallback(() => {
    setSearch('');
    setTypeFilter('all');
    setDynastyFilter('all');
    setSortOption('name');
    setViewMode('grid');
  }, []);

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-ink-black mb-2 tracking-wider">
            格律模板库
          </h1>
          <p className="text-ink-black/50 text-sm leading-relaxed">
            收录经典词牌与诗体格律，涵盖平仄、用韵、结构等创作要素，助您轻松掌握古典诗词格律。
          </p>
        </div>

        <div className="mb-8">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowLearnMore(!showLearnMore)}
            className="mb-4"
          >
            {showLearnMore ? '隐藏指南' : '📖 初学者快速入门'}
          </Button>

          {showLearnMore && (
            <div className="animate-fade-in p-6 border border-ink-black/10 rounded-sm bg-white/50">
              <h3 className="text-lg font-medium text-ink-black mb-4 tracking-wider">
                快速入门指南
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {quickStartSteps.map((s) => (
                  <div key={s.step} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-cinnabar/10 text-cinnabar flex items-center justify-center text-sm font-bold">
                      {s.step}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-ink-black mb-1">{s.title}</p>
                      <p className="text-xs text-ink-black/50">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-ink-black/8 pt-4">
                <h4 className="text-sm font-medium text-ink-black mb-3 tracking-wider">
                  诗词格律基础知识
                </h4>
                <div className="space-y-3">
                  {poetryFormInfo.map((info, i) => (
                    <div key={i} className="border border-ink-black/5 rounded-sm overflow-hidden">
                      <button
                        onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                        className="w-full flex items-center justify-between p-3 text-left text-sm font-medium text-ink-black/70 hover:bg-ink-black/5 transition-colors"
                      >
                        <span>{info.title}</span>
                        <svg
                          className={`w-4 h-4 text-ink-black/30 transition-transform duration-200 ${
                            expandedFaq === i ? 'rotate-180' : ''
                          }`}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                      {expandedFaq === i && (
                        <div className="px-3 pb-3 text-xs text-ink-black/50 leading-relaxed animate-fade-in">
                          {info.content}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <TemplateList
          templates={templates}
          onSelect={handleSelect}
          search={search}
          onSearchChange={setSearch}
          typeFilter={typeFilter}
          onTypeFilterChange={setTypeFilter}
          dynastyFilter={dynastyFilter}
          onDynastyFilterChange={setDynastyFilter}
          sortOption={sortOption}
          onSortChange={setSortOption}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onReset={handleReset}
        />

        {selected && (
          <TemplateDetail
            template={selected}
            onClose={handleClose}
            onUse={handleUse}
          />
        )}
      </div>
    </PageTransition>
  );
}
