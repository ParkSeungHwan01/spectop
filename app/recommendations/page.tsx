'use client';

import Link from 'next/link';
import { Sparkles, Lightbulb, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useSpecTopState } from '@/lib/storage';
import { getCompanyProfile } from '@/lib/virtualData';
import { COMPETENCY_DOMAINS, CompetencyDomainId } from '@/lib/types';
import { computeGapResults } from '@/lib/scoring';
import { buildRecommendations } from '@/lib/recommendations';

export default function RecommendationsPage() {
  const { state, hydrated } = useSpecTopState();

  if (!hydrated) {
    return <div className="text-sm text-slate-500">불러오는 중...</div>;
  }

  const companyProfile = getCompanyProfile(state.careerGoal.targetCompany);

  if (!companyProfile) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-6 text-center shadow-sm">
        <p className="text-sm text-slate-600">먼저 목표 기업을 선택해야 추천 활동을 볼 수 있습니다.</p>
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
  const recommendations = buildRecommendations(gapResults, domainLabels);

  return (
    <div className="space-y-6">
      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
        <Sparkles className="w-3.5 h-3.5" />
        데모용 가상 합격자 데이터 · AI 생성 · 실제 채용 통계 아님
      </span>

      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <h1 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-emerald-700" />
          보완 활동 추천
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          GAP 분석에서 보완이 필요하거나 미확인인 영역에 연결된 활동 유형 예시입니다. 실제 모집 공고가 아니라 예시입니다.
        </p>
      </div>

      {recommendations.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-6 text-center shadow-sm">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
          <p className="text-sm text-slate-600 mt-2">
            현재 등록된 경험 기준으로 모든 영역이 양호 이상입니다. 경험을 더 추가하면 더 정확한 추천을 받을 수 있습니다.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {recommendations.map((rec) => (
            <div key={rec.domain} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                {rec.domainLabel}
              </span>
              <div className="mt-2 space-y-1">
                {rec.activityExamples.map((ex, i) => (
                  <div key={i} className="flex items-start gap-1.5 text-sm text-slate-800">
                    <span className="text-emerald-600 mt-0.5">•</span>
                    <span>
                      {ex} <span className="text-[10px] text-slate-400">(활동 유형 예시)</span>
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-3 leading-relaxed border-t border-slate-100 pt-2">{rec.reason}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
