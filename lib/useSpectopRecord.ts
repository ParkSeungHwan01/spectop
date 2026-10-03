'use client';

import { useEffect, useState } from 'react';
import { INITIAL_SPECTOP_RECORD, SpectopUserAnalysisRecord, ProjectItem, RecommendationItem } from './types';
import { syncAnalysis } from './spectopAnalysis';
import type { CompanyBaseline } from './companies';

export const STORAGE_KEY = 'spectop_mvp_v1_2';

function nowStamp() {
  return new Date().toISOString().replace('T', ' ').slice(0, 19);
}

function loadRecord(): SpectopUserAnalysisRecord {
  if (typeof window === 'undefined') return syncAnalysis(INITIAL_SPECTOP_RECORD);
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return syncAnalysis(INITIAL_SPECTOP_RECORD);
    const parsed = JSON.parse(raw);
    return syncAnalysis({ ...INITIAL_SPECTOP_RECORD, ...parsed });
  } catch {
    return syncAnalysis(INITIAL_SPECTOP_RECORD);
  }
}

function saveRecord(record: SpectopUserAnalysisRecord) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  } catch {
    // 저장 실패(용량 초과 등) 시에도 화면 동작은 계속 진행
  }
}

export function useSpectopRecord() {
  const [record, setRecord] = useState<SpectopUserAnalysisRecord>(INITIAL_SPECTOP_RECORD);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setRecord(loadRecord());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveRecord(record);
  }, [record, hydrated]);

  const toggleCompany = (company: CompanyBaseline) => {
    setRecord((prev) => {
      const selected = prev.company_demo_profiles.some((c) => c.id === company.id);
      const nextProfiles = selected
        ? prev.company_demo_profiles.filter((c) => c.id !== company.id)
        : [...prev.company_demo_profiles, company];
      return syncAnalysis({ ...prev, company_demo_profiles: nextProfiles, updated_at: nowStamp() });
    });
  };

  const addProject = (project: ProjectItem) => {
    setRecord((prev) => ({ ...prev, projects: [project, ...prev.projects], updated_at: nowStamp() }));
  };

  const updateProfile = (fields: { major: string; school_year: string; grade: number | null; grade_scale: number | null }) => {
    setRecord((prev) => ({ ...prev, ...fields, updated_at: nowStamp() }));
  };

  const updateCareerGoalDate = (career_goal_date: string) => {
    setRecord((prev) => syncAnalysis({ ...prev, career_goal_date, updated_at: nowStamp() }));
  };

  const toggleRoadmap = (id: string) => {
    setRecord((prev) => ({
      ...prev,
      roadmap: prev.roadmap.map((item) => (item.id === id ? { ...item, is_completed: !item.is_completed } : item)),
      updated_at: nowStamp(),
    }));
  };

  const addRecToRoadmap = (rec: RecommendationItem) => {
    setRecord((prev) => {
      if (rec.added_to_roadmap) return prev;
      const newItem = {
        id: `RD-${Date.now()}`,
        month: '차기 마일스톤',
        title: rec.title,
        category: rec.category,
        description: rec.reason,
        is_completed: false,
        order: prev.roadmap.length + 1,
      };
      return {
        ...prev,
        roadmap: [...prev.roadmap, newItem],
        recommendations: prev.recommendations.map((r) => (r.id === rec.id ? { ...r, added_to_roadmap: true } : r)),
        updated_at: nowStamp(),
      };
    });
  };

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const runReanalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setRecord((prev) => {
        const next = {
          ...prev,
          competency_scores: {
            ...prev.competency_scores,
            career_density: prev.careers.length > 0 ? Math.min(45 + prev.careers.length * 5, 95) : prev.competency_scores.career_density,
            project_depth: Math.min(60 + prev.projects.length * 7, 98),
          },
          analysis_version: prev.analysis_version + 1,
          analysis_date: nowStamp(),
          updated_at: nowStamp(),
        };
        return syncAnalysis(next);
      });
      setIsAnalyzing(false);
    }, 900);
  };

  return {
    record,
    setRecord,
    hydrated,
    isAnalyzing,
    toggleCompany,
    addProject,
    updateProfile,
    updateCareerGoalDate,
    toggleRoadmap,
    addRecToRoadmap,
    runReanalysis,
  };
}
