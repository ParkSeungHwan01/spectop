'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useSpecTopState } from '@/lib/storage';
import { getCandidatesByCompany, getCompanyProfile } from '@/lib/virtualData';
import { COMPETENCY_DOMAINS, CompetencyDomainId } from '@/lib/types';
import { computeGapResults, CompetencyLevel } from '@/lib/scoring';
import { Icon, Tag, Button, PageHeader } from '@/components/ui';

const LEVEL_TONE: Record<CompetencyLevel, 'teal' | 'amber' | 'red' | 'gray'> = {
  '강점': 'teal',
  '양호': 'amber',
  '보완 필요': 'red',
  '미확인': 'gray',
};

const LEVEL_SCORE_CLASS: Record<CompetencyLevel, string> = {
  '강점': 'score-teal',
  '양호': 'score-amber',
  '보완 필요': 'score-indigo',
  '미확인': 'score-gray',
};

export default function AnalysisPage() {
  const { state, setState, hydrated } = useSpecTopState();
  const [justReanalyzed, setJustReanalyzed] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const handleReanalyze = () => {
    setState((prev) => ({ ...prev, analysisVersion: prev.analysisVersion + 1 }));
    setJustReanalyzed(true);
    setTimeout(() => setJustReanalyzed(false), 3000);
  };

  if (!hydrated) {
    return <p style={{ color: 'var(--muted)', fontSize: 14 }}>불러오는 중...</p>;
  }

  const companyProfile = getCompanyProfile(state.careerGoal.targetCompany);

  if (!companyProfile) {
    return (
      <div className="state-page">
        <span><Icon name="compare" /></span>
        <h1>먼저 목표 기업을 선택해주세요</h1>
        <p>목표 기업을 선택하면 가상 비교 데이터와 역량 분석을 볼 수 있어요.</p>
        <Link href="/goal" className="btn btn-primary">
          목표 설정하러 가기 <Icon name="chevron" size={18} />
        </Link>
      </div>
    );
  }

  const candidates = getCandidatesByCompany(state.careerGoal.targetCompany);

  const domainLabels = COMPETENCY_DOMAINS.reduce((acc, d) => {
    acc[d.id] = d.label;
    return acc;
  }, {} as Record<CompetencyDomainId, string>);

  const gapResults = computeGapResults(companyProfile, state.experiences, domainLabels);

  return (
    <>
      <PageHeader
        title="역량 분석"
        description="데모용 가상 합격자 데이터 · AI 생성 · 실제 채용 통계 아님"
        action={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <small style={{ color: 'var(--muted)' }}>분석 버전 v{state.analysisVersion}</small>
            <Button onClick={handleReanalyze} icon="refresh">
              다시 분석하기
            </Button>
          </div>
        }
      />

      {justReanalyzed && (
        <p style={{ color: 'var(--teal)', fontSize: 12, fontWeight: 600, marginTop: -16, marginBottom: 16 }}>
          최신 경험을 반영해 재분석했습니다 (v{state.analysisVersion}).
        </p>
      )}

      <section className="analysis-target">
        <div className="analysis-meta">
          <div><span>비교 대상</span><b>{companyProfile.target_company} · {companyProfile.target_job}</b></div>
          <div><span>중점 기준</span><b>{companyProfile.company_focus}</b></div>
          <div><span>분석 버전</span><b>v{state.analysisVersion}</b></div>
          <div><span>보완이 필요한 영역</span><b>{gapResults.filter((g) => g.level !== '강점' && g.level !== '양호').length}개</b></div>
        </div>
      </section>

      <section className="comparison-section" style={{ marginBottom: 32 }}>
        <div className="section-heading">
          <div>
            <span>01</span>
            <h2>내 역량과 가상 기준 비교</h2>
          </div>
          <p>세부기준 4개 × 25점 규칙으로 계산해요. 근거가 없으면 0점이 아니라 미확인으로 표시해요.</p>
        </div>

        <div className="comparison-table">
          <div className="table-head">
            <span>평가 영역</span><span>내 점수</span><span>참고 기준</span><span>단계</span><span />
          </div>
          {gapResults.map((r) => {
            const domainLabel = domainLabels[r.domain];
            return (
              <div className={`table-group ${expanded === r.domain ? 'expanded' : ''}`} key={r.domain}>
                <button className="table-row" onClick={() => setExpanded(expanded === r.domain ? null : r.domain)}>
                  <span className="item-name">{domainLabel}</span>
                  <span>{r.userScore === null ? '미확인' : `${r.userScore}점`}</span>
                  <span>{r.targetScore}점</span>
                  <span><Tag tone={LEVEL_TONE[r.level]}>{r.level}</Tag></span>
                  <Icon name="chevron" size={18} />
                </button>
                {expanded === r.domain && (
                  <div className="row-detail">
                    <div>
                      <span className="detail-label">점수 차이</span>
                      <p>
                        {r.gap === null
                          ? '근거 부족으로 차이를 계산할 수 없어요.'
                          : r.gap > 0
                          ? `참고 기준보다 ${r.gap}점 낮아요.`
                          : `참고 기준보다 ${Math.abs(r.gap)}점 높아요.`}
                      </p>
                    </div>
                    <div>
                      <span className="detail-label">근거</span>
                      <p>{r.reason}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="comparison-foot">
          <Icon name="info" size={17} />
          <p>비교 기준과 가상 합격자 프로필은 데모용 가상 데이터이며, 실제 채용 통계나 합격 가능성을 의미하지 않아요.</p>
        </div>
      </section>

      <section>
        <div className="section-heading">
          <div>
            <span>02</span>
            <h2>가상 합격자 프로필 ({candidates.length})</h2>
          </div>
        </div>
        <div className="recommendation-grid">
          {candidates.map((cand) => (
            <div className="recommendation-card" key={cand.id}>
              <div className="recommendation-card-head">
                <Tag tone="indigo">가상 데이터</Tag>
              </div>
              <h3>{cand.school}</h3>
              <small style={{ color: 'var(--muted)' }}>{cand.status}</small>
              <div className="summary-labels">
                {cand.tech_stack.map((s, i) => <Tag key={i}>{s}</Tag>)}
              </div>
              <div className="recommendation-body">
                {COMPETENCY_DOMAINS.map((d) => (
                  <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{d.label}</span>
                    <b style={{ fontSize: 12 }}>{cand.domain_scores[d.id]}점</b>
                  </div>
                ))}
              </div>
              <p className="recommendation-reason">{cand.example_experience}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
