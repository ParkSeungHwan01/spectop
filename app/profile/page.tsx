'use client';

import { useEffect, useState } from 'react';
import { GraduationCap, Save, CheckCircle2 } from 'lucide-react';
import { useSpecTopState } from '@/lib/storage';
import { SCHOOL_YEAR_OPTIONS } from '@/lib/types';

export default function ProfilePage() {
  const { state, setState, hydrated } = useSpecTopState();

  const [major, setMajor] = useState('');
  const [schoolYear, setSchoolYear] = useState('');
  const [gradeInput, setGradeInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  // 로컬 저장값이 로드되면 폼 초기값으로 반영
  useEffect(() => {
    if (!hydrated) return;
    setMajor(state.profile.major);
    setSchoolYear(state.profile.schoolYear);
    setGradeInput(state.profile.grade === null ? '' : String(state.profile.grade));
  }, [hydrated]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = () => {
    setError(null);

    const trimmedMajor = major.trim();
    if (!trimmedMajor) {
      setError('전공을 입력해주세요.');
      return;
    }
    if (!schoolYear) {
      setError('학년·상태를 선택해주세요.');
      return;
    }

    let grade: number | null = null;
    if (gradeInput.trim() !== '') {
      const parsed = Number(gradeInput);
      if (Number.isNaN(parsed) || parsed < 0 || parsed > 4.5) {
        setError('학점은 0~4.5 사이의 숫자로 입력해주세요.');
        return;
      }
      grade = parsed;
    }

    setState((prev) => ({
      ...prev,
      profile: { major: trimmedMajor, schoolYear, grade },
    }));
    setSavedAt(Date.now());
  };

  if (!hydrated) {
    return <div className="text-sm text-slate-500">불러오는 중...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-50 rounded-lg text-emerald-700">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900">커리어 프로필</h1>
            <p className="text-xs text-slate-500">전공·학년·학점(선택)을 입력하면 브라우저에 저장됩니다.</p>
          </div>
        </div>

        <div className="mt-5 space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              전공 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              placeholder="예: 컴퓨터공학과"
              className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              학년·상태 <span className="text-rose-500">*</span>
            </label>
            <select
              value={schoolYear}
              onChange={(e) => setSchoolYear(e.target.value)}
              className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
            >
              <option value="">선택해주세요</option>
              {SCHOOL_YEAR_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">학점 (선택, 4.5 만점 기준)</label>
            <input
              type="text"
              inputMode="decimal"
              value={gradeInput}
              onChange={(e) => setGradeInput(e.target.value)}
              placeholder="예: 3.8 (입력하지 않으면 미확인으로 처리)"
              className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}

          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2.5 rounded-lg transition-colors shadow-sm"
          >
            <Save className="w-3.5 h-3.5" />
            <span>저장하기</span>
          </button>

          {savedAt && (
            <p className="text-xs text-emerald-700 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              저장되었습니다. 새로고침해도 값이 유지됩니다.
            </p>
          )}
        </div>
      </div>

      {(state.profile.major || state.profile.schoolYear) && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h2 className="text-xs font-semibold text-slate-500 mb-2">현재 저장된 프로필</h2>
          <div className="text-sm text-slate-800 space-y-1">
            <div>전공: <strong>{state.profile.major || '미확인'}</strong></div>
            <div>학년·상태: <strong>{state.profile.schoolYear || '미확인'}</strong></div>
            <div>학점: <strong>{state.profile.grade === null ? '미확인' : `${state.profile.grade} / 4.5`}</strong></div>
          </div>
        </div>
      )}
    </div>
  );
}
