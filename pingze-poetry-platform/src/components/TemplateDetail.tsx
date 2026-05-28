import type { TemplateData } from '../data/templates';

interface TemplateDetailProps {
  template: TemplateData;
  onClose: () => void;
  onUse: (template: TemplateData) => void;
}

export default function TemplateDetail({ template, onClose, onUse }: TemplateDetailProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-ink-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative z-10 w-full max-w-2xl max-h-[90vh] mx-4 bg-rice-paper
                    rounded-sm shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="shrink-0 px-6 py-5 border-b border-ink-black/10 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-2xl font-bold text-ink-black tracking-wider">
                {template.name}
              </h2>
              <span
                className={`text-xs px-2 py-0.5 border rounded-sm
                  ${template.type === '词牌'
                    ? 'border-cinnabar/30 text-cinnabar bg-cinnabar/5'
                    : 'border-indigo-blue/30 text-indigo-blue bg-indigo-blue/5'
                  }`}
              >
                {template.type}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm text-ink-black/50">
              {template.dynasty && <span>{template.dynasty}</span>}
              <span>{template.lineCount}句</span>
              <span>{template.totalChars}字</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 p-1 text-ink-black/40 hover:text-ink-black transition-colors"
            aria-label="关闭"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* Description */}
          <section className="mb-6">
            <h3 className="text-sm font-medium text-ink-black/60 mb-2">简介</h3>
            <p className="text-sm text-ink-black/80 leading-relaxed">{template.description}</p>
          </section>

          {/* Structure */}
          {template.structure && (
            <section className="mb-6">
              <h3 className="text-sm font-medium text-ink-black/60 mb-2">结构</h3>
              <p className="text-sm text-ink-black/80 leading-relaxed">{template.structure}</p>
            </section>
          )}

          {/* Rhyme Scheme */}
          <section className="mb-6">
            <h3 className="text-sm font-medium text-ink-black/60 mb-2">用韵</h3>
            <p className="text-sm text-ink-black/80 leading-relaxed">{template.rhymeScheme}</p>
          </section>

          {/* Pingze Pattern */}
          <section className="mb-6">
            <h3 className="text-sm font-medium text-ink-black/60 mb-3">平仄格律</h3>
            <div className="bg-white border border-ink-black/10 rounded-sm p-4">
              {template.pingzePattern.map((line, i) => (
                <div key={i} className="flex items-baseline gap-2 mb-1 last:mb-0">
                  <span className="text-xs text-ink-black/30 w-5 shrink-0 text-right">
                    {i + 1}
                  </span>
                  <span className="text-base text-indigo-blue/90 font-mono tracking-widest">
                    {line}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Example Poem */}
          {template.examplePoem && (
            <section className="mb-6">
              <h3 className="text-sm font-medium text-ink-black/60 mb-3">示例作品</h3>
              <div className="bg-white border border-ink-black/10 rounded-sm p-5">
                <p className="text-sm text-ink-black/80 whitespace-pre-line leading-loose tracking-wider">
                  {template.examplePoem}
                </p>
              </div>
            </section>
          )}
        </div>

        {/* Footer Actions */}
        <div className="shrink-0 px-6 py-4 border-t border-ink-black/10 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm border border-ink-black/15 rounded-sm
                       text-ink-black/70 hover:bg-ink-black/5 transition-colors"
          >
            关闭
          </button>
          <button
            onClick={() => onUse(template)}
            className="px-5 py-2 text-sm bg-cinnabar text-white rounded-sm
                       hover:bg-cinnabar/90 transition-colors shadow-sm"
          >
            使用此模板
          </button>
        </div>
      </div>
    </div>
  );
}
