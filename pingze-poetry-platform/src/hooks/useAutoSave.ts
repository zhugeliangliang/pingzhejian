import { useState, useEffect, useCallback, useRef } from 'react';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface UseAutoSaveOptions {
  data: unknown;
  key: string;
  delay?: number;
}

interface UseAutoSaveReturn {
  status: SaveStatus;
  lastSaved: Date | null;
  save: () => void;
  clear: () => void;
}

export function useAutoSave({
  data,
  key,
  delay = 2000,
}: UseAutoSaveOptions): UseAutoSaveReturn {
  const [status, setStatus] = useState<SaveStatus>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dataRef = useRef(data);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  const save = useCallback(() => {
    try {
      setStatus('saving');
      const serialized = JSON.stringify(dataRef.current);
      localStorage.setItem(`pingze_${key}`, serialized);
      setLastSaved(new Date());
      setStatus('saved');
    } catch {
      setStatus('error');
    }
  }, [key]);

  const clear = useCallback(() => {
    localStorage.removeItem(`pingze_${key}`);
    setStatus('idle');
    setLastSaved(null);
  }, [key]);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      save();
    }, delay);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [data, delay, save]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return { status, lastSaved, save, clear };
}
