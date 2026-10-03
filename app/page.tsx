'use client';

import Link from 'next/link';
import { Icon, Tag } from '@/components/ui';

const STEPS = [
  { no: '01', title: '내 스펙 등록', desc: '전공과 학점, 프로젝트, 경력 등 지금까지의 경험을 등록해요.' },
  { no: '02', title: '관심 기업·직무 선택', desc: '비교 기준이 될 목표 기업과 직무를 설정해요.' },
  { no: '03', title: '기업별 비교와 보완 우선순위 확인', desc: '합격자 사례와 비교해 먼저 보완할 항목과 준비 방향을 확인해요.' },
];

const PREVIEW_ROWS: { label: string; status: string; tone: 'teal' | 'amber' | 'red' }[] = [
  { label: '프로젝트 경험', status: '충분', tone: 'teal' },
  { label: '기술 스택 심도', status: '보완', tone: 'amber' },
  { label: '인턴 · 실무 경험', status: '부족', tone: 'red' },
];

export default function Home() {
  return (
    <>
      <section className="home-hero">
        <div className="home-copy">
          <p className="home-kicker">목표 기업에 가까워지는 스펙 설계 · 데모용 가상 데이터</p>
          <h1>내 스펙, 무엇부터 보완해야 할까?</h1>
          <p className="home-lead">
            관심 기업과 직무를 선택하면, 보완할 부분을 분석하고 그에 맞는 로드맵을 제안해드려요.
          </p>
          <Link href="/specs" className="btn btn-primary">
            내 스펙 입력하기 <Icon name="chevron" size={18} />
          </Link>
        </div>

        <aside className="home-preview">
          <div className="home-preview-head">
            <Tag tone="gray">예시 화면</Tag>
            <span>실제 분석 결과가 아니에요</span>
          </div>

          <div className="preview-block">
            <span className="preview-label">01 기업별 비교</span>
            <div className="preview-rows">
              {PREVIEW_ROWS.map((row) => (
                <div key={row.label}>
                  <b>{row.label}</b>
                  <Tag tone={row.tone}>{row.status}</Tag>
                </div>
              ))}
            </div>
          </div>

          <div className="preview-arrow">
            <Icon name="chevron" size={16} />
          </div>

          <div className="preview-block">
            <span className="preview-label">02 보완 우선순위</span>
            <div className="preview-priority">
              <b>1순위</b>
              <span>인턴 · 실무 경험</span>
            </div>
          </div>

          <div className="preview-arrow">
            <Icon name="chevron" size={16} />
          </div>

          <div className="preview-block">
            <span className="preview-label">03 준비 방향</span>
            <p className="preview-direction">채용연계형 인턴십으로 실무 경험을 먼저 채워보세요.</p>
          </div>
        </aside>
      </section>

      <section className="home-steps">
        <div className="section-heading">
          <div>
            <span>HOW</span>
            <h2>이용 방법</h2>
          </div>
          <p>세 단계로 내 스펙의 보완 우선순위를 확인할 수 있어요.</p>
        </div>
        <div className="step-grid">
          {STEPS.map((step) => (
            <article className="step-card" key={step.no}>
              <span className="step-no">{step.no}</span>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
