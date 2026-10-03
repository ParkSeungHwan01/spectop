'use client';

import { useEffect, useState } from 'react';
import { DEFAULT_STATE, SpecTopState } from './types';

export const STORAGE_KEY = 'spectop_mvp_v1_2';

function mergeState(parsed: unknown): SpecTopState {
  if (!parsed || typeof parsed !== 'object') return DEFAULT_STATE;
  const p = parsed as Partial<SpecTopState>;
  return {
    profile: { ...DEFAULT_STATE.profile, ...(p.profile ?? {}) },
    careerGoal: { ...DEFAULT_STATE.careerGoal, ...(p.careerGoal ?? {}) },
    experiences: Array.isArray(p.experiences) ? p.experiences : [],
    analysisVersion: typeof p.analysisVersion === 'number' ? p.analysisVersion : 1,
  };
}

export function loadState(): SpecTopState {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    return mergeState(JSON.parse(raw));
  } catch {
    // 저장된 값이 손상된 경우 기본값으로 안전하게 복귀
    return DEFAULT_STATE;
  }
}

export function saveState(state: SpecTopState) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // 저장 실패(용량 초과/프라이빗 모드 등) 시 화면 동작은 계속 진행
  }
}

export function useSpecTopState() {
  const [state, setState] = useState<SpecTopState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveState(state);
  }, [state, hydrated]);

  return { state, setState, hydrated };
}
