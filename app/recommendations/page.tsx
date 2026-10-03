'use client';

import Link from 'next/link';
import { useSpecTopState } from '@/lib/storage';
import { getCompanyProfile } from '@/lib/virtualData';
import { COMPETENCY_DOMAINS, CompetencyDomainId } from '@/lib/types';
import { computeGapResults } from '@/lib/scoring';
import { buildRecommendations } from '@/lib/recommendations';
import { Icon, Tag, PageHeader } from '@/components/ui';

export default function RecommendationsPage() {
  const { state, hydrated } = useSpecTopState();

  if (!hydrated) {
    return <p style={{ color: 'var(--muted)', fontSize: 14 }}>불러오는 중...</p>;
  }

  const companyProfile = getCompanyProfile(state.careerGoal.targetCompany);

  if (!companyProfile) {
    return (
      <div className="state-page">
        <span><Icon name="trend" /></span>
        <h1>먼저 목표 기업을 선택해주세요</h1>
        <p>목표 기업을 선택하면 보완 활동 추천을 볼 수 있어요.</p>
        <Link href="/goal" className="btn btn-primary">
          목표 설정하러 가기 <Icon name="chevron" size={18} />
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
    <>
      <PageHeader
        title="추천 활동"
        description="GAP에서 보완이 필요하거나 미확인인 영역에 연결된 활동 유형 예시예요. 실제 모집 공고가 아니라 예시입니다."
      />

      {recommendations.length === 0 ? (
        <div className="state-page">
          <span><Icon name="check" /></span>
          <h1>모든 영역이 양호 이상이에요</h1>
          <p>현재 등록된 경험 기준으로 보완이 필요한 영역이 없어요. 경험을 더 추가하면 더 정확한 추천을 받을 수 있어요.</p>
        </div>
      ) : (
        <div className="recommendation-grid">
          {recommendations.map((rec) => (
            <div className="recommendation-card" key={rec.domain}>
              <div className="recommendation-card-head">
                <Tag tone="red">{rec.domainLabel}</Tag>
              </div>
              <div className="recommendation-body">
                {rec.activityExamples.map((ex, i) => (
                  <div key={i} style={{ display: 'flex', gap: 6 }}>
                    <span>•</span>
                    <span>
                      {ex} <small style={{ color: '#98a2b3' }}>(활동 유형 예시)</small>
                    </span>
                  </div>
                ))}
              </div>
              <p className="recommendation-reason">{rec.reason}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
