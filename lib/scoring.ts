import { CompanyProfile, CompetencyDomainId, Experience, ExperienceType } from './types';

// FR-06 숫자+단계별 GAP 분석. PRD "수치·단계 평가 규칙" 기준 규칙 기반 엔진.
// 세부기준 4개 × 25점으로 단순화(PRD [제안] 초기 단순화). 근거 경험이 전혀 없으면 null + 미확인.
// 같은 입력에는 항상 같은 결과가 나오도록 전부 결정적(deterministic) 로직으로만 계산한다.

export type CompetencyLevel = '강점' | '양호' | '보완 필요' | '미확인';

export interface DomainGapResult {
  domain: CompetencyDomainId;
  userScore: number | null;
  level: CompetencyLevel;
  targetScore: number;
  gap: number | null; // targetScore - userScore, 음수면 참고 기준보다 높음
  evidenceTitles: string[];
  metCriteria: string[];
  missedCriteria: string[];
  reason: string;
}

const RELEVANT_TYPES: Record<CompetencyDomainId, ExperienceType[]> = {
  cs_problem_solving: [],
  tech_stack: [],
  project_experience: ['프로젝트', '공모전'],
  collaboration: ['동아리'],
  practical_experience: ['인턴', '아르바이트'],
};

const DOMAIN_KEYWORDS: Record<CompetencyDomainId, string[]> = {
  cs_problem_solving: [
    '알고리즘', '코딩테스트', '백준', '자료구조', '운영체제', '네트워크', '데이터베이스',
    '시스템 설계', '설계', '트러블슈팅', '문제 해결', '최적화', '성능 개선',
  ],
  tech_stack: [], // 기술 스택은 skills 필드 존재 자체로 판단 (아래 isRelevant 특례 처리)
  project_experience: ['프로젝트', '구현', '개발', '배포', '출시'],
  collaboration: ['협업', '팀', '해커톤', '동아리', '리드', '팀장', '코드 리뷰', '커뮤니케이션', '회의', '스크럼', '애자일'],
  practical_experience: ['인턴', '실무', '근무', '현장실습'],
};

function textOf(exp: Experience): string {
  return `${exp.title} ${exp.role} ${exp.skills} ${exp.outcome} ${exp.description}`.toLowerCase();
}

function isRelevant(exp: Experience, domain: CompetencyDomainId): boolean {
  if (RELEVANT_TYPES[domain].includes(exp.type)) return true;
  if (domain === 'tech_stack' && exp.skills.trim() !== '') return true;
  const haystack = textOf(exp);
  return DOMAIN_KEYWORDS[domain].some((kw) => haystack.includes(kw.toLowerCase()));
}

const CRITERIA_LABELS = {
  skills: '사용 기술 기록',
  role: '역할 설명',
  outcome: '성과 서술',
  detail: '경험 설명의 구체성',
} as const;

function evaluateCriteria(relevantExps: Experience[]) {
  const met: string[] = [];
  const missed: string[] = [];

  const hasSkills = relevantExps.some((e) => e.skills.trim() !== '');
  const hasRole = relevantExps.some((e) => e.role.trim() !== '');
  const hasOutcome = relevantExps.some((e) => e.outcome.trim() !== '');
  const hasDetail = relevantExps.some((e) => e.description.trim().length >= 20);

  (hasSkills ? met : missed).push(CRITERIA_LABELS.skills);
  (hasRole ? met : missed).push(CRITERIA_LABELS.role);
  (hasOutcome ? met : missed).push(CRITERIA_LABELS.outcome);
  (hasDetail ? met : missed).push(CRITERIA_LABELS.detail);

  const score = [hasSkills, hasRole, hasOutcome, hasDetail].filter(Boolean).length * 25;
  return { score, met, missed };
}

function levelFromScore(score: number | null): CompetencyLevel {
  if (score === null) return '미확인';
  if (score >= 80) return '강점';
  if (score >= 60) return '양호';
  return '보완 필요';
}

function buildReason(domainLabel: string, evidenceTitles: string[], met: string[], missed: string[]): string {
  if (evidenceTitles.length === 0) {
    return `${domainLabel} 관련 경험이 아직 입력되지 않아 확인이 필요합니다. 관련 경험을 추가해보세요.`;
  }
  const evidence = `근거 경험: ${evidenceTitles.slice(0, 2).join(', ')}`;
  const metText = met.length > 0 ? `반영된 항목: ${met.join(', ')}` : '반영된 항목 없음';
  const missedText = missed.length > 0 ? ` 보완하면 좋은 점: ${missed.join(', ')}.` : '';
  return `${evidence} → ${metText}.${missedText}`;
}

export function computeDomainGap(
  domain: CompetencyDomainId,
  domainLabel: string,
  targetScore: number,
  experiences: Experience[]
): DomainGapResult {
  const relevantExps = experiences.filter((e) => isRelevant(e, domain));

  if (relevantExps.length === 0) {
    return {
      domain,
      userScore: null,
      level: '미확인',
      targetScore,
      gap: null,
      evidenceTitles: [],
      metCriteria: [],
      missedCriteria: Object.values(CRITERIA_LABELS),
      reason: buildReason(domainLabel, [], [], Object.values(CRITERIA_LABELS)),
    };
  }

  const { score, met, missed } = evaluateCriteria(relevantExps);
  const evidenceTitles = relevantExps.map((e) => e.title);

  return {
    domain,
    userScore: score,
    level: levelFromScore(score),
    targetScore,
    gap: targetScore - score,
    evidenceTitles,
    metCriteria: met,
    missedCriteria: missed,
    reason: buildReason(domainLabel, evidenceTitles, met, missed),
  };
}

export function computeGapResults(
  companyProfile: CompanyProfile,
  experiences: Experience[],
  domainLabels: Record<CompetencyDomainId, string>
): DomainGapResult[] {
  return companyProfile.competency_targets.map((t) =>
    computeDomainGap(t.domain, domainLabels[t.domain], t.target_score, experiences)
  );
}
