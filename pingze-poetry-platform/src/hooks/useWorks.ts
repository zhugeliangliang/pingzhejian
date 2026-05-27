import { useState, useCallback, useEffect, useRef } from 'react';
import { api } from '../api/client';
import type { Poem, PoemVersion, CreatePoemData, UpdatePoemData, PoemListParams } from '../api/client';
import type { PoemType } from '../api/client';

export interface WorksFilters {
  poemType?: PoemType;
  search?: string;
  sortBy?: 'created_at' | 'updated_at' | 'like_count';
  sortOrder?: 'ASC' | 'DESC';
}

export interface WorksState {
  works: Poem[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

interface LocalStorageWork {
  poem_id: string;
  user_id: string;
  title: string;
  content: string;
  poem_type: PoemType;
  template_id?: string;
  pingze_pattern?: string;
  rhyme_scheme?: string;
  version: number;
  is_published: boolean;
  like_count: number;
  created_at: string;
  updated_at: string;
  author?: {
    username: string;
    avatar_url?: string;
  };
  template_name?: string;
}

const STORAGE_KEY = 'pingze_works';
const STORAGE_VERSIONS_KEY = 'pingze_works_versions';

function getLocalStorageWorks(): LocalStorageWork[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveLocalStorageWorks(works: LocalStorageWork[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(works));
}

function getLocalStorageVersions(poemId: string): PoemVersion[] {
  try {
    const data = localStorage.getItem(`${STORAGE_VERSIONS_KEY}_${poemId}`);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveLocalStorageVersions(poemId: string, versions: PoemVersion[]) {
  localStorage.setItem(`${STORAGE_VERSIONS_KEY}_${poemId}`, JSON.stringify(versions));
}

function generateId(): string {
  return `local_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function useWorks() {
  const [state, setState] = useState<WorksState>({
    works: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 12,
      total: 0,
      totalPages: 0,
    },
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const fetchWorks = useCallback(async (
    page = 1,
    pageSize = 12,
    filters: WorksFilters = {}
  ) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const params: PoemListParams = {
        page,
        pageSize,
        poem_type: filters.poemType,
        search: filters.search,
        sort_by: filters.sortBy,
        sort_order: filters.sortOrder,
      };

      const response = await api.getPoems(params);

      if (!isMountedRef.current) return;

      if (response.success && response.data) {
        const { items, total, totalPages } = response.data;
        setState({
          works: items,
          loading: false,
          error: null,
          pagination: {
            page,
            pageSize,
            total,
            totalPages,
          },
        });
      } else {
        throw new Error(response.error || '获取作品列表失败');
      }
    } catch {
      if (!isMountedRef.current) return;

      const localWorks = getLocalStorageWorks();
      const filtered = applyFilters(localWorks, filters);
      const paginated = paginate(filtered, page, pageSize);

      setState({
        works: paginated.items as unknown as Poem[],
        loading: false,
        error: null,
        pagination: {
          page,
          pageSize,
          total: paginated.total,
          totalPages: paginated.totalPages,
        },
      });
    }
  }, []);

  const createWork = useCallback(async (data: CreatePoemData): Promise<Poem | null> => {
    try {
      const response = await api.createPoem(data);

      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          works: [response.data!, ...prev.works],
        }));
        return response.data;
      }
      throw new Error(response.error || '创建作品失败');
    } catch {
      const newWork: LocalStorageWork = {
        poem_id: generateId(),
        user_id: 'local_user',
        title: data.title,
        content: data.content,
        poem_type: data.poem_type,
        template_id: data.template_id,
        pingze_pattern: data.pingze_pattern,
        rhyme_scheme: data.rhyme_scheme,
        version: 1,
        is_published: data.is_published ?? false,
        like_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const works = getLocalStorageWorks();
      works.unshift(newWork);
      saveLocalStorageWorks(works);

      setState(prev => ({
        ...prev,
        works: [newWork as unknown as Poem, ...prev.works],
      }));

      return newWork as unknown as Poem;
    }
  }, []);

  const updateWork = useCallback(async (id: string, data: UpdatePoemData): Promise<Poem | null> => {
    try {
      const response = await api.updatePoem(id, data);

      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          works: prev.works.map(w => w.poem_id === id ? response.data! : w),
        }));
        return response.data;
      }
      throw new Error(response.error || '更新作品失败');
    } catch {
      const works = getLocalStorageWorks();
      const index = works.findIndex(w => w.poem_id === id);

      if (index === -1) return null;

      const updatedWork: LocalStorageWork = {
        ...works[index],
        ...data,
        version: works[index].version + 1,
        updated_at: new Date().toISOString(),
      };

      works[index] = updatedWork;
      saveLocalStorageWorks(works);

      const versions = getLocalStorageVersions(id);
      versions.push({
        version_id: generateId(),
        poem_id: id,
        content: works[index - 1]?.content || updatedWork.content,
        title: works[index - 1]?.title || updatedWork.title,
        version_number: works[index].version,
        change_summary: '本地保存',
        created_at: new Date().toISOString(),
      });
      saveLocalStorageVersions(id, versions);

      setState(prev => ({
        ...prev,
        works: prev.works.map(w => w.poem_id === id ? updatedWork as unknown as Poem : w),
      }));

      return updatedWork as unknown as Poem;
    }
  }, []);

  const deleteWork = useCallback(async (id: string): Promise<boolean> => {
    try {
      const response = await api.deletePoem(id);

      if (response.success) {
        setState(prev => ({
          ...prev,
          works: prev.works.filter(w => w.poem_id !== id),
        }));
        return true;
      }
      return false;
    } catch {
      const works = getLocalStorageWorks();
      const filtered = works.filter(w => w.poem_id !== id);

      if (filtered.length === works.length) return false;

      saveLocalStorageWorks(filtered);
      localStorage.removeItem(`${STORAGE_VERSIONS_KEY}_${id}`);

      setState(prev => ({
        ...prev,
        works: prev.works.filter(w => w.poem_id !== id),
      }));

      return true;
    }
  }, []);

  const fetchWorkVersions = useCallback(async (poemId: string): Promise<PoemVersion[]> => {
    try {
      const response = await api.getPoemVersions(poemId);

      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.error || '获取版本历史失败');
    } catch {
      return getLocalStorageVersions(poemId);
    }
  }, []);

  return {
    ...state,
    fetchWorks,
    createWork,
    updateWork,
    deleteWork,
    fetchWorkVersions,
  };
}

function applyFilters(works: LocalStorageWork[], filters: WorksFilters): LocalStorageWork[] {
  let result = [...works];

  if (filters.poemType) {
    result = result.filter(w => w.poem_type === filters.poemType);
  }

  if (filters.search) {
    const search = filters.search.toLowerCase();
    result = result.filter(w =>
      w.title.toLowerCase().includes(search) ||
      w.content.toLowerCase().includes(search)
    );
  }

  const sortBy = filters.sortBy || 'created_at';
  const sortOrder = filters.sortOrder || 'DESC';

  result.sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortOrder === 'DESC'
        ? bVal.localeCompare(aVal)
        : aVal.localeCompare(bVal);
    }

    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortOrder === 'DESC' ? bVal - aVal : aVal - bVal;
    }

    return 0;
  });

  return result;
}

function paginate<T>(items: T[], page: number, pageSize: number): {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
} {
  const total = items.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const paginatedItems = items.slice(start, start + pageSize);

  return {
    items: paginatedItems,
    total,
    page,
    pageSize,
    totalPages: Math.max(totalPages, 1),
  };
}

export default useWorks;
