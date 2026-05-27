import type { TemplateData } from '../data/templates';

interface TemplateCardProps {
  template: TemplateData;
  onSelect: (template: TemplateData) => void;
}

export default function TemplateCard({ template, onSelect }: TemplateCardProps) {
  const previewPattern = template.pingzePattern.slice(0, 2).join('，') + '...';

  return (
    <button
      onClick={() => onSelect(template)}
      className="w-full text-left p-5 border border-ink-black/10 rounded-sm bg-rice-paper
                 hover:border-cinnabar/40 hover:shadow-md transition-all duration-200
                 focus:outline-none focus:ring-2 focus:ring-cinnabar/30 group"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-medium text-ink-black tracking-wider group-hover:text-cinnabar transition-colors">
          {template.name}
        </h3>
        <span
          className={`shrink-0 text-xs px-2 py-0.5 border rounded-sm ml-2
            ${template.type === '词牌'
              ? 'border-cinnabar/30 text-cinnabar bg-cinnabar/5'
              : 'border-indigo-blue/30 text-indigo-blue bg-indigo-blue/5'
            }`}
        >
          {template.type}
        </span>
      </div>

      <div className="flex items-center gap-4 mb-3 text-xs text-ink-black/50">
        {template.dynasty && (
          <span className="px-1.5 py-0.5 bg-ink-black/5 rounded-sm">{template.dynasty}</span>
        )}
        <span>{template.lineCount}句</span>
        <span>{template.totalChars}字</span>
      </div>

      <p className="text-sm text-ink-black/60 mb-3 leading-relaxed line-clamp-2">
        {template.description}
      </p>

      <div className="pt-3 border-t border-ink-black/5">
        <p className="text-xs text-ink-black/40 mb-1">格律：</p>
        <p className="text-sm text-indigo-blue/80 font-mono leading-relaxed truncate">
          {previewPattern}
        </p>
      </div>
    </button>
  );
}
