'use client';

import Link from 'next/link';
import { useSpecTopState } from '@/lib/storage';
import { getCompanyProfile } from '@/lib/virtualData';
import { COMPETENCY_DOMAINS, CompetencyDomainId } from '@/lib/types';
import { computeGapResults } from '@/lib/scoring';
import { buildRoadmap } from '@/lib/roadmap';
import { Icon, Tag, PageHeader } from '@/components/ui';

export default function RoadmapPage() {
  const { state, hydrated } = useSpecTopState();

  if (!hydrated) {
    return <p style={{ color: 'var(--muted)', fontSize: 14 }}>불러오는 중...</p>;
  }

  const companyProfile = getCompanyProfile(state.careerGoal.targetCompany);

  if (!companyProfile) {
    return (
      <div className="state-page">
        <span><Icon name="clock" /></span>
        <h1>먼저 목표 기업을 선택해주세요</h1>
        <p>목표 기업을 선택하면 단계별 로드맵을 볼 수 있어요.</p>
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
  const { steps, monthsRemaining } = buildRoadmap(gapResults, companyProfile, domainLabels, state.careerGoal.careerGoalDate);

  const groupedByPhase = steps.reduce((acc, step) => {
    (acc[step.phaseLabel] ??= []).push(step);
    return acc;
  }, {} as Record<string, typeof steps>);

  return (
    <>
      <PageHeader
        title={`${companyProfile.target_company} 커리어 로드맵`}
        description={`${companyProfile.company_focus} 기준으로, 가중치가 높고 현재 GAP이 큰 역량을 먼저 배치했어요.${
          state.careerGoal.careerGoalDate
            ? ` 목표 지원 시점: ${state.careerGoal.careerGoalDate} (약 ${monthsRemaining}개월 남음)`
            : ' 목표 지원 시점을 설정하면 남은 기간이 표시돼요.'
        }`}
      />

      <div className="growth-timeline">
        {Object.entries(groupedByPhase).map(([phaseLabel, phaseSteps], phaseIndex) => (
          <article className="growth-event" key={phaseLabel}>
            <div className="growth-line">
              <span className={phaseIndex === 0 ? 'latest' : ''}>
                {phaseIndex === 0 ? <Icon name="check" size={16} /> : ''}
              </span>
            </div>
            <time>
              {phaseSteps[0]?.durationLabel}
              {phaseIndex === 0 && <Tag tone="indigo">지금 시작</Tag>}
            </time>
            <div>
              {phaseSteps.map((step, i) => (
                <div className="growth-card" key={i}>
                  <div className="growth-card-head">
                    <Tag tone="teal">{step.domainLabel}</Tag>
                    <h3>{phaseLabel}</h3>
                  </div>
                  <p><b>{step.action}</b></p>
                  <p>{step.reason}</p>
                  <p style={{ color: '#98a2b3', fontSize: 11, borderTop: '1px solid var(--line)', paddingTop: 10, width: '100%' }}>
                    완료 조건: {step.completionCondition}
                  </p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
