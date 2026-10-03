'use client';

import Link from 'next/link';
import { Sparkles, Building2, GraduationCap, Target, ArrowRight } from 'lucide-react';
import { useSpecTopState } from '@/lib/storage';
import { getCandidatesByCompany, getCompanyProfile } from '@/lib/virtualData';
import { COMPETENCY_DOMAINS } from '@/lib/types';

export default function AnalysisPage() {
  const { state, hydrated } = useSpecTopState();

  if (!hydrated) {
    return <div className="text-sm text-slate-500">불러오는 중...</div>;
  }

  const companyProfile = getCompanyProfile(state.careerGoal.targetCompany);

  if (!companyProfile) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-6 text-center shadow-sm">
        <p className="text-sm text-slate-600">
          먼저 목표 기업을 선택해야 가상 비교 데이터를 볼 수 있습니다.
        </p>
        <Link
          href="/goal"
          className="mt-4 inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2.5 rounded-lg transition-colors shadow-sm"
        >
          <span>목표 설정하러 가기</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  const candidates = getCandidatesByCompany(state.careerGoal.targetCompany);

  return (
    <div className="space-y-6">
      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
        <Sparkles className="w-3.5 h-3.5" />
        데모용 가상 합격자 데이터 · AI 생성 · 실제 채용 통계 아님
      </span>

      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-50 rounded-lg text-emerald-700">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900">
              {companyProfile.target_company} · {companyProfile.target_job}
            </h1>
            <p className="text-xs text-slate-500">{companyProfile.company_focus}</p>
          </div>
        </div>

        <div className="mt-4">
          <h2 className="text-xs font-semibold text-slate-500 mb-2">역량별 가상 기준 (가중치 · 참고 목표 점수)</h2>
          <div className="space-y-2">
            {companyProfile.competency_targets.map((t) => {
              const domainLabel = COMPETENCY_DOMAINS.find((d) => d.id === t.domain)?.label ?? t.domain;
              return (
                <div key={t.domain} className="flex items-center justify-between text-xs bg-slate-50 rounded-lg px-3 py-2">
                  <span className="font-semibold text-slate-700">{domainLabel}</span>
                  <span className="text-slate-500">
                    가중치 {t.weight}% · 참고 목표 <strong className="text-slate-800">{t.target_score}점</strong>
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4">
          <h2 className="text-xs font-semibold text-slate-500 mb-2">가상 기준 예시 활동</h2>
          <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
            {companyProfile.example_experiences.map((ex, i) => (
              <li key={i}>{ex}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
          <GraduationCap className="w-4 h-4 text-emerald-700" />
          가상 합격자 프로필 ({candidates.length})
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {candidates.map((cand) => (
            <div key={cand.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <div className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 w-fit">
                가상 데이터
              </div>
              <h3 className="text-sm font-bold text-slate-900 mt-2">{cand.school}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{cand.status}</p>

              <div className="flex flex-wrap gap-1 mt-2">
                {cand.tech_stack.map((s, i) => (
                  <span key={i} className="px-1.5 py-0.5 bg-slate-50 border border-slate-200 rounded text-[10px] font-mono text-slate-600">
                    {s}
                  </span>
                ))}
              </div>

              <div className="mt-3 space-y-1">
                {COMPETENCY_DOMAINS.map((d) => (
                  <div key={d.id} className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">{d.label}</span>
                    <span className="font-mono font-semibold text-slate-700">{cand.domain_scores[d.id]}점</span>
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-slate-500 mt-3 leading-relaxed border-t border-slate-100 pt-2">
                {cand.example_experience}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center gap-3">
        <Target className="w-4 h-4 text-emerald-700 shrink-0" />
        <p className="text-xs text-slate-500">
          이 기준과 내 경험을 비교해 역량 점수·GAP·보완 활동을 보여주는 기능은 다음 단계(FR-06)에서 이어집니다.
        </p>
      </div>
    </div>
  );
}
