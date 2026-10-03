'use client';

import { Icon, Tag, Button, PageHeader } from '@/components/ui';
import { useSpectopRecord } from '@/lib/useSpectopRecord';

export default function RoadmapPage() {
  const { record, hydrated, toggleRoadmap } = useSpectopRecord();

  if (!hydrated) {
    return <p style={{ color: 'var(--muted)', fontSize: 14 }}>불러오는 중...</p>;
  }

  const completed = record.roadmap.filter((r) => r.is_completed).length;
  const progress = record.roadmap.length ? Math.round((completed / record.roadmap.length) * 100) : 0;

  return (
    <>
      <PageHeader title="로드맵" description={`목표 지원일(${record.career_goal_date || '미확인'})까지의 단계별 마일스톤이에요.`} />

      <section className="roadmap-progress">
        <div><span>로드맵 달성률</span><b>{progress}%</b></div>
        <div className="roadmap-progress-track"><i style={{ width: `${progress}%` }} /></div>
        <small>{completed} / {record.roadmap.length} 완료</small>
      </section>

      <div className="growth-timeline">
        {record.roadmap.map((item, index) => (
          <article className="growth-event" key={item.id}>
            <div className="growth-line">
              <span className={item.is_completed ? 'latest' : ''}>{item.is_completed ? <Icon name="check" size={16} /> : ''}</span>
            </div>
            <time>
              {item.month}
              {index === 0 && <Tag tone="indigo">가장 이른 순</Tag>}
            </time>
            <div className="growth-card">
              <div className="growth-card-head">
                <Tag tone={item.is_completed ? 'teal' : 'gray'}>{item.category}</Tag>
                <h3>{item.title}</h3>
              </div>
              <p>{item.description}</p>
              <Button variant={item.is_completed ? 'secondary' : 'primary'} onClick={() => toggleRoadmap(item.id)}>
                {item.is_completed ? '완료 취소' : '완료 체크'}
              </Button>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
