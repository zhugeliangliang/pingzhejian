import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { Poem } from '../api/client';
import { useWorks } from '../hooks/useWorks';
import WorkFilters, { type WorkFilterState } from '../components/works/WorkFilters';
import WorkList from '../components/works/WorkList';
import WorkDetail from '../components/works/WorkDetail';
import PageTransition from '../components/common/PageTransition';
import Modal from '../components/Modal';
import Button from '../components/Button';
import { useToast } from '../hooks/useToast';

const defaultFilters: WorkFilterState = {
  poemType: '全部',
  search: '',
  sortBy: 'created_at',
  sortOrder: 'DESC',
};

function filtersToQueryParams(filters: WorkFilterState): Record<string, string> {
  const params: Record<string, string> = {};
  if (filters.poemType && filters.poemType !== '全部') params.type = filters.poemType;
  if (filters.search) params.q = filters.search;
  if (filters.sortBy) params.sort = `${filters.sortBy}_${filters.sortOrder || 'DESC'}`;
  return params;
}

function queryParamsToFilters(params: URLSearchParams): WorkFilterState {
  const filters: WorkFilterState = { ...defaultFilters };
  const type = params.get('type');
  if (type) filters.poemType = type as WorkFilterState['poemType'];
  const q = params.get('q');
  if (q) filters.search = q;
  const sort = params.get('sort');
  if (sort) {
    const parts = sort.split('_');
    if (parts.length === 2) {
      filters.sortBy = parts[0] as WorkFilterState['sortBy'];
      filters.sortOrder = parts[1] as WorkFilterState['sortOrder'];
    }
  }
  return filters;
}

export default function WorksPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const toast = useToast();
  const {
    works,
    loading,
    error,
    pagination,
    fetchWorks,
    deleteWork,
    fetchWorkVersions,
  } = useWorks();

  const [filters, setFilters] = useState<WorkFilterState>(() => queryParamsToFilters(searchParams));
  const [selectedWork, setSelectedWork] = useState<Poem | null>(null);
  const [workToDelete, setWorkToDelete] = useState<Poem | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 12;

  useEffect(() => {
    const apiFilters = {
      poemType: filters.poemType && filters.poemType !== '全部' ? filters.poemType : undefined,
      search: filters.search,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    };
    fetchWorks(page, pageSize, apiFilters);
  }, [page, pageSize, filters, fetchWorks]);

  useEffect(() => {
    const params = filtersToQueryParams(filters);
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  const handleFiltersChange = useCallback((newFilters: WorkFilterState) => {
    setFilters(newFilters);
    setPage(1);
  }, []);

  const handleFiltersReset = useCallback(() => {
    setFilters(defaultFilters);
    setPage(1);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleView = useCallback((work: Poem) => {
    setSelectedWork(work);
    setDetailOpen(true);
  }, []);

  const handleEdit = useCallback((work: Poem) => {
    navigate('/create', { state: { editWork: work } });
  }, [navigate]);

  const handleDelete = useCallback((work: Poem) => {
    setWorkToDelete(work);
  }, []);

  const handleShare = useCallback(async (work: Poem) => {
    try {
      await navigator.clipboard.writeText(`${work.title}\n\n${work.content}`);
      toast.success('已复制到剪贴板');
    } catch {
      toast.error('复制失败，请手动复制');
    }
  }, [toast]);

  const confirmDelete = useCallback(async () => {
    if (!workToDelete) return;
    const success = await deleteWork(workToDelete.poem_id);
    if (success) {
      toast.success('作品已删除');
      if (selectedWork?.poem_id === workToDelete.poem_id) {
        setDetailOpen(false);
        setSelectedWork(null);
      }
    } else {
      toast.error('删除失败');
    }
    setWorkToDelete(null);
  }, [workToDelete, deleteWork, selectedWork, toast]);

  const handleDetailClose = useCallback(() => {
    setDetailOpen(false);
    setSelectedWork(null);
  }, []);

  const handleDetailEdit = useCallback((work: Poem) => {
    handleEdit(work);
    handleDetailClose();
  }, [handleEdit, handleDetailClose]);

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-ink-black tracking-wider">
              作品集
            </h1>
            <p className="text-sm text-ink-black/40 mt-1 tracking-wide">
              {loading ? '加载中...' : `共 ${pagination.total} 首作品`}
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/create')}
          >
            创作新诗
          </Button>
        </div>

        <div className="mb-8">
          <WorkFilters
            filters={filters}
            onChange={handleFiltersChange}
            onReset={handleFiltersReset}
          />
        </div>

        {error && (
          <div className="mb-6 p-4 border border-cinnabar/20 bg-cinnabar/5 rounded-sm text-sm text-cinnabar">
            {error}
          </div>
        )}

        <WorkList
          works={works}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onShare={handleShare}
        />

        <WorkDetail
          work={detailOpen ? selectedWork : null}
          onClose={handleDetailClose}
          onEdit={handleDetailEdit}
          onDelete={handleDelete}
          fetchWorkVersions={fetchWorkVersions}
        />

        <Modal
          isOpen={!!workToDelete}
          onClose={() => setWorkToDelete(null)}
          title="确认删除"
        >
          <div className="space-y-4">
            <p className="text-sm text-ink-black/70 tracking-wider">
              确定要删除作品「{workToDelete?.title}」吗？此操作不可撤销。
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setWorkToDelete(null)}
              >
                取消
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={confirmDelete}
              >
                确认删除
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </PageTransition>
  );
}
