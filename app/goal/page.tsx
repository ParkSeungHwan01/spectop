'use client';

import { useEffect, useState } from 'react';
import { useSpecTopState } from '@/lib/storage';
import { TargetCompanyId } from '@/lib/types';
import { Icon, Button, PageHeader } from '@/components/ui';

const COMPANY_OPTIONS: { id: TargetCompanyId; name: string; focus: string }[] = [
  { id: 'company_a', name: '가상 기업 A', focus: 'CS·문제 해결 중점 (데모 기준)' },
  { id: 'company_b', name: '가상 기업 B', focus: '협업·서비스 구현 중점 (데모 기준)' },
];

export default function GoalPage() {
  const { state, setState, hydrated } = useSpecTopState();

  const [targetCompany, setTargetCompany] = useState<TargetCompanyId>('');
  const [careerGoalDate, setCareerGoalDate] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    if (!hydrated) return;
    setTargetCompany(state.careerGoal.targetCompany);
    setCareerGoalDate(state.careerGoal.careerGoalDate);
  }, [hydrated]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = () => {
    setError(null);

    if (!targetCompany) {
      setError('목표 기업을 선택해주세요.');
      return;
    }
    if (!careerGoalDate) {
      setError('목표 지원 시점을 선택해주세요.');
      return;
    }

    setState((prev) => ({
      ...prev,
      careerGoal: { targetCompany, targetJob: '백엔드 개발자', careerGoalDate },
    }));
    setSavedAt(Date.now());
  };

  if (!hydrated) {
    return <p style={{ color: 'var(--muted)', fontSize: 14 }}>불러오는 중...</p>;
  }

  const savedCompany = COMPANY_OPTIONS.find((c) => c.id === state.careerGoal.targetCompany);

  return (
    <>
      <PageHeader
        title="목표 기업·직무·지원 시점"
        description="가상 기업 기준입니다. 실제 기업의 공식 채용 기준이 아니라 데모용 시연 기준입니다."
      />

      <section className="setup-card">
        <div className="setup-head">
          <span>01</span>
          <div>
            <h2>목표 기업 선택 *</h2>
            <p>시연용 가상 기업 중 하나를 선택해주세요.</p>
          </div>
        </div>

        <div className="company-options" style={{ marginTop: 18 }}>
          {COMPANY_OPTIONS.map((opt) => (
            <label key={opt.id} className={`company-option ${targetCompany === opt.id ? 'checked' : ''}`}>
              <input
                type="radio"
                name="targetCompany"
                checked={targetCompany === opt.id}
                onChange={() => setTargetCompany(opt.id)}
              />
              <span className="company-option-main">
                <b>{opt.name}</b>
                <small>{opt.focus}</small>
              </span>
            </label>
          ))}
        </div>

        <div className="field-divider" />

        <div className="form-grid">
          <label>
            <span>목표 직무</span>
            <input value="백엔드 개발자" disabled />
          </label>
          <label>
            <span>목표 지원 시점 *</span>
            <input type="month" value={careerGoalDate} onChange={(e) => setCareerGoalDate(e.target.value)} />
          </label>
        </div>
        <p style={{ color: '#98a2b3', fontSize: 11, marginTop: -6 }}>현재 데모는 백엔드 개발 직무만 지원합니다.</p>

        {error && <p style={{ color: '#9f3a38', fontSize: 12, fontWeight: 600, marginTop: 10 }}>{error}</p>}

        <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 12 }}>
          <Button onClick={handleSave} icon="check">
            저장하기
          </Button>
          {savedAt && (
            <span style={{ color: 'var(--teal)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Icon name="check" size={14} />
              저장되었습니다.
            </span>
          )}
        </div>
      </section>

      {savedCompany && (
        <section className="setup-card">
          <div className="setup-head" style={{ border: 0, paddingBottom: 0 }}>
            <span>저장됨</span>
            <div>
              <h2>현재 저장된 목표</h2>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 14, fontSize: 13 }}>
            <div>
              목표 기업: <b>{savedCompany.name}</b> ({savedCompany.focus})
            </div>
            <div>목표 직무: <b>{state.careerGoal.targetJob}</b></div>
            <div>목표 지원 시점: <b>{state.careerGoal.careerGoalDate || '미확인'}</b></div>
          </div>
        </section>
      )}
    </>
  );
}
