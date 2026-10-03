'use client';

import { useEffect, useState } from 'react';
import { Target, Save, CheckCircle2, Building2 } from 'lucide-react';
import { useSpecTopState } from '@/lib/storage';
import { TargetCompanyId } from '@/lib/types';

const COMPANY_OPTIONS: { id: TargetCompanyId; name: string; focus: string }[] = [
  { id: 'company_a', name: '가상 기업 A', focus: 'CS·문제 해결 중점 (데모 기준)' },
  { id: 'company_b', name: '가상 기업 B', focus: '협업·서비스 구현 중점 (데모 기준)' },
];

export default function GoalPage() {
  const { state, setState, hydrated } = useSpecTopState();

  const [targetCompany, setTargetCompany] = useState<TargetCompanyId>('');
  const [careerGoalDate, setCareerGoalDate] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    if (!hydrated) return;
    setTargetCompany(state.careerGoal.targetCompany);
    setCareerGoalDate(state.careerGoal.careerGoalDate);
  }, [hydrated]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = () => {
    setError(null);

    if (!targetCompany) {
      setError('목표 기업을 선택해주세요.');
      return;
    }
    if (!careerGoalDate) {
      setError('목표 지원 시점을 선택해주세요.');
      return;
    }

    setState((prev) => ({
      ...prev,
      careerGoal: { targetCompany, targetJob: '백엔드 개발자', careerGoalDate },
    }));
    setSavedAt(Date.now());
  };

  if (!hydrated) {
    return <div className="text-sm text-slate-500">불러오는 중...</div>;
  }

  const savedCompany = COMPANY_OPTIONS.find((c) => c.id === state.careerGoal.targetCompany);

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-50 rounded-lg text-emerald-700">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900">목표 기업·직무·지원 시점</h1>
            <p className="text-xs text-slate-500">
              가상 기업 기준입니다. 실제 기업의 공식 채용 기준이 아니라 데모용 시연 기준입니다.
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              목표 기업 <span className="text-rose-500">*</span>
            </label>
            <div className="space-y-2">
              {COMPANY_OPTIONS.map((opt) => (
                <label
                  key={opt.id}
                  className={`flex items-start gap-2.5 border rounded-lg px-3 py-2.5 cursor-pointer transition-colors ${
                    targetCompany === opt.id
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="targetCompany"
                    value={opt.id}
                    checked={targetCompany === opt.id}
                    onChange={() => setTargetCompany(opt.id)}
                    className="mt-0.5 accent-emerald-600"
                  />
                  <span>
                    <span className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-emerald-700" />
                      {opt.name}
                    </span>
                    <span className="block text-xs text-slate-500 mt-0.5">{opt.focus}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">목표 직무</label>
            <input
              type="text"
              value="백엔드 개발자"
              disabled
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 text-slate-500"
            />
            <p className="mt-1 text-[11px] text-slate-400">현재 데모는 백엔드 개발 직무만 지원합니다.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              목표 지원 시점 <span className="text-rose-500">*</span>
            </label>
            <input
              type="month"
              value={careerGoalDate}
              onChange={(e) => setCareerGoalDate(e.target.value)}
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
              저장되었습니다.
            </p>
          )}
        </div>
      </div>

      {savedCompany && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h2 className="text-xs font-semibold text-slate-500 mb-2">현재 저장된 목표</h2>
          <div className="text-sm text-slate-800 space-y-1">
            <div>
              목표 기업: <strong>{savedCompany.name}</strong> ({savedCompany.focus})
            </div>
            <div>목표 직무: <strong>{state.careerGoal.targetJob}</strong></div>
            <div>목표 지원 시점: <strong>{state.careerGoal.careerGoalDate || '미확인'}</strong></div>
          </div>
        </div>
      )}
    </div>
  );
}
