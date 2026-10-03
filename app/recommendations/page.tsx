'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon, Tag, Button, PageHeader } from '@/components/ui';
import { useSpectopRecord } from '@/lib/useSpectopRecord';

const PER_CATEGORY = 3;

export default function RecommendationsPage() {
  const router = useRouter();
  const { record, hydrated, addRecToRoadmap } = useSpectopRecord();
  const [activeDomain, setActiveDomain] = useState<string | null>(null);

  if (!hydrated) {
    return <p style={{ color: 'var(--muted)', fontSize: 14 }}>불러오는 중...</p>;
  }

  const deficient = record.gap_results.filter((g) => g.status !== '충분');

  if (deficient.length === 0) {
    return (
      <>
        <PageHeader title="추천 활동" description="비교 결과에서 보완이 필요한 영역의 활동을 안내해요." />
        <div className="state-page">
          <span><Icon name="check" /></span>
          <h1>보완이 필요한 영역이 없어요</h1>
          <p>선택한 기업의 비교 기준을 모두 충족하고 있어요. 관심 기업을 추가하면 다시 비교할 수 있어요.</p>
          <Button onClick={() => router.push('/targets')}>관심 기업 추가하기 <Icon name="chevron" size={18} /></Button>
        </div>
      </>
    );
  }

  const selected = deficient.find((g) => g.domain === activeDomain) ?? deficient[0];
  const items = record.recommendations.filter((r) => r.target_gap === selected.domain).slice(0, PER_CATEGORY);

  return (
    <>
      <PageHeader
        title="추천 활동"
        description="보완이 필요한 영역을 선택하면 해당 영역을 채울 수 있는 활동을 보여드려요."
        action={<Button variant="secondary" icon="chevron" onClick={() => router.push('/roadmap')}>현재 로드맵 보기</Button>}
      />

      <section className="domain-section">
        <div className="section-heading">
          <div><span>01</span><h2>보완이 필요한 영역</h2></div>
          <p>{record.target_company} 비교 기준에서 격차가 큰 순서예요.</p>
        </div>
        <div className="domain-chips">
          {deficient.map((g) => (
            <button
              key={g.domain}
              className={`domain-chip ${selected.domain === g.domain ? 'active' : ''}`}
              onClick={() => setActiveDomain(g.domain)}
            >
              <span className="domain-chip-rank">{g.priority}</span>
              <b>{g.domain}</b>
              <Tag tone={g.status === '보완' ? 'amber' : 'red'}>{g.status}</Tag>
            </button>
          ))}
        </div>
      </section>

      <section className="domain-section">
        <div className="section-heading">
          <div><span>02</span><h2>{selected.domain} 추천 활동</h2></div>
          <p>이 영역을 보완할 수 있는 활동 {items.length}개예요. 실제 모집 공고가 아니라 활동 유형 예시예요.</p>
        </div>
        <div className="recommendation-list">
          {items.map((rec) => (
            <article className="recommendation-card" key={rec.id}>
              <div className="recommendation-card-head">
                <Tag tone="indigo">{rec.category}</Tag>
              </div>
              <h3>{rec.title}</h3>
              <p className="recommendation-reason">{rec.reason}</p>
              <div className="recommendation-foot">
                <Button
                  icon="plus"
                  variant={rec.added_to_roadmap ? 'secondary' : 'primary'}
                  disabled={rec.added_to_roadmap}
                  onClick={() => addRecToRoadmap(rec)}
                >
                  {rec.added_to_roadmap ? '로드맵 포함됨' : '로드맵에 추가'}
                </Button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
