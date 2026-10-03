import { CompanyProfile, CompetencyDomainId } from './types';
import { DomainGapResult } from './scoring';

// FR-08 기업별 커리어 로드맵. 기업의 가중치 x 현재 GAP이 큰 역량을 먼저 배치한다.
// 검증되지 않은 실제 채용 일정은 만들지 않고, 사용자가 입력한 목표 지원 시점만 근거로 상대적 기간을 안내한다.

const ACTIVITY_EXAMPLES: Record<CompetencyDomainId, string> = {
  cs_problem_solving: '코딩테스트·CS 기본기 스터디',
  tech_stack: '관련 기술 스택 심화 프로젝트',
  project_experience: '팀 프로젝트/공모전 참여 및 산출물 정리',
  collaboration: '협업 프로젝트 경험 및 코드 리뷰 프로세스 정리',
  practical_experience: '인턴십·현장실습 지원',
};

export interface RoadmapStep {
  phaseLabel: string;
  durationLabel: string;
  domain: CompetencyDomainId;
  domainLabel: string;
  action: string;
  reason: string;
  completionCondition: string;
}

function monthsUntil(careerGoalDate: string): number | null {
  if (!careerGoalDate) return null;
  const [y, m] = careerGoalDate.split('-').map(Number);
  if (!y || !m) return null;
  const now = new Date();
  const diff = (y - now.getFullYear()) * 12 + (m - (now.getMonth() + 1));
  return Math.max(diff, 0);
}

export function buildRoadmap(
  gapResults: DomainGapResult[],
  companyProfile: CompanyProfile,
  domainLabels: Record<CompetencyDomainId, string>,
  careerGoalDate: string
): { steps: RoadmapStep[]; monthsRemaining: number | null } {
  const weightByDomain = new Map(companyProfile.competency_targets.map((t) => [t.domain, t.weight]));

  const priority = [...gapResults].sort((a, b) => {
    const effectiveGap = (r: DomainGapResult) => (r.userScore === null ? r.targetScore : r.gap ?? 0);
    const scoreA = effectiveGap(a) * (weightByDomain.get(a.domain) ?? 0);
    const scoreB = effectiveGap(b) * (weightByDomain.get(b.domain) ?? 0);
    return scoreB - scoreA;
  });

  const monthsRemaining = monthsUntil(careerGoalDate);
  const compressed = monthsRemaining !== null && monthsRemaining <= 2;

  const phaseDefs = compressed
    ? [
        { label: '1단계: 바로 시작', duration: '지금 ~ 지원 전', slice: priority.slice(0, 3) },
        { label: '2단계: 포트폴리오·지원 준비', duration: '지원 직전', slice: priority.slice(3) },
      ]
    : [
        { label: '1단계: 기초 보완', duration: '약 1~2개월', slice: priority.slice(0, 2) },
        { label: '2단계: 역량 증빙 프로젝트/활동', duration: '약 1~2개월', slice: priority.slice(2, 4) },
        { label: '3단계: 포트폴리오·지원 준비', duration: '지원 직전', slice: priority.slice(4) },
      ];

  const steps: RoadmapStep[] = [];
  phaseDefs.forEach((phase) => {
    phase.slice.forEach((r) => {
      const weight = weightByDomain.get(r.domain) ?? 0;
      const domainLabel = domainLabels[r.domain];
      const reason =
        r.userScore === null
          ? `${companyProfile.target_company} 기준에서 가중치 ${weight}%인 영역인데, 관련 경험이 아직 확인되지 않았습니다.`
          : `${companyProfile.target_company} 기준에서 가중치 ${weight}%로 중요하고, 현재 ${r.gap ?? 0}점 차이가 있습니다.`;

      steps.push({
        phaseLabel: phase.label,
        durationLabel: phase.duration,
        domain: r.domain,
        domainLabel,
        action: ACTIVITY_EXAMPLES[r.domain],
        reason,
        completionCondition: `${domainLabel} 관련 경험을 등록하고 사용 기술·성과를 구체적으로 기록하면 완료로 간주합니다.`,
      });
    });
  });

  return { steps, monthsRemaining };
}
