'use client';

import { useRouter } from 'next/navigation';
import { Icon, Tag, Button, PageHeader } from '@/components/ui';
import { useSpectopRecord } from '@/lib/useSpectopRecord';

const COLLECTION_KEYS = [
  'language_tests', 'certificates', 'awards', 'clubs',
  'external_activities', 'course_history', 'projects', 'careers',
] as const;

export default function ReportPage() {
  const router = useRouter();
  const { record, hydrated } = useSpectopRecord();

  if (!hydrated) {
    return <p style={{ color: 'var(--muted)', fontSize: 14 }}>불러오는 중...</p>;
  }

  const registeredCollections = COLLECTION_KEYS.filter((k) => (record[k] as unknown[]).length > 0).length;
  const shortageCount = record.gap_results.filter((g) => g.status === '부족').length;
  const roadmapProgress = record.roadmap.length
    ? Math.round((record.roadmap.filter((r) => r.is_completed).length / record.roadmap.length) * 100)
    : 0;
  const deficientDomains = record.gap_results.filter((g) => g.status !== '충분').map((g) => g.domain);
  const nextRecommendation =
    record.recommendations.find((r) => !r.added_to_roadmap && deficientDomains.includes(r.target_gap)) ??
    record.recommendations.find((r) => !r.added_to_roadmap);

  return (
    <>
      <PageHeader title="리포트" description="등록한 정보의 완성도와 목표 기업·직무 대비 비교 결과를 확인해보세요." />

      <section className="report-overview">
        <div className="report-intro">
          <p className="report-kicker">현재 리포트 요약 · 데모용 가상 데이터</p>
          <h2>
            목표: <strong>{record.target_company || '미확인'} {record.target_job}</strong> (목표 지원일: {record.career_goal_date || '미확인'})
          </h2>
          <p>
            프로젝트 깊이({record.competency_scores.project_depth}점)와 협업({record.competency_scores.collaboration}점)은 우수하나,
            인턴 실무 밀도({record.competency_scores.career_density}점)와 CS 기본기({record.competency_scores.cs_knowledge}점)가 주요 결손으로 도출되었어요.
          </p>
          <div className="report-counts">
            <span><b>{registeredCollections}</b><small>등록된 경험 컬렉션 ({COLLECTION_KEYS.length}개 중)</small></span>
            <i />
            <span><b>{shortageCount}</b><small>부족 영역</small></span>
            <i />
            <span><b>{roadmapProgress}%</b><small>로드맵 진행률</small></span>
          </div>
        </div>
        <div className="report-definition">
          <Icon name="info" size={18} />
          <div><b>직무 적합도 점수는 무엇인가요?</b><p>스펙의 우수함이나 합격 가능성이 아니라, 등록된 정보가 목표 직무 기준과 비교 가능한 수준으로 얼마나 구체적인지를 나타내요. 실제 채용 통계가 아니에요.</p></div>
        </div>
      </section>

      <section className="report-section">
        <div className="section-heading"><div><span>01</span><h2>영역별 역량 진단</h2></div><p>목표 기업·직무 기준과 비교한 5개 영역의 점수예요.</p></div>
        {record.gap_results.length === 0 ? (
          <p style={{ color: 'var(--muted)', fontSize: 13 }}>관심 기업을 선택하면 영역별 진단이 표시돼요.</p>
        ) : (
          <div className="part-scores">
            {record.gap_results.map((g) => {
              const tone = g.status === '충분' ? 'teal' : g.status === '보완' ? 'amber' : 'gray';
              return (
                <article className="part-score" key={g.domain}>
                  <div className="part-score-head">
                    <div><h3>{g.domain}</h3><Tag tone={tone}>{g.status}</Tag></div>
                    <strong>{g.user_score}<small>점</small></strong>
                  </div>
                  <div className="score-track"><i className={`score-${tone}`} style={{ width: `${g.user_score}%` }} /></div>
                  <p>{g.description}</p>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="report-section">
        <div className="section-heading">
          <div><span>02</span><h2>선택한 관심 기업 {record.company_demo_profiles.length}곳</h2></div>
          <p>각 기업의 비교 기준이에요. 가상의 데모 데이터입니다.</p>
        </div>
        {record.company_demo_profiles.length === 0 ? (
          <div className="report-company-list">
            <article className="report-company">
              <div className="report-company-title" style={{ gridColumn: '1 / span 3' }}><div><h3>선택한 기업이 없어요</h3></div><p>관심 직무·기업에서 비교할 기업을 선택해주세요.</p></div>
              <Button variant="secondary" onClick={() => router.push('/targets')}>기업 선택하기</Button>
            </article>
          </div>
        ) : (
          <div className="report-company-list">
            {record.company_demo_profiles.map((d) => (
              <article className="report-company" key={d.id}>
                <span className="report-company-logo">{d.company.slice(0, 1)}</span>
                <div className="report-company-title">
                  <div><h3>{d.company}</h3></div>
                  <p>{d.job} · {d.industry}</p>
                </div>
                <div className="fit-reasons">
                  <span className="positive"><Icon name="check" size={15} />필수 기술: {d.required_skills.join(', ')}</span>
                  <span><Icon name="info" size={15} />{d.cs_standards}</span>
                </div>
                <Button variant="secondary" onClick={() => router.push('/targets?tab=analysis')}>비교 보기</Button>
              </article>
            ))}
          </div>
        )}
      </section>

      {nextRecommendation && (
        <section className="report-next">
          <span><Icon name="trend" size={22} /></span>
          <div><p>다음으로 보완하면 좋을 활동</p><h3>{nextRecommendation.title}</h3></div>
          <Button variant="secondary" onClick={() => router.push('/recommendations')}>추천 활동 보기</Button>
        </section>
      )}
    </>
  );
}
