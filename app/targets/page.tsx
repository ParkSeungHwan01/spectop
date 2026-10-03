'use client';

import { Suspense, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Icon, Tag, Button, PageHeader } from '@/components/ui';
import { useSpectopRecord } from '@/lib/useSpectopRecord';
import { COMPANY_CATALOG, type CompanyBaseline } from '@/lib/companies';
import { buildGapResults } from '@/lib/spectopAnalysis';
import type { GapResultItem } from '@/lib/types';

function ResultTag({ status }: { status: GapResultItem['status'] }) {
  const tone = status === '충분' ? 'teal' : status === '보완' ? 'amber' : 'red';
  return <Tag tone={tone}>{status}</Tag>;
}

export default function TargetsPage() {
  return (
    <Suspense fallback={<p style={{ color: 'var(--muted)', fontSize: 14 }}>불러오는 중...</p>}>
      <TargetsPageInner />
    </Suspense>
  );
}

function TargetsPageInner() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') === 'analysis' ? 'analysis' : 'targets';
  const [tab, setTab] = useState<'targets' | 'analysis'>(initialTab);

  const { record, hydrated, toggleCompany, updateCareerGoalDate, isAnalyzing, runReanalysis } = useSpectopRecord();

  const [query, setQuery] = useState('');
  const [goalDateInput, setGoalDateInput] = useState('');
  const [editingDate, setEditingDate] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const keyword = query.trim();

  const results = useMemo(() => {
    const q = keyword.toLowerCase();
    if (!q) return [];
    return COMPANY_CATALOG.filter((c) =>
      c.company.toLowerCase().replace(/[()]/g, ' ').split(/\s+/).filter(Boolean).some((token) => token.startsWith(q))
    );
  }, [keyword]);

  if (!hydrated) {
    return <p style={{ color: 'var(--muted)', fontSize: 14 }}>불러오는 중...</p>;
  }

  const selectedIds = record.company_demo_profiles.map((c) => c.id);
  const companies = record.company_demo_profiles;
  const active: CompanyBaseline | undefined = companies.find((c) => c.id === activeId) ?? companies[0];
  const rows = active ? buildGapResults(record, active) : [];

  return (
    <>
      <PageHeader
        title="관심 직무·기업"
        description={tab === 'analysis' ? '선택한 기업의 비교 기준과 내 스펙을 비교해 보완이 필요한 순서대로 정리했어요.' : '비교하고 싶은 기업을 검색해 선택해주세요.'}
        action={
          tab === 'analysis' && companies.length > 0 ? (
            <Button variant="secondary" icon="refresh" onClick={runReanalysis} disabled={isAnalyzing}>
              {isAnalyzing ? '분석 갱신 중...' : '분석 갱신'}
            </Button>
          ) : undefined
        }
      />

      <div className="subtabs">
        <button className={tab === 'targets' ? 'active' : ''} onClick={() => setTab('targets')}>
          관심 직무·기업
          {companies.length > 0 && <span className="subtab-count">{companies.length}</span>}
        </button>
        <button className={tab === 'analysis' ? 'active' : ''} onClick={() => setTab('analysis')}>
          기업별 비교 분석
        </button>
      </div>

      {tab === 'targets' ? (
        <>
          <section className="setup-card">
            <div className="setup-head">
              <span>00</span>
              <div>
                <h2>목표 지원 시점</h2>
                <p>준비 로드맵의 남은 기간 계산에 사용돼요.</p>
              </div>
            </div>
            {!editingDate ? (
              <div className="registered-row" style={{ marginTop: 18 }}>
                <div><h3>{record.career_goal_date || '미확인'}</h3></div>
                <Button variant="secondary" icon="edit" onClick={() => { setGoalDateInput(record.career_goal_date?.slice(0, 7) || ''); setEditingDate(true); }}>
                  수정
                </Button>
              </div>
            ) : (
              <div className="form-grid" style={{ marginTop: 18 }}>
                <label>
                  <span>목표 지원 시점</span>
                  <input type="month" value={goalDateInput} onChange={(e) => setGoalDateInput(e.target.value)} />
                </label>
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
                  <Button icon="check" onClick={() => { updateCareerGoalDate(goalDateInput ? `${goalDateInput}-01` : ''); setEditingDate(false); }}>저장</Button>
                  <Button variant="secondary" icon="x" onClick={() => setEditingDate(false)}>취소</Button>
                </div>
              </div>
            )}
          </section>

          <section className="setup-card">
            <div className="setup-head">
              <span>01</span>
              <div>
                <h2>관심 기업 검색</h2>
                <p>기업명을 검색한 뒤 비교할 기업을 체크해주세요. 여러 곳을 선택할 수 있어요.</p>
              </div>
            </div>

            <div className="company-search">
              <Icon name="search" size={18} />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="기업명을 입력해 검색해보세요 (예: 네, 카카오)" />
              {query && (
                <button className="search-clear" onClick={() => setQuery('')} aria-label="검색어 지우기">
                  <Icon name="x" size={16} />
                </button>
              )}
            </div>

            <div className="company-options">
              {!keyword ? (
                <p className="company-empty">기업명을 입력하면 검색 결과가 나타나요.</p>
              ) : results.length === 0 ? (
                <p className="company-empty">'{keyword}'(으)로 시작하는 기업을 찾지 못했어요.</p>
              ) : (
                results.map((company) => {
                  const checked = selectedIds.includes(company.id);
                  return (
                    <label className={`company-option ${checked ? 'checked' : ''}`} key={company.id}>
                      <input type="checkbox" checked={checked} onChange={() => toggleCompany(company)} />
                      <span className="company-option-main">
                        <b>{company.company}</b>
                        <small>{company.job} · {company.industry}</small>
                      </span>
                      <span className="company-option-meta">
                        평균 학점 {company.avg_grade} · 평균 실무 {company.avg_career_months}개월
                      </span>
                    </label>
                  );
                })
              )}
            </div>
          </section>

          <section className="setup-card">
            <div className="setup-head">
              <span>02</span>
              <div>
                <h2>선택한 기업 {companies.length}곳</h2>
                <p>각 기업의 비교 기준이에요. 첫 번째 기업이 리포트의 기본 비교 대상이 돼요.</p>
              </div>
            </div>

            {companies.length === 0 ? (
              <p className="company-empty">아직 선택한 기업이 없어요. 위에서 비교할 기업을 선택해주세요.</p>
            ) : (
              companies.map((d, index) => (
                <div className="selected-company" key={d.id}>
                  <div className="selected-company-head">
                    <span className="company-logo">{d.company.slice(0, 1)}</span>
                    <div>
                      <b>{d.company}</b>
                      <small>{d.job} · {d.industry}</small>
                    </div>
                    {index === 0 && <Tag tone="indigo">기본 비교 대상</Tag>}
                    <button className="trash-button" onClick={() => toggleCompany(d)} aria-label="선택 해제">
                      <Icon name="trash" size={18} />
                    </button>
                  </div>
                  <div className="target-info-grid">
                    <div><span>평균 학점</span><b>{d.avg_grade} / 4.5</b></div>
                    <div><span>평균 프로젝트 수</span><b>{d.avg_projects}개</b></div>
                    <div><span>평균 실무 경력</span><b>{d.avg_career_months}개월</b></div>
                  </div>
                  <div className="target-skills">
                    <span>필수 기술 스택</span>
                    <div className="summary-labels">{d.required_skills.map((s) => <Tag key={s} tone="indigo">{s}</Tag>)}</div>
                  </div>
                  <div className="target-skills">
                    <span>CS 기준선</span>
                    <p>{d.cs_standards}</p>
                  </div>
                </div>
              ))
            )}
          </section>

          <div className="target-bottom">
            <div>
              <Icon name="info" size={18} />
              <p>비교 기준은 가상의 데모 데이터이며, 기업의 공식 채용 기준을 의미하지 않아요.</p>
            </div>
            <Button disabled={companies.length === 0} onClick={() => setTab('analysis')}>
              비교 리포트 보기 <Icon name="chevron" size={18} />
            </Button>
          </div>
        </>
      ) : companies.length === 0 || !active ? (
        <div className="state-page">
          <span><Icon name="compare" /></span>
          <h1>비교할 기업을 먼저 선택해주세요</h1>
          <p>관심 직무·기업에서 비교하고 싶은 기업을 검색해 선택하면 비교 결과를 볼 수 있어요.</p>
          <Button onClick={() => setTab('targets')}>관심 기업 선택하기 <Icon name="chevron" size={18} /></Button>
        </div>
      ) : (
        <>
          <section className="analysis-target">
            {companies.length > 1 && (
              <div className="company-tabs">
                {companies.map((company) => (
                  <button key={company.id} className={active.id === company.id ? 'active' : ''} onClick={() => { setActiveId(company.id); setExpanded(null); }}>
                    <span>{company.company.slice(0, 1)}</span>
                    <div><b>{company.company}</b><small>{company.job}</small></div>
                    {active.id === company.id && <i />}
                  </button>
                ))}
              </div>
            )}
            <div className="analysis-meta">
              <div><span>비교 대상</span><b>{active.company} · {active.job}</b></div>
              <div><span>분석 버전</span><b>v{record.analysis_version}</b></div>
              <div><span>직무 적합도</span><b>{record.competency_scores.overall_fit}점</b></div>
              <div><span>최근 분석일시</span><b>{record.analysis_date ?? '분석 전'}</b></div>
            </div>
            <div className="analysis-state">
              <span><Icon name="check" size={15} />분석 완료</span>
              최근 갱신: {record.updated_at} · 보완이 필요한 영역 {rows.filter((g) => g.status !== '충분').length}개
            </div>
          </section>

          {isAnalyzing ? (
            <div className="loading-page">
              <div className="loading-head">
                <div className="spinner" />
                <h1>변경된 정보로 분석하고 있어요</h1>
                <p>내 스펙을 선택한 기업의 비교 기준과 같은 방식으로 다시 정리하는 중이에요.</p>
              </div>
              <div className="skeleton-card"><i /><i /><i /><i /><i /></div>
            </div>
          ) : (
            <section className="comparison-section">
              <div className="section-heading">
                <div><span>01</span><h2>내 스펙과 비교 기준 비교</h2></div>
                <p>격차가 큰 순서대로 정렬했어요. 행을 누르면 상세 근거를 볼 수 있어요.</p>
              </div>
              <div className="comparison-table">
                <div className="table-head">
                  <span>우선순위 · 평가 영역</span><span>내 상태</span><span>비교 기준</span><span>진단</span><span />
                </div>
                {rows.map((g) => (
                  <div className={`table-group ${expanded === g.domain ? 'expanded' : ''}`} key={g.domain}>
                    <button className="table-row" onClick={() => setExpanded(expanded === g.domain ? null : g.domain)}>
                      <span className="item-name">
                        <em className={`rank-badge ${g.status === '충분' ? 'muted' : ''}`}>{g.priority}</em>
                        {g.domain}
                      </span>
                      <span>{g.user_status}</span>
                      <span>{g.target_standard}</span>
                      <span><ResultTag status={g.status} /></span>
                      <Icon name="chevron" size={18} />
                    </button>
                    {expanded === g.domain && (
                      <div className="row-detail">
                        <div><span className="detail-label">점수</span><p>{g.user_score}점 / {g.target_score}점 (격차 {g.gap >= 0 ? `+${g.gap}` : g.gap}점)</p></div>
                        <div><span className="detail-label">보완 순서</span><p>{g.priority}</p></div>
                        <div><span className="detail-label">설명</span><p>{g.description}</p></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="comparison-foot">
                <Icon name="info" size={17} />
                <p>비교 기준은 가상의 데모 데이터이며, 기업의 공식 채용 기준이나 합격 가능성을 의미하지 않아요.</p>
              </div>
            </section>
          )}
        </>
      )}
    </>
  );
}
