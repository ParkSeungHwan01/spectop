// 스펙탑 MVP 로컬 데이터 타입. docs/table.md, PRD.md "핵심 입력 및 산출 데이터" 기준.

export type TargetCompanyId = 'company_a' | 'company_b' | '';

export interface Profile {
  major: string;
  schoolYear: string;
  grade: number | null;
}

export interface CareerGoal {
  targetCompany: TargetCompanyId;
  targetJob: string;
  careerGoalDate: string; // YYYY-MM
}

export type ExperienceType = '동아리' | '프로젝트' | '공모전' | '아르바이트' | '인턴' | '기타';

export interface Experience {
  id: string;
  type: ExperienceType;
  title: string;
  role: string;
  skills: string;
  outcome: string;
  startDate: string; // YYYY-MM
  endDate: string; // YYYY-MM, 비어 있으면 진행중
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface SpecTopState {
  profile: Profile;
  careerGoal: CareerGoal;
  experiences: Experience[];
  analysisVersion: number;
}

export const EXPERIENCE_TYPES: ExperienceType[] = ['동아리', '프로젝트', '공모전', '아르바이트', '인턴', '기타'];

export const SCHOOL_YEAR_OPTIONS = ['1학년', '2학년', '3학년', '4학년', '졸업예정', '졸업·취업준비'];

export const DEFAULT_STATE: SpecTopState = {
  profile: { major: '', schoolYear: '', grade: null },
  careerGoal: { targetCompany: '', targetJob: '백엔드 개발자', careerGoalDate: '' },
  experiences: [],
  analysisVersion: 1,
};

// FR-05 가상 합격자 비교 데이터. PRD "가상 비교 데이터 생성 및 관리" 기준.
// 실제 기업의 공식 채용 기준이 아니라 데모 시연용으로 ChatGPT가 생성한 가상 데이터다.

export type CompetencyDomainId =
  | 'cs_problem_solving'
  | 'tech_stack'
  | 'project_experience'
  | 'collaboration'
  | 'practical_experience';

export interface CompetencyDomainMeta {
  id: CompetencyDomainId;
  label: string;
}

export const COMPETENCY_DOMAINS: CompetencyDomainMeta[] = [
  { id: 'cs_problem_solving', label: 'CS·문제 해결' },
  { id: 'tech_stack', label: '기술 스택' },
  { id: 'project_experience', label: '프로젝트 경험' },
  { id: 'collaboration', label: '협업' },
  { id: 'practical_experience', label: '실무 경험' },
];

export interface CompetencyTarget {
  domain: CompetencyDomainId;
  weight: number; // 0~100, 해당 기업 가중치 (합산 100)
  target_score: number; // 0~100, 가상 참고 목표 점수
}

export interface CompanyProfile {
  id: Exclude<TargetCompanyId, ''>;
  is_synthetic: true;
  generated_with: 'ChatGPT';
  target_company: string;
  target_job: string;
  company_focus: string;
  competency_targets: CompetencyTarget[];
  example_experiences: string[];
}

export interface VirtualCandidate {
  id: string;
  is_synthetic: true;
  generated_with: 'ChatGPT';
  target_company: Exclude<TargetCompanyId, ''>;
  target_job: string;
  school: string;
  status: string;
  tech_stack: string[];
  domain_scores: Record<CompetencyDomainId, number>;
  example_experience: string;
}
