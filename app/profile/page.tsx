'use client';

import { useEffect, useState } from 'react';
import { useSpecTopState } from '@/lib/storage';
import { SCHOOL_YEAR_OPTIONS } from '@/lib/types';
import { Icon, Button, PageHeader } from '@/components/ui';

export default function ProfilePage() {
  const { state, setState, hydrated } = useSpecTopState();

  const [major, setMajor] = useState('');
  const [schoolYear, setSchoolYear] = useState('');
  const [gradeInput, setGradeInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    if (!hydrated) return;
    setMajor(state.profile.major);
    setSchoolYear(state.profile.schoolYear);
    setGradeInput(state.profile.grade === null ? '' : String(state.profile.grade));
  }, [hydrated]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = () => {
    setError(null);

    const trimmedMajor = major.trim();
    if (!trimmedMajor) {
      setError('전공을 입력해주세요.');
      return;
    }
    if (!schoolYear) {
      setError('학년·상태를 선택해주세요.');
      return;
    }

    let grade: number | null = null;
    if (gradeInput.trim() !== '') {
      const parsed = Number(gradeInput);
      if (Number.isNaN(parsed) || parsed < 0 || parsed > 4.5) {
        setError('학점은 0~4.5 사이의 숫자로 입력해주세요.');
        return;
      }
      grade = parsed;
    }

    setState((prev) => ({
      ...prev,
      profile: { major: trimmedMajor, schoolYear, grade },
    }));
    setSavedAt(Date.now());
  };

  if (!hydrated) {
    return <p style={{ color: 'var(--muted)', fontSize: 14 }}>불러오는 중...</p>;
  }

  return (
    <>
      <PageHeader title="커리어 프로필" description="전공·학년·학점(선택)을 입력하면 브라우저에 저장됩니다." />

      <section className="setup-card">
        <div className="form-grid">
          <label>
            <span>전공 *</span>
            <input value={major} onChange={(e) => setMajor(e.target.value)} placeholder="예: 컴퓨터공학과" />
          </label>

          <label>
            <span>학년·상태 *</span>
            <select value={schoolYear} onChange={(e) => setSchoolYear(e.target.value)}>
              <option value="">선택해주세요</option>
              {SCHOOL_YEAR_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </label>

          <label className="wide">
            <span>학점 <small>4.5 만점 기준, 선택 입력</small></span>
            <input
              inputMode="decimal"
              value={gradeInput}
              onChange={(e) => setGradeInput(e.target.value)}
              placeholder="예: 3.8 (입력하지 않으면 미확인으로 처리)"
            />
          </label>
        </div>

        {error && (
          <p style={{ color: '#9f3a38', fontSize: 12, fontWeight: 600, marginTop: 4 }}>{error}</p>
        )}

        <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 12 }}>
          <Button onClick={handleSave} icon="check">
            저장하기
          </Button>
          {savedAt && (
            <span style={{ color: 'var(--teal)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Icon name="check" size={14} />
              저장되었습니다. 새로고침해도 값이 유지됩니다.
            </span>
          )}
        </div>
      </section>

      {(state.profile.major || state.profile.schoolYear) && (
        <section className="setup-card">
          <div className="setup-head" style={{ border: 0, paddingBottom: 0 }}>
            <span>저장됨</span>
            <div>
              <h2>현재 저장된 프로필</h2>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 14, fontSize: 13 }}>
            <div>전공: <b>{state.profile.major || '미확인'}</b></div>
            <div>학년·상태: <b>{state.profile.schoolYear || '미확인'}</b></div>
            <div>학점: <b>{state.profile.grade === null ? '미확인' : `${state.profile.grade} / 4.5`}</b></div>
          </div>
        </section>
      )}
    </>
  );
}
