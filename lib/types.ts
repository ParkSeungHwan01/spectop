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
