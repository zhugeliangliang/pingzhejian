import { useState, useEffect, useCallback } from 'react';
import type { Poem, PoemVersion } from '../../api/client';
import Modal from '../Modal';
import Badge from '../Badge';
import Button from '../Button';
import { analyzePoem, type PoemAnalysis } from '../../utils/pingze-detector';
import VersionHistory from './VersionHistory';

interface WorkDetailProps {
  work: Poem | null;
  onClose: () => void;
  onEdit: (work: Poem) => void;
  onDelete?: (work: Poem) => void;
  fetchWorkVersions?: (poemId: string) => Promise<PoemVersion[]>;
}

const poemTypeLabels: Record<string, string> = {
  '诗': '诗',
  '词': '词',
  '曲': '曲',
  '赋': '赋',
};

export default function WorkDetail({
  work,
  onClose,
  onEdit,
  onDelete,
  fetchWorkVersions,
}: WorkDetailProps) {
  const [showVersions, setShowVersions] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showPingze, setShowPingze] = useState(false);
  const [versions, setVersions] = useState<PoemVersion[]>([]);
  const [poemAnalysis, setPoemAnalysis] = useState<PoemAnalysis | null>(null);

  useEffect(() => {
    if (work) {
      setShowVersions(false);
      setShowShare(false);
      setVersions([]);

      const lines = work.content.split('\n').filter((line: string) => line.trim().length > 0);
      const analysis = analyzePoem(lines);
      setPoemAnalysis(analysis);
    }
  }, [work]);

  const handleViewVersions = useCallback(async () => {
    if (!work || !fetchWorkVersions) return;
    setShowVersions(true);
    try {
      const v = await fetchWorkVersions(work.poem_id);
      setVersions(v);
    } catch {
      setVersions([]);
    }
  }, [work, fetchWorkVersions]);

  const handleRestoreVersion = useCallback((version: PoemVersion) => {
    if (!work) return;
    onEdit({
      ...work,
      content: version.content,
      title: version.title || work.title,
    });
    setShowVersions(false);
  }, [work, onEdit]);

  const handleShare = useCallback(async () => {
    if (!work) return;
    try {
      await navigator.clipboard.writeText(`${work.title}\n\n${work.content}`);
      setShowShare(true);
      setTimeout(() => setShowShare(false), 2000);
    } catch {
      setShowShare(true);
      setTimeout(() => setShowShare(false), 2000);
    }
  }, [work]);

  const handleDelete = useCallback(() => {
    if (!work || !onDelete) return;
    onDelete(work);
    onClose();
  }, [work, onDelete, onClose]);

  if (!work) return null;

  const createdDate = new Date(work.created_at);
  const updatedDate = new Date(work.updated_at);
  const formattedCreated = createdDate.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  const formattedUpdated = updatedDate.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Modal isOpen={!!work} onClose={onClose} title={work.title}>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Badge variant="cinnabar">
            {poemTypeLabels[work.poem_type] || work.poem_type}
          </Badge>
          {work.template_name && (
            <Badge variant="indigo">
              {work.template_name}
            </Badge>
          )}
          {work.is_published && (
            <Badge variant="default">
              已发布
            </Badge>
          )}
          <span className="ml-auto flex items-center gap-1 text-xs text-ink-black/40">
            <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
            </svg>
            {work.like_count}
          </span>
        </div>

        <div className="border-t border-b border-ink-black/8 py-4">
          <div className="font-serif text-base leading-loose tracking-wider whitespace-pre-line text-ink-black">
            {work.content.split('\n').map((line: string, lineIndex: number) => (
              <div key={lineIndex} className="mb-1">
                {showPingze && poemAnalysis?.lines[lineIndex] ? (
                  <span>
                    {poemAnalysis.lines[lineIndex].chars.map((char, charIndex) => (
                      <span
                        key={charIndex}
                        className={`inline-block text-center ${
                          char.pingze === '平'
                            ? 'text-indigo-blue'
                            : char.pingze === '仄'
                            ? 'text-cinnabar'
                            : char.pingze === '标点'
                            ? 'text-ink-black/40'
                            : 'text-ink-black/30'
                        }`}
                        title={`${char.pingze}${char.pinyin ? ` (${char.pinyin})` : ''}`}
                      >
                        {char.char}
                      </span>
                    ))}
                  </span>
                ) : (
                  <span>{line}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {poemAnalysis && (
          <button
            onClick={() => setShowPingze(!showPingze)}
            className="text-xs text-ink-black/50 hover:text-cinnabar transition-colors duration-200"
          >
            {showPingze ? '隐藏平仄' : '显示平仄'}
          </button>
        )}

        <div className="text-xs text-ink-black/40 space-y-1">
          <p>创建时间: {formattedCreated}</p>
          <p>更新时间: {formattedUpdated}</p>
          {work.version > 1 && <p>版本: v{work.version}</p>}
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => onEdit(work)}
          >
            编辑
          </Button>
          {fetchWorkVersions && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleViewVersions}
            >
              版本历史
            </Button>
          )}
          <Button
            variant="secondary"
            size="sm"
            onClick={handleShare}
          >
            分享
          </Button>
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
            >
              删除
            </Button>
          )}
        </div>

        {showShare && (
          <div className="text-xs text-indigo-blue bg-indigo-blue/5 border border-indigo-blue/20 rounded-sm px-3 py-2 animate-slide-up">
            已复制到剪贴板
          </div>
        )}

        {showVersions && (
          <VersionHistory
            versions={versions}
            currentVersionId={work.version.toString()}
            onRestore={handleRestoreVersion}
          />
        )}
      </div>
    </Modal>
  );
}
