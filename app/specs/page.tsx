'use client';

import { useState } from 'react';
import { Icon, Tag, Button, PageHeader } from '@/components/ui';
import type { IconName } from '@/components/ui';
import { useSpectopRecord } from '@/lib/useSpectopRecord';
import type { ProjectItem } from '@/lib/types';

type SpecCardDef = {
  id: string;
  number: string;
  name: string;
  icon: IconName;
  done: boolean;
  summary: string;
};

function Status({ done }: { done: boolean }) {
  return (
    <span className={`spec-status ${done ? 'done' : 'empty'}`}>
      {done && <Icon name="check" size={15} />} {done ? '등록 완료' : '미입력'}
    </span>
  );
}

const SCHOOL_YEAR_OPTIONS = ['1학년', '2학년', '3학년', '4학년', '졸업예정', '졸업·취업준비'];

export default function SpecsPage() {
  const { record, hydrated, addProject, updateProfile } = useSpectopRecord();
  const [open, setOpen] = useState<string[]>(['major', 'projects']);
  const toggle = (id: string) => setOpen((v) => (v.includes(id) ? v.filter((x) => x !== id) : [...v, id]));

  const [editingMajor, setEditingMajor] = useState(false);
  const [majorInput, setMajorInput] = useState('');
  const [schoolYearInput, setSchoolYearInput] = useState('');
  const [gradeInput, setGradeInput] = useState('');
  const [profileError, setProfileError] = useState<string | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newProjectForm, setNewProjectForm] = useState({
    name: '',
    role: '',
    description: '',
    skills: '',
    outcome: '',
    start_date: '2025-01',
    end_date: '2025-03',
  });
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isStructuring, setIsStructuring] = useState(false);
  const [structureError, setStructureError] = useState<string | null>(null);
  const [structureNotice, setStructureNotice] = useState<string | null>(null);

  const handleStructureWithAi = async () => {
    const description = newProjectForm.description.trim();
    if (!description) {
      setStructureError('먼저 프로젝트 내용을 입력해주세요.');
      return;
    }
    setIsStructuring(true);
    setStructureError(null);
    setStructureNotice(null);
    try {
      const res = await fetch('/api/structure-experience', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setStructureError(json.error || '잠시 후 다시 시도해주세요.');
        return;
      }
      const data = json.data as { role: string; skills: string[]; outcome: string };
      setNewProjectForm((f) => ({
        ...f,
        role: data.role || f.role,
        skills: data.skills.length > 0 ? data.skills.join(', ') : f.skills,
        outcome: data.outcome || f.outcome,
      }));
      setStructureNotice('AI가 프로젝트 내용에서 역할·기술·성과를 추출했어요. 확인하고 필요하면 수정해주세요.');
    } catch {
      setStructureError('네트워크 오류로 분석에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsStructuring(false);
    }
  };

  if (!hydrated) {
    return <p style={{ color: 'var(--muted)', fontSize: 14 }}>불러오는 중...</p>;
  }

  const activeProject = selectedProject ?? record.projects[0] ?? null;

  const openMajorEdit = () => {
    setMajorInput(record.major);
    setSchoolYearInput(record.school_year);
    setGradeInput(record.grade == null ? '' : String(record.grade));
    setProfileError(null);
    setEditingMajor(true);
  };

  const saveMajorEdit = () => {
    const major = majorInput.trim();
    if (!major) {
      setProfileError('전공을 입력해주세요.');
      return;
    }
    if (!schoolYearInput) {
      setProfileError('학년·상태를 선택해주세요.');
      return;
    }
    let grade: number | null = null;
    if (gradeInput.trim() !== '') {
      const parsed = Number(gradeInput);
      if (Number.isNaN(parsed) || parsed < 0 || parsed > 4.5) {
        setProfileError('학점은 0~4.5 사이의 숫자로 입력해주세요.');
        return;
      }
      grade = parsed;
    }
    updateProfile({ major, school_year: schoolYearInput, grade, grade_scale: grade == null ? null : 4.5 });
    setEditingMajor(false);
  };

  const cards: SpecCardDef[] = [
    { id: 'major', number: '01', name: '전공 및 학년', icon: 'book', done: !!record.major, summary: record.major ? `${record.major} · ${record.school_year}` : '입력된 정보가 없어요' },
    {
      id: 'grade', number: '02', name: '학점', icon: 'course', done: record.grade != null,
      summary: record.grade != null ? `${record.grade} / ${record.grade_scale} 만점` : '입력된 정보가 없어요',
    },
    {
      id: 'language_tests', number: '03', name: '어학', icon: 'language', done: record.language_tests.length > 0,
      summary: record.language_tests.length > 0 ? record.language_tests.map((t) => `${t.test_name} ${t.score}`).join(', ') : '입력된 정보가 없어요',
    },
    {
      id: 'certificates', number: '04', name: '자격증', icon: 'certificate', done: record.certificates.length > 0,
      summary: record.certificates.length > 0 ? record.certificates.map((c) => c.name).join(', ') : '입력된 정보가 없어요',
    },
    {
      id: 'awards', number: '05', name: '수상경력', icon: 'award', done: record.awards.length > 0,
      summary: record.awards.length > 0 ? record.awards[0].name : '입력된 정보가 없어요',
    },
    {
      id: 'clubs', number: '06', name: '동아리', icon: 'users', done: record.clubs.length > 0,
      summary: record.clubs.length > 0 ? record.clubs[0].name : '입력된 정보가 없어요',
    },
    {
      id: 'external_activities', number: '07', name: '대외활동', icon: 'activity', done: record.external_activities.length > 0,
      summary: record.external_activities.length > 0 ? record.external_activities[0].name : '입력된 정보가 없어요',
    },
    {
      id: 'course_history', number: '08', name: '수강 내역', icon: 'course', done: record.course_history.length > 0,
      summary: record.course_history.length > 0 ? `${record.course_history[0].course_name} 외 ${record.course_history.length - 1}개` : '입력된 정보가 없어요',
    },
    {
      id: 'projects', number: '09', name: '프로젝트', icon: 'project', done: record.projects.length > 0,
      summary: record.projects.length > 0 ? `${record.projects[0].name} 외 ${Math.max(record.projects.length - 1, 0)}개` : '입력된 정보가 없어요',
    },
    {
      id: 'careers', number: '10', name: '경력', icon: 'work', done: record.careers.length > 0,
      summary: record.careers.length > 0 ? record.careers[0].organization : '입력된 정보가 없어요',
    },
  ];

  const completed = cards.filter((c) => c.done).length;

  const handleAddProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!newProjectForm.name.trim()) {
      setFormError('프로젝트명을 입력해주세요.');
      return;
    }
    const skillsArray = newProjectForm.skills ? newProjectForm.skills.split(',').map((s) => s.trim()).filter(Boolean) : [];
    const newProj: ProjectItem = {
      name: newProjectForm.name.trim(),
      role: newProjectForm.role.trim(),
      description: newProjectForm.description.trim(),
      skills: skillsArray,
      outcome: newProjectForm.outcome.trim(),
      start_date: newProjectForm.start_date,
      end_date: newProjectForm.end_date,
    };
    addProject(newProj);
    setSelectedProject(newProj);
    setShowAddModal(false);
    setNewProjectForm({ name: '', role: '', description: '', skills: '', outcome: '', start_date: '2025-01', end_date: '2025-03' });
  };

  return (
    <>
      <PageHeader title="내 스펙" description="경험과 성과가 구체적으로 입력될수록 목표 기업·직무와 더 정확하게 비교할 수 있어요." />
      <div className="save-status">
        <div className="status-progress">
          <span><i style={{ width: `${(completed / cards.length) * 100}%` }} /></span>
          <div><b>{cards.length}개 항목 중 {completed}개 확인 완료</b><small>입력 현황이며 스펙 수준이나 경쟁력 점수가 아니에요.</small></div>
        </div>
        <span className="last-save"><Icon name="clock" size={17} />최근 갱신: {record.updated_at}</span>
      </div>

      <div className="spec-layout">
        <aside className="section-index">
          <p>항목 바로가기</p>
          {cards.map((c) => (
            <button key={c.id} onClick={() => document.getElementById(c.id)?.scrollIntoView({ behavior: 'smooth' })}>
              <span className={`status-dot ${c.done ? 'done' : ''}`} />
              {c.name}
              <small>{c.done ? '등록 완료' : '미입력'}</small>
            </button>
          ))}
        </aside>

        <div className="spec-sections">
          <div className="input-principle">
            <Icon name="info" size={19} />
            <p><b>데이터 컬렉션 안내.</b> 전공/학년/학점과 프로젝트는 직접 입력·수정할 수 있어요. 나머지 항목은 등록된 내용을 확인하는 용도예요. 모든 입력은 이 브라우저에 저장되고 새로고침해도 유지돼요.</p>
          </div>

          {cards.map((card) => (
            <section className={`spec-card ${open.includes(card.id) ? 'open' : ''}`} id={card.id} key={card.id}>
              <button className="spec-card-head" onClick={() => toggle(card.id)}>
                <span className="section-number">{card.number}</span>
                <span className="spec-icon"><Icon name={card.icon} /></span>
                <span className="spec-title"><b>{card.name}</b><small>{card.summary}</small></span>
                <Status done={card.done} />
                <Icon name="chevron" size={20} />
              </button>
              {open.includes(card.id) && (
                <div className="spec-card-body">
                  {card.id === 'major' && !editingMajor && (
                    <div className="registered-row">
                      <div><h3>{record.major || '미확인'}</h3><p>{record.school_year || '미확인'}</p></div>
                      <Button variant="secondary" icon="edit" onClick={openMajorEdit}>수정</Button>
                    </div>
                  )}
                  {card.id === 'major' && editingMajor && (
                    <div className="form-grid">
                      <label>
                        <span>전공 *</span>
                        <input value={majorInput} onChange={(e) => setMajorInput(e.target.value)} placeholder="예: 컴퓨터공학과" />
                      </label>
                      <label>
                        <span>학년·상태 *</span>
                        <select value={schoolYearInput} onChange={(e) => setSchoolYearInput(e.target.value)}>
                          <option value="">선택해주세요</option>
                          {SCHOOL_YEAR_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                        </select>
                      </label>
                      <label className="wide">
                        <span>학점 <small>4.5 만점, 선택 입력</small></span>
                        <input value={gradeInput} onChange={(e) => setGradeInput(e.target.value)} placeholder="예: 3.8" />
                      </label>
                      {profileError && <p style={{ color: '#9f3a38', fontSize: 12, gridColumn: '1 / -1' }}>{profileError}</p>}
                      <div style={{ display: 'flex', gap: 10, gridColumn: '1 / -1' }}>
                        <Button onClick={saveMajorEdit} icon="check">저장</Button>
                        <Button variant="secondary" onClick={() => setEditingMajor(false)} icon="x">취소</Button>
                      </div>
                    </div>
                  )}
                  {card.id === 'grade' && (
                    record.grade != null ? (
                      <div className="registered-row">
                        <div><h3>{record.grade} / {record.grade_scale}</h3><small className="basis-note"><Icon name="info" size={15} />평점은 반드시 만점 기준과 함께 비교해요.</small></div>
                        <Button variant="secondary" icon="edit" onClick={openMajorEdit}>수정</Button>
                      </div>
                    ) : (
                      <div className="empty-row">
                        <div><b>아직 입력된 학점 정보가 없어요</b><p>전공 카드에서 함께 입력할 수 있어요.</p></div>
                        <Button variant="secondary" icon="edit" onClick={openMajorEdit}>입력하기</Button>
                      </div>
                    )
                  )}
                  {card.id === 'language_tests' && (
                    record.language_tests.length ? (
                      <div className="list-rows">
                        {record.language_tests.map((t, i) => (
                          <div className="list-row" key={i}>
                            <div className="list-row-head"><b>{t.test_name} {t.score}</b><small>{t.acquired_date}</small></div>
                          </div>
                        ))}
                      </div>
                    ) : <div className="empty-row"><div><b>아직 입력된 어학 정보가 없어요</b></div></div>
                  )}
                  {card.id === 'certificates' && (
                    record.certificates.length ? (
                      <div className="list-rows">
                        {record.certificates.map((c, i) => (
                          <div className="list-row" key={i}>
                            <div className="list-row-head"><b>{c.name}</b><small>{c.issuer ?? ''} · {c.acquired_date}</small></div>
                          </div>
                        ))}
                      </div>
                    ) : <div className="empty-row"><div><b>아직 입력된 자격증 정보가 없어요</b></div></div>
                  )}
                  {card.id === 'awards' && (
                    record.awards.length ? (
                      <div className="list-rows">
                        {record.awards.map((a, i) => (
                          <div className="list-row" key={i}>
                            <div className="list-row-head"><b>{a.name}</b><small>{a.competition_name ?? ''} · {a.competition_scale ?? ''} · {a.award_date}</small></div>
                          </div>
                        ))}
                      </div>
                    ) : <div className="empty-row"><div><b>아직 입력된 수상경력이 없어요</b></div></div>
                  )}
                  {card.id === 'clubs' && (
                    record.clubs.length ? (
                      <div className="list-rows">
                        {record.clubs.map((c, i) => (
                          <div className="list-row" key={i}>
                            <div className="list-row-head"><b>{c.name}</b><small>{c.role ?? ''} · {c.start_date} ~ {c.end_date ?? ''}</small></div>
                            {c.description && <p>{c.description}</p>}
                          </div>
                        ))}
                      </div>
                    ) : <div className="empty-row"><div><b>아직 입력된 동아리 정보가 없어요</b></div></div>
                  )}
                  {card.id === 'external_activities' && (
                    record.external_activities.length ? (
                      <div className="list-rows">
                        {record.external_activities.map((a, i) => (
                          <div className="list-row" key={i}>
                            <div className="list-row-head"><b>{a.name}</b><small>{a.organization ?? ''} · {a.role ?? ''} · {a.start_date} ~ {a.end_date ?? ''}</small></div>
                            {a.description && <p>{a.description}</p>}
                          </div>
                        ))}
                      </div>
                    ) : <div className="empty-row"><div><b>아직 입력된 대외활동이 없어요</b></div></div>
                  )}
                  {card.id === 'course_history' && (
                    record.course_history.length ? (
                      <div className="course-grid">
                        {record.course_history.map((c, i) => (
                          <div className="course-tile" key={i}>
                            <small>{c.year}년 {c.semester}</small>
                            <b>{c.course_name}</b>
                            {c.grade && <Tag tone="teal">{c.grade}</Tag>}
                          </div>
                        ))}
                      </div>
                    ) : <div className="empty-row"><div><b>아직 입력된 수강 내역이 없어요</b></div></div>
                  )}
                  {card.id === 'projects' && (
                    record.projects.length && activeProject ? (
                      <div className="project-collection">
                        <div className="project-list">
                          {record.projects.map((p, i) => {
                            const isSelected = activeProject.name === p.name;
                            return (
                              <button key={i} className={`project-row ${isSelected ? 'selected' : ''}`} onClick={() => setSelectedProject(p)}>
                                <div><b>{p.name}</b><small>{p.role} · {p.start_date} ~ {p.end_date ?? '진행중'}</small></div>
                                <div className="summary-labels">{p.skills.slice(0, 3).map((s) => <Tag key={s}>{s}</Tag>)}</div>
                              </button>
                            );
                          })}
                        </div>
                        <div className="project-detail">
                          <h3>{activeProject.name}</h3>
                          <p>{activeProject.description}</p>
                          {activeProject.outcome && <div className="project-outcome"><Icon name="check" size={16} />{activeProject.outcome}</div>}
                          <div className="summary-labels">{activeProject.skills.map((s) => <Tag key={s} tone="indigo">{s}</Tag>)}</div>
                        </div>
                      </div>
                    ) : <div className="empty-row"><div><b>아직 입력된 프로젝트가 없어요</b><p>등록된 내용이 생기면 자동으로 비교 분석에 반영돼요.</p></div></div>
                  )}
                  {card.id === 'careers' && (
                    record.careers.length ? (
                      <div className="list-rows">
                        {record.careers.map((c, i) => (
                          <div className="list-row" key={i}>
                            <div className="list-row-head"><b>{c.organization} · {c.career_type}</b><small>{c.role ?? ''} · {c.start_date} ~ {c.end_date ?? ''}</small></div>
                            {c.description && <p>{c.description}</p>}
                          </div>
                        ))}
                      </div>
                    ) : <div className="empty-row"><div><b>아직 입력된 경력이 없어요</b></div></div>
                  )}

                  {card.id === 'projects' && (
                    <button className="inline-add" onClick={() => setShowAddModal(true)}>
                      <Icon name="plus" size={17} />프로젝트 추가하기
                    </button>
                  )}
                </div>
              )}
            </section>
          ))}

          <div className="bottom-save">
            <div><b>등록된 스펙은 자동으로 비교 분석에 반영돼요</b><p>목표 직무·기업을 확인한 뒤 비교 분석 결과를 확인해보세요.</p></div>
            <Button onClick={() => (window.location.href = '/targets')}>관심 직무·기업 확인하기 <Icon name="chevron" size={18} /></Button>
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="overlay" onMouseDown={() => setShowAddModal(false)}>
          <aside className="drawer" onMouseDown={(e) => e.stopPropagation()}>
            <header>
              <div><span>09</span><h2>프로젝트 추가</h2></div>
              <button onClick={() => setShowAddModal(false)}><Icon name="x" /></button>
            </header>
            <div className="drawer-guide">
              <Icon name="info" size={18} />
              <p>프로젝트명은 필수이며, 나머지 항목은 비워두면 비어있는 상태로 저장돼요 (임의로 채우지 않아요).</p>
            </div>
            <form onSubmit={handleAddProjectSubmit}>
              <div className="form-grid">
                <label className="wide">
                  <span>프로젝트명 *</span>
                  <input required placeholder="예: 분산 캐시 기반 대규모 좌석 예매 시스템" value={newProjectForm.name} onChange={(e) => setNewProjectForm({ ...newProjectForm, name: e.target.value })} />
                </label>
                <label>
                  <span>담당 역할</span>
                  <input placeholder="예: 백엔드 팀장" value={newProjectForm.role} onChange={(e) => setNewProjectForm({ ...newProjectForm, role: e.target.value })} />
                </label>
                <label>
                  <span>사용 기술 <small>쉼표로 구분</small></span>
                  <input placeholder="예: Spring Boot, Redis, Kafka" value={newProjectForm.skills} onChange={(e) => setNewProjectForm({ ...newProjectForm, skills: e.target.value })} />
                </label>
                <label className="wide">
                  <span>프로젝트 내용</span>
                  <textarea placeholder="프로젝트 목표 및 구조" value={newProjectForm.description} onChange={(e) => setNewProjectForm({ ...newProjectForm, description: e.target.value })} />
                </label>
                <div style={{ gridColumn: '1 / -1', marginTop: -8 }}>
                  <Button type="button" variant="secondary" icon={isStructuring ? 'refresh' : 'link'} onClick={handleStructureWithAi} disabled={isStructuring}>
                    {isStructuring ? 'AI가 분석 중...' : 'AI로 역할·기술·성과 채우기'}
                  </Button>
                  {structureError && <p style={{ color: '#9f3a38', fontSize: 11, marginTop: 6 }}>{structureError}</p>}
                  {structureNotice && !structureError && <p style={{ color: 'var(--teal)', fontSize: 11, marginTop: 6 }}>{structureNotice}</p>}
                </div>
                <label className="wide">
                  <span>성과</span>
                  <input placeholder="예: 초당 트랜잭션 1,200 TPS 달성" value={newProjectForm.outcome} onChange={(e) => setNewProjectForm({ ...newProjectForm, outcome: e.target.value })} />
                </label>
                <label>
                  <span>시작일</span>
                  <input type="month" value={newProjectForm.start_date} onChange={(e) => setNewProjectForm({ ...newProjectForm, start_date: e.target.value })} />
                </label>
                <label>
                  <span>종료일</span>
                  <input type="month" value={newProjectForm.end_date} onChange={(e) => setNewProjectForm({ ...newProjectForm, end_date: e.target.value })} />
                </label>
              </div>
              {formError && <p style={{ color: '#9f3a38', fontSize: 12, padding: '0 28px' }}>{formError}</p>}
              <footer>
                <Button variant="secondary" onClick={() => setShowAddModal(false)}>취소</Button>
                <Button type="submit">프로젝트 추가</Button>
              </footer>
            </form>
          </aside>
        </div>
      )}
    </>
  );
}
