import { useState, useCallback, useEffect } from 'react';
import type { TemplateData } from '../data/templates';
import PoetryEditor from '../components/editor/PoetryEditor';
import TemplateSelector from '../components/editor/TemplateSelector';
import SaveBar from '../components/editor/SaveBar';
import PageTransition from '../components/common/PageTransition';
import { useAutoSave } from '../hooks/useAutoSave';
import { usePingzeAnalysis } from '../hooks/usePingzeAnalysis';
import { useToast } from '../hooks/useToast';

export default function CreatePage() {
  const { success, error: showError, info } = useToast();
  const [template, setTemplate] = useState<TemplateData | null>(null);
  const [title, setTitle] = useState('');
  const [lines, setLines] = useState<string[]>(['', '', '', '']);
  const [showSelector, setShowSelector] = useState(true);
  const [showSidePanel, setShowSidePanel] = useState(true);
  const [templateLoading, setTemplateLoading] = useState(false);

  const saveKey = template ? `editor_${template.id}` : 'editor_free';
  const autoSave = useAutoSave({
    data: { title, lines, templateId: template?.id || null },
    key: saveKey,
    delay: 2000,
  });

  const templatePattern = template ? template.pingzePattern.join('\n') : '';
  const { rhymeAnalysis, errors, isMatch } = usePingzeAnalysis(
    lines,
    template ? templatePattern : ''
  );

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`pingze_${saveKey}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.title !== undefined) setTitle(parsed.title);
        if (Array.isArray(parsed.lines) && parsed.lines.length > 0) setLines(parsed.lines);
      }
    } catch {
      // ignore
    }
  }, [saveKey]);

  useEffect(() => {
    if (template) {
      setTemplateLoading(true);
      const timer = setTimeout(() => {
        setLines(Array(template.lineCount).fill(''));
        setTitle('');
        setShowSelector(false);
        setTemplateLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [template]);

  const handleSave = useCallback(() => {
    try {
      const data = { title, lines, templateId: template?.id, savedAt: new Date().toISOString() };
      localStorage.setItem(`pingze_saved_${Date.now()}`, JSON.stringify(data));
      success('作品已保存');
    } catch {
      showError('保存失败，请重试');
    }
  }, [title, lines, template, success, showError]);

  const handleTemplateSelect = useCallback((selected: TemplateData | null) => {
    setTemplate(selected);
    setShowSelector(false);
    if (!selected) {
      setLines(['']);
      setTitle('');
    }
  }, []);

  const handleShare = useCallback(() => {
    if (navigator.clipboard && title && lines.some((l) => l.trim())) {
      const text = `${title}\n\n${lines.filter((l) => l.trim()).join('\n')}`;
      navigator.clipboard.writeText(text).then(() => {
        success('已复制到剪贴板');
      });
    } else {
      info('请先输入内容');
    }
  }, [title, lines, success, info]);

  const handleExport = useCallback(() => {
    if (!title && !lines.some((l) => l.trim())) {
      info('请先输入内容');
      return;
    }
    const content = `${title}\n\n${lines.filter((l) => l.trim()).join('\n')}\n\n---\n由「平仄间」创作`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title || '未命名'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    success('已导出');
  }, [title, lines, success, info]);

  const handleEditorSave = useCallback(
    (data: { title: string; lines: string[]; template: TemplateData | null }) => {
      setTitle(data.title);
      setLines(data.lines);
      handleSave();
    },
    [handleSave]
  );

  const totalChars = lines.reduce((sum, line) => {
    return sum + line.replace(/[，。.!！？、；：""''（）【】《》\s]/g, '').length;
  }, 0);

  const rhymeGroups = rhymeAnalysis?.rhymeGroups || [];
  const rhymeChars = rhymeGroups.flat();

  const writingTips = template
    ? [
        { title: '结构', text: template.structure || '' },
        { title: '用韵', text: template.rhymeScheme },
        { title: '简介', text: template.description },
      ]
    : [
        { title: '提示', text: '自由创作模式下，您可以随意书写，系统仍会分析平仄。' },
        { title: '快捷键', text: 'Ctrl+S 保存 · Ctrl+Enter 添加新行' },
      ];

  return (
    <PageTransition>
      <div className="min-h-screen pb-20">
        {showSelector && (
          <TemplateSelector
            onSelect={handleTemplateSelect}
            onClose={() => setShowSelector(false)}
          />
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex gap-6">
            <div className="flex-1 min-w-0">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {!template ? (
                    <button
                      onClick={() => setShowSelector(true)}
                      className="px-4 py-2 text-sm border border-cinnabar/30 text-cinnabar rounded-sm
                                 hover:bg-cinnabar/5 transition-colors"
                    >
                      选择模板
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-ink-black/60">当前：</span>
                      <span className="text-sm font-medium text-ink-black">{template.name}</span>
                      <span className="text-xs px-1.5 py-0.5 border border-cinnabar/30 text-cinnabar rounded-sm bg-cinnabar/5">
                        {template.type}
                      </span>
                      <button
                        onClick={() => setShowSelector(true)}
                        className="text-xs text-ink-black/40 hover:text-cinnabar ml-1 transition-colors"
                      >
                        更换
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-ink-black/30">
                    {lines.filter((l) => l.trim()).length}句 · {totalChars}字
                  </span>
                  <button
                    onClick={() => setShowSidePanel(!showSidePanel)}
                    className="p-1.5 text-ink-black/30 hover:text-ink-black/60 transition-colors rounded-sm"
                    title={showSidePanel ? '隐藏侧栏' : '显示侧栏'}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 6a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zm0 6a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" />
                    </svg>
                  </button>
                </div>
              </div>

              {templateLoading && (
                <div className="mb-4 p-6 bg-white/60 border border-ink-black/8 rounded-sm animate-pulse">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-cinnabar/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-cinnabar/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-cinnabar/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                    <span className="text-xs text-ink-black/40 ml-2">正在加载模板「{template?.name}」...</span>
                  </div>
                </div>
              )}

              <div className="bg-rice-paper border border-ink-black/5 rounded-sm shadow-sm p-6 sm:p-8 transition-all duration-300">
                <PoetryEditor
                  template={template}
                  onSave={handleEditorSave}
                  initialData={{ title, lines }}
                />
              </div>

              {template && lines.some((l) => l.trim()) && (
                <div className="mt-4 px-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-ink-black/40">格律匹配：</span>
                      {isMatch ? (
                        <span className="text-xs text-green-700/70 font-medium">完全符合</span>
                      ) : errors.length > 0 ? (
                        <span className="text-xs text-red-600/70 font-medium">{errors.length}处不合</span>
                      ) : (
                        <span className="text-xs text-ink-black/30">--</span>
                      )}
                    </div>

                    {rhymeChars.length > 0 && (
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-ink-black/40">韵脚：</span>
                        <div className="flex gap-1">
                          {rhymeGroups.map((group, i) => (
                            <span
                              key={i}
                              className="text-xs px-1.5 py-0.5 bg-cinnabar/10 text-cinnabar/80 rounded-sm border border-cinnabar/20"
                            >
                              {group.join('，')}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className={`w-72 shrink-0 transition-all duration-300 ${showSidePanel ? 'block' : 'hidden lg:block lg:w-0 lg:overflow-hidden'}`}>
              <div className="sticky top-24 space-y-4">
                {template && (
                  <div className="bg-white/60 border border-ink-black/8 rounded-sm p-4">
                    <h3 className="text-sm font-medium text-ink-black/70 mb-3 tracking-wider">模板信息</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-ink-black/40">名称</span>
                        <span className="text-xs text-ink-black/70">{template.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-ink-black/40">句数</span>
                        <span className="text-xs text-ink-black/70">{template.lineCount}句</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-ink-black/40">字数</span>
                        <span className="text-xs text-ink-black/70">{template.totalChars}字</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-ink-black/40">用韵</span>
                        <span className="text-xs text-ink-black/70">{template.rhymeScheme}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-white/60 border border-ink-black/8 rounded-sm p-4">
                  <h3 className="text-sm font-medium text-ink-black/70 mb-3 tracking-wider">写作提示</h3>
                  <div className="space-y-3">
                    {writingTips.map((tip, i) => (
                      <div key={i}>
                        <p className="text-xs font-medium text-ink-black/60 mb-1">{tip.title}</p>
                        <p className="text-xs text-ink-black/50 leading-relaxed">{tip.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {template && template.examplePoem && (
                  <div className="bg-white/60 border border-ink-black/8 rounded-sm p-4">
                    <h3 className="text-sm font-medium text-ink-black/70 mb-3 tracking-wider">示例作品</h3>
                    <p className="text-xs text-ink-black/60 whitespace-pre-line leading-loose tracking-wider">
                      {template.examplePoem}
                    </p>
                  </div>
                )}

                <div className="bg-white/60 border border-ink-black/8 rounded-sm p-4">
                  <h3 className="text-sm font-medium text-ink-black/70 mb-3 tracking-wider">快捷键</h3>
                  <div className="space-y-2 text-xs text-ink-black/50">
                    <div className="flex justify-between">
                      <span>保存</span>
                      <kbd className="px-1.5 py-0.5 bg-ink-black/5 rounded-sm text-ink-black/60 font-mono">
                        Ctrl+S
                      </kbd>
                    </div>
                    <div className="flex justify-between">
                      <span>添加新行</span>
                      <kbd className="px-1.5 py-0.5 bg-ink-black/5 rounded-sm text-ink-black/60 font-mono">
                        Ctrl+Enter
                      </kbd>
                    </div>
                  </div>
                </div>

                {template && template.pingzePattern && (
                  <div className="bg-white/60 border border-ink-black/8 rounded-sm p-4">
                    <h3 className="text-sm font-medium text-ink-black/70 mb-3 tracking-wider">平仄格律</h3>
                    <div className="space-y-1">
                      {template.pingzePattern.map((line, i) => (
                        <div key={i} className="flex items-baseline gap-2">
                          <span className="text-xs text-ink-black/25 w-4 text-right">{i + 1}</span>
                          <span className="text-xs text-indigo-blue/70 font-mono tracking-wider">
                            {line}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <SaveBar
          saveStatus={autoSave.status}
          lastSaved={autoSave.lastSaved}
          onSave={handleSave}
          onShare={handleShare}
          onExport={handleExport}
          poemTitle={title}
          templateName={template?.name}
        />
      </div>
    </PageTransition>
  );
}
