'use client';

import { useState } from 'react';
import { Layers, Plus, Pencil, Trash2, X, Check, FolderKanban, Wand2, Loader2, AlertTriangle } from 'lucide-react';
import { useSpecTopState } from '@/lib/storage';
import { EXPERIENCE_TYPES, Experience, ExperienceType } from '@/lib/types';

function generateId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `exp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

const EMPTY_FORM = {
  type: '프로젝트' as ExperienceType,
  title: '',
  role: '',
  skills: '',
  outcome: '',
  startDate: '',
  endDate: '',
  description: '',
};

interface StructureApiResult {
  activityType: ExperienceType | '';
  role: string;
  skills: string[];
  outcome: string;
}

export default function ExperiencesPage() {
  const { state, setState, hydrated } = useSpecTopState();

  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isStructuring, setIsStructuring] = useState(false);
  const [structureError, setStructureError] = useState<string | null>(null);
  const [structureNotice, setStructureNotice] = useState<string | null>(null);

  const handleStructureWithAi = async () => {
    const description = form.description.trim();
    if (!description) {
      setStructureError('먼저 경험 설명을 입력해주세요.');
      return;
    }

    setIsStructuring(true);
    setStructureError(null);
    setStructureNotice(null);

    try {
      const res = await fetch('/api/structure-experience', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description }),
      });
      const json = await res.json();

      if (!res.ok || !json.ok) {
        setStructureError(json.error || '잠시 후 다시 시도해주세요.');
        return;
      }

      const data = json.data as StructureApiResult;
      setForm((f) => ({
        ...f,
        type: data.activityType || f.type,
        role: data.role || f.role,
        skills: data.skills.length > 0 ? data.skills.join(', ') : f.skills,
        outcome: data.outcome || f.outcome,
      }));
      setStructureNotice('AI가 설명에서 활동 유형·역할·기술·성과를 추출했습니다. 내용을 확인하고 필요하면 수정해주세요.');
    } catch {
      setStructureError('네트워크 오류로 분석에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsStructuring(false);
    }
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setError(null);
    setStructureError(null);
    setStructureNotice(null);
  };

  const handleSubmit = () => {
    setError(null);
    const title = form.title.trim();
    if (!title) {
      setError('활동명을 입력해주세요.');
      return;
    }
    if (!form.startDate) {
      setError('시작 시점을 입력해주세요.');
      return;
    }

    const now = new Date().toISOString();

    if (editingId) {
      setState((prev) => ({
        ...prev,
        experiences: prev.experiences.map((exp) =>
          exp.id === editingId
            ? {
                ...exp,
                type: form.type,
                title,
                role: form.role.trim(),
                skills: form.skills.trim(),
                outcome: form.outcome.trim(),
                startDate: form.startDate,
                endDate: form.endDate,
                description: form.description.trim(),
                updatedAt: now,
              }
            : exp
        ),
      }));
    } else {
      const newExperience: Experience = {
        id: generateId(),
        type: form.type,
        title,
        role: form.role.trim(),
        skills: form.skills.trim(),
        outcome: form.outcome.trim(),
        startDate: form.startDate,
        endDate: form.endDate,
        description: form.description.trim(),
        createdAt: now,
        updatedAt: now,
      };
      setState((prev) => ({ ...prev, experiences: [newExperience, ...prev.experiences] }));
    }

    resetForm();
  };

  const handleEdit = (exp: Experience) => {
    setEditingId(exp.id);
    setForm({
      type: exp.type,
      title: exp.title,
      role: exp.role,
      skills: exp.skills,
      outcome: exp.outcome ?? '',
      startDate: exp.startDate,
      endDate: exp.endDate,
      description: exp.description,
    });
    setError(null);
    setStructureError(null);
    setStructureNotice(null);
  };

  const handleDelete = (id: string) => {
    setState((prev) => ({ ...prev, experiences: prev.experiences.filter((exp) => exp.id !== id) }));
    setConfirmDeleteId(null);
    if (editingId === id) resetForm();
  };

  if (!hydrated) {
    return <div className="text-sm text-slate-500">불러오는 중...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-50 rounded-lg text-emerald-700">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900">경험 등록·수정·삭제</h1>
            <p className="text-xs text-slate-500">동아리·프로젝트·공모전·아르바이트·인턴 경험을 자유롭게 기록하세요.</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">활동 유형</label>
            <select
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as ExperienceType }))}
              className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              {EXPERIENCE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              활동명 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="예: 캠퍼스 중고거래 플랫폼 개발"
              className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">역할</label>
            <input
              type="text"
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
              placeholder="예: 백엔드 개발 (3인 협업)"
              className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">사용 기술 (쉼표로 구분)</label>
            <input
              type="text"
              value={form.skills}
              onChange={(e) => setForm((f) => ({ ...f, skills: e.target.value }))}
              placeholder="예: Java, Spring Boot, MySQL"
              className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">성과</label>
            <input
              type="text"
              value={form.outcome}
              onChange={(e) => setForm((f) => ({ ...f, outcome: e.target.value }))}
              placeholder="예: 실사용자 420명 확보, 응답속도 180ms 달성"
              className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              시작 시점 <span className="text-rose-500">*</span>
            </label>
            <input
              type="month"
              value={form.startDate}
              onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
              className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">종료 시점 (진행 중이면 비워두기)</label>
            <input
              type="month"
              value={form.endDate}
              onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
              className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              경험 설명 (역할·성과를 구체적으로 적어주세요)
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={3}
              placeholder="예: REST API 설계 및 DB 모델링을 맡았고, 실사용자 420명을 확보했습니다."
              className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />

            <div className="mt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={handleStructureWithAi}
                disabled={isStructuring}
                className="inline-flex items-center gap-1.5 bg-white border border-emerald-300 hover:bg-emerald-50 text-emerald-700 font-semibold text-xs px-3 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isStructuring ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Wand2 className="w-3.5 h-3.5" />
                )}
                <span>{isStructuring ? 'AI가 분석 중...' : 'AI로 구조화하기'}</span>
              </button>
              <span className="text-[11px] text-slate-400">
                설명에 적힌 내용만 근거로 활동유형·역할·기술·성과를 채워줍니다 (실시간 AI 호출).
              </span>
            </div>

            {structureError && (
              <p className="mt-1.5 text-xs text-rose-600 font-medium flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>{structureError} 위 버튼을 다시 눌러 재시도할 수 있습니다.</span>
              </p>
            )}
            {structureNotice && !structureError && (
              <p className="mt-1.5 text-xs text-emerald-700 font-medium">{structureNotice}</p>
            )}
          </div>
        </div>

        {error && <p className="mt-3 text-xs text-rose-600 font-medium">{error}</p>}

        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={handleSubmit}
            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2.5 rounded-lg transition-colors shadow-sm"
          >
            {editingId ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            <span>{editingId ? '수정 완료' : '경험 추가'}</span>
          </button>
          {editingId && (
            <button
              onClick={resetForm}
              className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-4 py-2.5 rounded-lg transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>취소</span>
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
          <FolderKanban className="w-4 h-4 text-emerald-700" />
          등록된 경험 ({state.experiences.length})
        </h2>

        {state.experiences.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 text-center text-sm text-slate-400">
            아직 등록된 경험이 없습니다. 위 양식으로 첫 경험을 추가해보세요.
          </div>
        )}

        {state.experiences.map((exp) => (
          <div key={exp.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {exp.type}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 truncate">{exp.title}</h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {exp.startDate || '미확인'} ~ {exp.endDate || '진행 중'}
                  {exp.role && <> · {exp.role}</>}
                </p>
                {exp.skills && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {exp.skills
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean)
                      .map((s, i) => (
                        <span key={i} className="px-1.5 py-0.5 bg-slate-50 border border-slate-200 rounded text-[10px] font-mono text-slate-600">
                          {s}
                        </span>
                      ))}
                  </div>
                )}
                {exp.outcome && (
                  <p className="text-xs text-emerald-700 mt-2 font-medium">성과: {exp.outcome}</p>
                )}
                {exp.description && <p className="text-xs text-slate-600 mt-2 leading-relaxed">{exp.description}</p>}
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => handleEdit(exp)}
                  className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 hover:text-emerald-700"
                  aria-label="수정"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setConfirmDeleteId(exp.id)}
                  className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 hover:text-rose-600"
                  aria-label="삭제"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {confirmDeleteId === exp.id && (
              <div className="mt-3 flex items-center justify-between gap-2 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
                <span className="text-xs text-rose-700">이 경험을 삭제하시겠습니까?</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDelete(exp.id)}
                    className="text-xs font-semibold text-rose-700 hover:underline"
                  >
                    삭제
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(null)}
                    className="text-xs font-semibold text-slate-500 hover:underline"
                  >
                    취소
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
