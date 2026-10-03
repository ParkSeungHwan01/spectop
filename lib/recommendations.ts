import { CompetencyDomainId } from './types';
import { DomainGapResult } from './scoring';

// FR-07 보완 활동 추천. 실제 모집 정보가 아니라 "활동 유형 예시"로만 제시한다.

export interface RecommendationItem {
  domain: CompetencyDomainId;
  domainLabel: string;
  activityExamples: string[];
  reason: string;
}

const ACTIVITY_EXAMPLES: Record<CompetencyDomainId, string[]> = {
  cs_problem_solving: ['코딩테스트 알고리즘 문제풀이 스터디', 'CS 기본기(운영체제·네트워크·DB) 스터디'],
  tech_stack: ['관련 기술 스택 심화 토이 프로젝트', '신규 기술 학습 후 미니 프로젝트 적용'],
  project_experience: ['팀 프로젝트 또는 사이드 프로젝트 기획·배포', '공모전 참가'],
  collaboration: ['동아리·해커톤 팀 프로젝트 참여', '코드 리뷰·협업 프로세스 경험 쌓기'],
  practical_experience: ['인턴십 또는 현장실습 지원', '단기 실무 프로젝트 참여'],
};

export function buildRecommendations(
  gapResults: DomainGapResult[],
  domainLabels: Record<CompetencyDomainId, string>
): RecommendationItem[] {
  const needsWork = gapResults.filter((r) => r.level === '보완 필요' || r.level === '미확인');

  const sorted = [...needsWork].sort((a, b) => {
    const score = (r: DomainGapResult) => (r.userScore === null ? 1000 : (r.gap ?? 0));
    return score(b) - score(a);
  });

  return sorted.map((r) => {
    const domainLabel = domainLabels[r.domain];
    const reason =
      r.userScore === null
        ? `${domainLabel} 관련 경험이 아직 확인되지 않았습니다. ${r.missedCriteria.join(', ')}를 채울 수 있는 활동부터 시작해보세요.`
        : `${domainLabel}이 가상 기준보다 ${r.gap ?? 0}점 낮습니다. ${r.missedCriteria.join(', ')}를 보완하면 점수가 올라갑니다.`;

    return {
      domain: r.domain,
      domainLabel,
      activityExamples: ACTIVITY_EXAMPLES[r.domain],
      reason,
    };
  });
}
