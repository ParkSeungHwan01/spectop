import type { SpectopUserAnalysisRecord, GapResultItem } from './types';
import { DOMAINS, type CompanyBaseline, type DomainKey } from './companies';

const CS_COURSE_KEYWORDS = ['자료구조', '운영체제', '네트워크', '데이터베이스', '알고리즘', '컴퓨터구조'];

function monthsBetween(start: string, end?: string): number {
  if (!start) return 0;
  const [sy, sm] = start.split('-').map(Number);
  const [ey, em] = (end || start).split('-').map(Number);
  if (!sy || !sm || !ey || !em) return 0;
  return Math.max((ey - sy) * 12 + (em - sm) + 1, 0);
}

export function careerMonths(record: SpectopUserAnalysisRecord): number {
  return record.careers.reduce((sum, c) => sum + monthsBetween(c.start_date, c.end_date), 0);
}

function userStatus(record: SpectopUserAnalysisRecord, baseline: CompanyBaseline, key: DomainKey): string {
  switch (key) {
    case 'project_depth':
      return `${record.projects.length}개 프로젝트 수행`;
    case 'career_density': {
      const months = careerMonths(record);
      return months > 0 ? `실무 경험 ${months}개월` : '실무 경험 없음';
    }
    case 'tech_stack': {
      const owned = record.skill_tags.map((s) => s.toLowerCase());
      const matched = baseline.required_skills.filter((s) =>
        owned.some((o) => o.includes(s.toLowerCase().split('/')[0]))
      ).length;
      return `필수 기술 ${matched}/${baseline.required_skills.length}개 보유`;
    }
    case 'cs_knowledge': {
      const count = record.course_history.filter((c) =>
        CS_COURSE_KEYWORDS.some((k) => c.course_name.includes(k))
      ).length;
      return `CS 관련 과목 ${count}개 이수`;
    }
    case 'collaboration':
      return `동아리 ${record.clubs.length}개 · 대외활동 ${record.external_activities.length}개`;
  }
}

function statusOf(gap: number): GapResultItem['status'] {
  if (gap >= -5) return '충분';
  if (gap >= -25) return '보완';
  return '부족';
}

function describe(baseline: CompanyBaseline, label: string, gap: number, target: number): string {
  const diff = Math.abs(gap);
  if (gap >= -5) return `${baseline.company} 비교 기준(${target}점)에 도달해 강점으로 유지할 수 있어요.`;
  if (gap >= -25) return `${baseline.company} 비교 기준(${target}점)까지 ${diff}점이 남아 ${label} 보완이 필요해요.`;
  return `${baseline.company} 비교 기준(${target}점) 대비 ${diff}점 부족해 가장 먼저 채워야 해요.`;
}

/**
 * 선택한 기업의 비교 기준과 현재 역량 점수를 비교해 평가 영역별 결과를 만든다.
 * 격차가 큰 순(부족한 순)으로 정렬되며 priority 는 그 순서에서 파생된다.
 */
export function buildGapResults(record: SpectopUserAnalysisRecord, baseline: CompanyBaseline): GapResultItem[] {
  const rows = DOMAINS.map(({ key, label }) => {
    const user_score = record.competency_scores[key];
    const target_score = baseline.targets[key];
    const gap = user_score - target_score;
    return {
      domain: label,
      user_status: userStatus(record, baseline, key),
      target_standard: baseline.standards[key],
      status: statusOf(gap),
      user_score,
      target_score,
      gap,
      priority: '',
      description: describe(baseline, label, gap, target_score),
    };
  });

  rows.sort((a, b) => a.gap - b.gap);
  return rows.map((row, index) => ({ ...row, priority: `${index + 1}순위` }));
}

/** 선택한 기업 목록을 기준으로 레코드의 분석 결과 컬럼을 동기화한다. */
export function syncAnalysis(record: SpectopUserAnalysisRecord): SpectopUserAnalysisRecord {
  const primary = record.company_demo_profiles[0];
  return {
    ...record,
    target_company: primary ? primary.company : '',
    target_job: primary ? primary.job : '',
    gap_results: primary ? buildGapResults(record, primary) : [],
  };
}
