'use client';

import { useState } from 'react';
import { useSpecTopState } from '@/lib/storage';
import { EXPERIENCE_TYPES, Experience, ExperienceType } from '@/lib/types';
import { Icon, Tag, Button, PageHeader } from '@/components/ui';

function generateId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `exp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

const EMPTY_FORM = {
  type: '프로젝트' as ExperienceType,
  title: '',
  role: '',
  skills: '',
  outcome: '',
  startDate: '',
  endDate: '',
  description: '',
};

interface StructureApiResult {
  activityType: ExperienceType | '';
  role: string;
  skills: string[];
  outcome: string;
}

export default function ExperiencesPage() {
  const { state, setState, hydrated } = useSpecTopState();

  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isStructuring, setIsStructuring] = useState(false);
  const [structureError, setStructureError] = useState<string | null>(null);
  const [structureNotice, setStructureNotice] = useState<string | null>(null);

  const handleStructureWithAi = async () => {
    const description = form.description.trim();
    if (!description) {
      setStructureError('먼저 경험 설명을 입력해주세요.');
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

      const data = json.data as StructureApiResult;
      setForm((f) => ({
        ...f,
        type: data.activityType || f.type,
        role: data.role || f.role,
        skills: data.skills.length > 0 ? data.skills.join(', ') : f.skills,
        outcome: data.outcome || f.outcome,
      }));
      setStructureNotice('AI가 설명에서 활동 유형·역할·기술·성과를 추출했습니다. 내용을 확인하고 필요하면 수정해주세요.');
    } catch {
      setStructureError('네트워크 오류로 분석에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsStructuring(false);
    }
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setError(null);
    setStructureError(null);
    setStructureNotice(null);
  };

  const handleSubmit = () => {
    setError(null);
    const title = form.title.trim();
    if (!title) {
      setError('활동명을 입력해주세요.');
      return;
    }
    if (!form.startDate) {
      setError('시작 시점을 입력해주세요.');
      return;
    }

    const now = new Date().toISOString();

    if (editingId) {
      setState((prev) => ({
        ...prev,
        experiences: prev.experiences.map((exp) =>
          exp.id === editingId
            ? {
                ...exp,
                type: form.type,
                title,
                role: form.role.trim(),
                skills: form.skills.trim(),
                outcome: form.outcome.trim(),
                startDate: form.startDate,
                endDate: form.endDate,
                description: form.description.trim(),
                updatedAt: now,
              }
            : exp
        ),
      }));
    } else {
      const newExperience: Experience = {
        id: generateId(),
        type: form.type,
        title,
        role: form.role.trim(),
        skills: form.skills.trim(),
        outcome: form.outcome.trim(),
        startDate: form.startDate,
        endDate: form.endDate,
        description: form.description.trim(),
        createdAt: now,
        updatedAt: now,
      };
      setState((prev) => ({ ...prev, experiences: [newExperience, ...prev.experiences] }));
    }

    resetForm();
  };

  const handleEdit = (exp: Experience) => {
    setEditingId(exp.id);
    setForm({
      type: exp.type,
      title: exp.title,
      role: exp.role,
      skills: exp.skills,
      outcome: exp.outcome ?? '',
      startDate: exp.startDate,
      endDate: exp.endDate,
      description: exp.description,
    });
    setError(null);
    setStructureError(null);
    setStructureNotice(null);
  };

  const handleDelete = (id: string) => {
    setState((prev) => ({ ...prev, experiences: prev.experiences.filter((exp) => exp.id !== id) }));
    setConfirmDeleteId(null);
    if (editingId === id) resetForm();
  };

  if (!hydrated) {
    return <p style={{ color: 'var(--muted)', fontSize: 14 }}>불러오는 중...</p>;
  }

  return (
    <>
      <PageHeader title="경험 등록·수정·삭제" description="동아리·프로젝트·공모전·아르바이트·인턴 경험을 자유롭게 기록하세요." />

      <section className="setup-card">
        <div className="form-grid">
          <label>
            <span>활동 유형</span>
            <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as ExperienceType }))}>
              {EXPERIENCE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>활동명 *</span>
            <input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="예: 캠퍼스 중고거래 플랫폼 개발"
            />
          </label>

          <label>
            <span>역할</span>
            <input
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
              placeholder="예: 백엔드 개발 (3인 협업)"
            />
          </label>

          <label>
            <span>사용 기술 <small>쉼표로 구분</small></span>
            <input
              value={form.skills}
              onChange={(e) => setForm((f) => ({ ...f, skills: e.target.value }))}
              placeholder="예: Java, Spring Boot, MySQL"
            />
          </label>

          <label>
            <span>성과</span>
            <input
              value={form.outcome}
              onChange={(e) => setForm((f) => ({ ...f, outcome: e.target.value }))}
              placeholder="예: 실사용자 420명 확보"
            />
          </label>

          <label>
            <span>시작 시점 *</span>
            <input type="month" value={form.startDate} onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))} />
          </label>

          <label>
            <span>종료 시점 <small>진행 중이면 비워두기</small></span>
            <input type="month" value={form.endDate} onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))} />
          </label>

          <label className="wide">
            <span>경험 설명 <small>역할·성과를 구체적으로 적어주세요</small></span>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="예: REST API 설계 및 DB 모델링을 맡았고, 실사용자 420명을 확보했습니다."
            />
          </label>
        </div>

        <div className="drawer-guide" style={{ margin: '0 0 18px' }}>
          <Icon name="info" size={18} />
          <p>
            <b>AI로 구조화하기</b>를 누르면 설명에 적힌 내용만 근거로 활동유형·역할·기술·성과를 채워줍니다 (실시간 AI 호출).
            채워진 내용은 확인 후 수정할 수 있습니다.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <Button variant="secondary" onClick={handleStructureWithAi} disabled={isStructuring} icon={isStructuring ? 'refresh' : 'link'}>
            {isStructuring ? 'AI가 분석 중...' : 'AI로 구조화하기'}
          </Button>
        </div>

        {structureError && (
          <p style={{ color: '#9f3a38', fontSize: 12, fontWeight: 600, marginTop: 6 }}>
            {structureError} 위 버튼을 다시 눌러 재시도할 수 있습니다.
          </p>
        )}
        {structureNotice && !structureError && (
          <p style={{ color: 'var(--teal)', fontSize: 12, fontWeight: 600, marginTop: 6 }}>{structureNotice}</p>
        )}

        {error && <p style={{ color: '#9f3a38', fontSize: 12, fontWeight: 600, marginTop: 10 }}>{error}</p>}

        <div style={{ marginTop: 18, display: 'flex', gap: 10 }}>
          <Button onClick={handleSubmit} icon={editingId ? 'check' : 'plus'}>
            {editingId ? '수정 완료' : '경험 추가'}
          </Button>
          {editingId && (
            <Button variant="secondary" onClick={resetForm} icon="x">
              취소
            </Button>
          )}
        </div>
      </section>

      <section className="setup-card">
        <div className="setup-head">
          <span>목록</span>
          <div>
            <h2>등록된 경험 ({state.experiences.length})</h2>
          </div>
        </div>

        {state.experiences.length === 0 ? (
          <div className="empty-row" style={{ marginTop: 18 }}>
            <div>
              <b>아직 등록된 경험이 없어요</b>
              <p>위 양식으로 첫 경험을 추가해보세요.</p>
            </div>
          </div>
        ) : (
          <div className="list-rows" style={{ marginTop: 18 }}>
            {state.experiences.map((exp) => (
              <div className="list-row" key={exp.id}>
                <div className="list-row-head">
                  <b>
                    <Tag tone="indigo">{exp.type}</Tag> {exp.title}
                  </b>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button onClick={() => handleEdit(exp)} aria-label="수정" style={{ border: 0, background: 'none', color: 'var(--muted)', display: 'flex', padding: 6 }}>
                      <Icon name="edit" size={16} />
                    </button>
                    <button onClick={() => setConfirmDeleteId(exp.id)} aria-label="삭제" style={{ border: 0, background: 'none', color: 'var(--muted)', display: 'flex', padding: 6 }}>
                      <Icon name="trash" size={16} />
                    </button>
                  </div>
                </div>
                <small style={{ display: 'block', marginTop: 4 }}>
                  {exp.startDate || '미확인'} ~ {exp.endDate || '진행 중'}
                  {exp.role && <> · {exp.role}</>}
                </small>
                {exp.skills && (
                  <div className="summary-labels" style={{ marginTop: 8 }}>
                    {exp.skills.split(',').map((s) => s.trim()).filter(Boolean).map((s, i) => (
                      <Tag key={i}>{s}</Tag>
                    ))}
                  </div>
                )}
                {exp.outcome && (
                  <p style={{ color: 'var(--teal)', fontWeight: 600, marginTop: 8 }}>성과: {exp.outcome}</p>
                )}
                {exp.description && <p>{exp.description}</p>}

                {confirmDeleteId === exp.id && (
                  <div style={{ marginTop: 10, background: '#fff0ef', border: '1px solid #f3d3d1', borderRadius: 10, padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#9f3a38', fontSize: 12 }}>이 경험을 삭제하시겠습니까?</span>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <button onClick={() => handleDelete(exp.id)} style={{ border: 0, background: 'none', color: '#9f3a38', fontWeight: 700, fontSize: 12 }}>삭제</button>
                      <button onClick={() => setConfirmDeleteId(null)} style={{ border: 0, background: 'none', color: 'var(--muted)', fontWeight: 700, fontSize: 12 }}>취소</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
