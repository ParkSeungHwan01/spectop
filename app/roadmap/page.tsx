'use client';

import Link from 'next/link';
import { Sparkles, Calendar, ArrowRight } from 'lucide-react';
import { useSpecTopState } from '@/lib/storage';
import { getCompanyProfile } from '@/lib/virtualData';
import { COMPETENCY_DOMAINS, CompetencyDomainId } from '@/lib/types';
import { computeGapResults } from '@/lib/scoring';
import { buildRoadmap } from '@/lib/roadmap';

export default function RoadmapPage() {
  const { state, hydrated } = useSpecTopState();

  if (!hydrated) {
    return <div className="text-sm text-slate-500">불러오는 중...</div>;
  }

  const companyProfile = getCompanyProfile(state.careerGoal.targetCompany);

  if (!companyProfile) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-6 text-center shadow-sm">
        <p className="text-sm text-slate-600">먼저 목표 기업을 선택해야 로드맵을 볼 수 있습니다.</p>
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

  const domainLabels = COMPETENCY_DOMAINS.reduce((acc, d) => {
    acc[d.id] = d.label;
    return acc;
  }, {} as Record<CompetencyDomainId, string>);

  const gapResults = computeGapResults(companyProfile, state.experiences, domainLabels);
  const { steps, monthsRemaining } = buildRoadmap(gapResults, companyProfile, domainLabels, state.careerGoal.careerGoalDate);

  const groupedByPhase = steps.reduce((acc, step) => {
    (acc[step.phaseLabel] ??= []).push(step);
    return acc;
  }, {} as Record<string, typeof steps>);

  return (
    <div className="space-y-6">
      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
        <Sparkles className="w-3.5 h-3.5" />
        데모용 가상 합격자 데이터 · AI 생성 · 실제 채용 통계 아님
      </span>

      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <h1 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-emerald-700" />
          {companyProfile.target_company} 커리어 로드맵
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          {companyProfile.company_focus} 기준으로, 가중치가 높고 현재 GAP이 큰 역량을 먼저 배치했습니다.
          {state.careerGoal.careerGoalDate
            ? ` 목표 지원 시점: ${state.careerGoal.careerGoalDate} (약 ${monthsRemaining}개월 남음)`
            : ' 목표 지원 시점을 설정하면 남은 기간이 표시됩니다.'}
        </p>
      </div>

      <div className="space-y-5">
        {Object.entries(groupedByPhase).map(([phaseLabel, phaseSteps]) => (
          <div key={phaseLabel} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">{phaseLabel}</h2>
              <span className="text-[11px] text-slate-400">{phaseSteps[0]?.durationLabel}</span>
            </div>

            <div className="mt-3 space-y-3">
              {phaseSteps.map((step, i) => (
                <div key={i} className="border border-slate-100 rounded-lg p-3 bg-slate-50">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-800">{step.domainLabel}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      추천 행동
                    </span>
                  </div>
                  <p className="text-sm text-slate-800 mt-1">{step.action}</p>
                  <p className="text-xs text-slate-500 mt-1.5">{step.reason}</p>
                  <p className="text-[11px] text-slate-400 mt-1.5 border-t border-slate-200 pt-1.5">
                    완료 조건: {step.completionCondition}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
