// =========================================================================
// TYPES: spectop_user_analysis 테이블 정의서 기반 TypeScript 인터페이스
// =========================================================================

import { COMPANY_CATALOG, type CompanyBaseline } from './companies';

export interface LanguageTest {
  test_name: string;
  score: number | string;
  acquired_date: string; // YYYY-MM
}

export interface Certificate {
  name: string;
  issuer?: string;
  acquired_date: string; // YYYY-MM
}

export interface AwardItem {
  name: string;
  competition_name?: string;
  competition_scale?: string; // 교내, 지역, 전국, 국제
  award_date: string; // YYYY-MM
}

export interface ClubItem {
  name: string;
  role?: string;
  description?: string;
  start_date: string; // YYYY-MM
  end_date?: string; // YYYY-MM
}

export interface ExternalActivityItem {
  name: string;
  organization?: string;
  role?: string;
  description?: string;
  start_date: string; // YYYY-MM
  end_date?: string; // YYYY-MM
}

export interface CourseHistoryItem {
  course_name: string;
  year: number;
  semester: string;
  grade?: string;
}

export interface ProjectItem {
  name: string;
  role?: string;
  description?: string;
  skills: string[];
  outcome?: string;
  start_date: string; // YYYY-MM
  end_date?: string; // YYYY-MM
}

export interface CareerItem {
  organization: string;
  career_type: string; // intern, contract, regular
  job?: string;
  role?: string;
  description?: string;
  skills: string[];
  outcome?: string;
  start_date: string; // YYYY-MM
  end_date?: string; // YYYY-MM
}

export interface GapResultItem {
  domain: string;
  user_status: string;
  target_standard: string;
  status: '부족' | '보완' | '충분';
  user_score: number;
  target_score: number;
  gap: number;
  priority: string;
  description: string;
}

export interface RecommendationItem {
  id: string;
  title: string;
  category: string;
  /** 어떤 평가 영역(gap_results.domain)을 보완하는 활동인지 */
  target_gap: string;
  reason: string;
  added_to_roadmap: boolean;
}

export interface RoadmapItem {
  id: string;
  month: string;
  title: string;
  category: string;
  description: string;
  is_completed: boolean;
  order: number;
}

// Full 30 Columns Database Row Record Definition
export interface SpectopUserAnalysisRecord {
  // 1 ~ 5
  user_id: string;
  major: string;
  school_year: string;
  grade: number | null;
  grade_scale: number | null;

  // 6 ~ 14 JSONB Collections
  language_tests: LanguageTest[];
  certificates: Certificate[];
  awards: AwardItem[];
  clubs: ClubItem[];
  external_activities: ExternalActivityItem[];
  course_history: CourseHistoryItem[];
  projects: ProjectItem[];
  careers: CareerItem[];
  experiences: any[];

  // 15 ~ 17 Career Targets
  target_company: string;
  target_job: string;
  career_goal_date: string; // YYYY-MM-DD

  // 18 ~ 19 Tags
  skill_tags: string[];
  experience_tags: string[];

  // 20 ~ 21 Comparison Profiles
  virtual_candidate_profiles: any[];
  /** 사용자가 선택한 관심 기업들의 가상 비교 기준 (첫 번째 항목이 기본 비교 대상) */
  company_demo_profiles: CompanyBaseline[];

  // 22 ~ 26 AI Analysis & Outputs
  competency_scores: {
    project_depth: number;
    career_density: number;
    tech_stack: number;
    cs_knowledge: number;
    collaboration: number;
    overall_fit: number;
  };
  competency_levels: Record<string, { level: '부족' | '보완' | '충분'; reason: string }>;
  gap_results: GapResultItem[];
  recommendations: RecommendationItem[];
  roadmap: RoadmapItem[];

  // 27 ~ 30 Version & Timestamps
  analysis_version: number;
  analysis_date: string | null;
  created_at: string;
  updated_at: string;
}

// INITIAL DEMO DATA (김스펙 - spectop_user_analysis 레코드)
export const INITIAL_SPECTOP_RECORD: SpectopUserAnalysisRecord = {
  user_id: 'usr_2025_kimspec',
  major: '컴퓨터공학',
  school_year: '3학년 (재학)',
  grade: 3.82,
  grade_scale: 4.5,

  language_tests: [
    { test_name: 'TOEIC', score: 850, acquired_date: '2024-05' },
    { test_name: 'OPIC', score: 'IM2', acquired_date: '2024-08' }
  ],
  certificates: [
    { name: '정보처리기사 (필기)', issuer: '한국산업인력공단', acquired_date: '2024-09' }
  ],
  awards: [
    { name: '교내 SW 해커톤 우수상', competition_name: '2024 소프트웨어 융합 해커톤', competition_scale: '교내', award_date: '2024-05' }
  ],
  clubs: [
    {
      name: '멋쟁이사자처럼 백엔드 파트',
      role: '백엔드 스터디 리드',
      description: '웹 프레임워크 기초 및 RESTful API 서버 구축 세미나 8회 주최, 동아리 내 협업 프로젝트 진행',
      start_date: '2024-03',
      end_date: '2024-12'
    }
  ],
  external_activities: [
    {
      name: '전국 대학생 IT 연합 세미나',
      organization: '대학생 IT 개발자 연합',
      role: '세션 발표자',
      description: '대규모 세션에서 Spring Boot 기초 구조 발표 및 네트워킹',
      start_date: '2024-07',
      end_date: '2024-08'
    }
  ],
  course_history: [
    { course_name: '자료구조', year: 2023, semester: '1학기', grade: 'A+' },
    { course_name: '운영체제', year: 2023, semester: '2학기', grade: 'A0' },
    { course_name: '데이터베이스', year: 2024, semester: '1학기', grade: 'A+' },
    { course_name: '컴퓨터네트워크', year: 2024, semester: '2학기', grade: 'A-' }
  ],
  projects: [
    {
      name: '캠퍼스 중고거래 & 룸메이트 매칭 플랫폼',
      role: '백엔드 엔지니어 (3인 협업)',
      description: '대학 웹메일 인증 기반 중고거래 및 룸메이트 성향 매칭 서비스의 백엔드 API 설계 및 DB 모델링',
      skills: ['Java', 'Spring Boot', 'MySQL', 'JPA', 'JWT', 'AWS EC2'],
      outcome: '교내 실사용자 420명 확보, API 응답속도 평균 180ms 달성',
      start_date: '2024-07',
      end_date: '2024-09'
    },
    {
      name: '실시간 학식 혼잡도 예측 및 대기열 분산 알림',
      role: '서버 개발 팀장 (4인 협업)',
      description: '실시간 학생 식당 혼잡도 예측 및 슬랙/카카오 웹훅 알림 서비스 48시간 해커톤 개발',
      skills: ['Python', 'FastAPI', 'PostgreSQL', 'Docker'],
      outcome: '해커톤 18개 참가팀 중 2위 (우수상 수상)',
      start_date: '2024-05',
      end_date: '2024-05'
    }
  ],
  careers: [
    {
      organization: 'ABC 테크 (스타트업 현장실습)',
      career_type: '단기 현장실습',
      job: 'Backend Intern',
      role: '백엔드 API 단위 테스트 및 유지보수',
      description: '사내 서비스 REST API 버그 픽스 및 JUnit5 단위 테스트 커버리지 확장 참여',
      skills: ['Java', 'Spring Boot', 'JUnit5', 'Git'],
      outcome: '테스트 커버리지 15% 향상 기여 (1개월 체험)',
      start_date: '2024-01',
      end_date: '2024-02'
    }
  ],
  experiences: [
    { name: '학과 멘토링 튜터', description: '1학년 C언어 기초 프로그래밍 튜터링 진행 (2024-1학기)' }
  ],

  target_company: '',
  target_job: '',
  career_goal_date: '2025-06-30',

  skill_tags: ['Java', 'Spring Boot', 'MySQL', 'JPA', 'Python', 'FastAPI', 'Docker', 'Git'],
  experience_tags: ['협업 리더십', 'API 설계', '데이터베이스 튜닝', '해커톤 수상'],

  virtual_candidate_profiles: [
    { profile_id: 'CAND_01', school: '상위권 공대', gpa: 3.85, projects: 4, intern_months: 6, tech: ['Spring', 'Redis', 'Kafka', 'Docker'], status: '최종 합격' },
    { profile_id: 'CAND_02', school: '지방 거점 국립대', gpa: 3.72, projects: 5, intern_months: 4, tech: ['Spring Boot', 'MySQL', 'AWS', 'JPA'], status: '최종 합격' }
  ],

  company_demo_profiles: [],

  competency_scores: {
    project_depth: 88,
    career_density: 32,
    tech_stack: 68,
    cs_knowledge: 54,
    collaboration: 89,
    overall_fit: 76.5
  },

  competency_levels: {
    project_depth: { level: '충분', reason: '실제 배포 및 사용자 트래픽을 처리한 팀 프로젝트 수행' },
    career_density: { level: '부족', reason: '합격자 평균(4.5개월) 대비 정규 채용연계형 인턴 실무 경력 부족(현장실습 1개월 수준)' },
    tech_stack: { level: '보완', reason: 'Spring CRUD 외에 분산 캐시(Redis), 메시지 큐(Kafka) 아키텍처 경험 필요' },
    cs_knowledge: { level: '부족', reason: '학부 과목은 이수했으나 코딩테스트 및 시스템 디자인 심화 질문 대비 부족' },
    collaboration: { level: '충분', reason: '동아리 리드 및 2회 이상의 다인 협업 팀장 경력 보유' }
  },

  gap_results: [],

  // 평가 영역(gap_results.domain)별 추천 활동 — 영역마다 3개
  recommendations: [
    {
      id: 'REC-PD-01',
      title: '실사용자가 쓰는 서비스로 배포하고 운영해보기',
      category: '프로젝트 심화',
      target_gap: '프로젝트 경험량 & 깊이',
      reason: '배포와 운영까지 경험한 프로젝트는 기능 구현만 한 프로젝트와 다르게 평가됩니다.',
      added_to_roadmap: false
    },
    {
      id: 'REC-PD-02',
      title: '기존 프로젝트에 부하 테스트와 병목 개선 과정 추가하기',
      category: '프로젝트 심화',
      target_gap: '프로젝트 경험량 & 깊이',
      reason: '같은 프로젝트라도 성능 개선 근거가 있으면 기술적 깊이를 설명할 수 있습니다.',
      added_to_roadmap: false
    },
    {
      id: 'REC-PD-03',
      title: '문제 정의부터 결과 측정까지 담은 프로젝트 회고 정리',
      category: '포트폴리오',
      target_gap: '프로젝트 경험량 & 깊이',
      reason: '수행 과정과 선택의 이유가 드러나야 프로젝트의 기여도를 확인할 수 있습니다.',
      added_to_roadmap: false
    },
    {
      id: 'REC-CD-01',
      title: 'IT 기업 동계 채용연계형 인턴십 지원',
      category: '인턴십/실무',
      target_gap: '인턴 & 실무 근무 경험',
      reason: '비교 기준과 가장 차이가 큰 실무 경험 공백을 직접적으로 채울 수 있습니다.',
      added_to_roadmap: true
    },
    {
      id: 'REC-CD-02',
      title: '4개월 이상 장기 현장실습 참여',
      category: '인턴십/실무',
      target_gap: '인턴 & 실무 근무 경험',
      reason: '단기 체험보다 서비스 운영 주기를 경험할 수 있는 기간이 필요합니다.',
      added_to_roadmap: false
    },
    {
      id: 'REC-CD-03',
      title: '오픈소스 기여로 실무 협업 흐름 경험하기',
      category: '실무 경험',
      target_gap: '인턴 & 실무 근무 경험',
      reason: '인턴 기회를 기다리는 동안 이슈 분석과 코드 리뷰 과정을 경험할 수 있습니다.',
      added_to_roadmap: false
    },
    {
      id: 'REC-TS-01',
      title: '분산 캐시(Redis) & 비동기 큐(Kafka) 적용 프로젝트',
      category: '프로젝트 심화',
      target_gap: '백엔드 기술 스택 심도',
      reason: '단순 CRUD를 넘어 동시성 제어와 캐시 전략을 다뤄본 근거를 만들 수 있습니다.',
      added_to_roadmap: true
    },
    {
      id: 'REC-TS-02',
      title: 'Docker · CI/CD 파이프라인 직접 구성해 배포 자동화하기',
      category: '인프라',
      target_gap: '백엔드 기술 스택 심도',
      reason: '배포 파이프라인 구성 경험은 비교 기준의 필수 기술에 자주 포함됩니다.',
      added_to_roadmap: false
    },
    {
      id: 'REC-TS-03',
      title: '목표 기업 필수 기술 중 미보유 기술로 미니 프로젝트 만들기',
      category: '기술 학습',
      target_gap: '백엔드 기술 스택 심도',
      reason: '비교 기준에서 확인되지 않은 기술을 짧은 프로젝트로 채울 수 있습니다.',
      added_to_roadmap: false
    },
    {
      id: 'REC-CS-01',
      title: '코딩테스트 집중 학습 & 시스템 디자인 스터디',
      category: 'CS 스터디',
      target_gap: 'CS 기본기 & 코딩테스트',
      reason: '서류 이후 바로 마주치는 코딩테스트와 기술 면접 단계를 대비할 수 있습니다.',
      added_to_roadmap: false
    },
    {
      id: 'REC-CS-02',
      title: '운영체제 · 네트워크 · DB 핵심 개념 정리 노트 만들기',
      category: 'CS 스터디',
      target_gap: 'CS 기본기 & 코딩테스트',
      reason: '수강한 과목의 내용을 면접에서 설명할 수 있는 형태로 다시 정리합니다.',
      added_to_roadmap: false
    },
    {
      id: 'REC-CS-03',
      title: '모의 기술 면접으로 CS 질의응답 연습하기',
      category: '면접 대비',
      target_gap: 'CS 기본기 & 코딩테스트',
      reason: '아는 내용을 말로 설명하는 연습은 별도로 준비해야 하는 영역입니다.',
      added_to_roadmap: false
    },
    {
      id: 'REC-CO-01',
      title: '다직군 협업 프로젝트에서 역할과 의사결정 기록 남기기',
      category: '협업',
      target_gap: '협업 & 팀워크 리더십',
      reason: '협업 경험은 본인이 맡은 역할과 결정 근거가 남아야 확인할 수 있습니다.',
      added_to_roadmap: false
    },
    {
      id: 'REC-CO-02',
      title: '코드 리뷰를 진행하는 팀 스터디 참여',
      category: '협업',
      target_gap: '협업 & 팀워크 리더십',
      reason: '코드 리뷰 경험은 여러 비교 기준에서 반복적으로 요구되는 항목입니다.',
      added_to_roadmap: false
    },
    {
      id: 'REC-CO-03',
      title: 'Git 브랜치 전략을 정하고 팀 규칙으로 운영해보기',
      category: '협업',
      target_gap: '협업 & 팀워크 리더십',
      reason: '브랜치 전략과 컨벤션을 합의해 본 경험은 실무 협업 준비도를 보여줍니다.',
      added_to_roadmap: false
    }
  ],

  roadmap: [
    {
      id: 'RD-01',
      month: '10월',
      title: 'CS 기본기 & 코딩테스트 집중 학습',
      category: 'CS 스터디',
      description: 'OS(프로세스/스레드, 가상메모리), 네트워크(TCP/UDP, HTTP3), DB 인덱스 정리 및 1일 2문제 풀이',
      is_completed: true,
      order: 1
    },
    {
      id: 'RD-02',
      month: '11월',
      title: '분산 아키텍처 백엔드 프로젝트 고도화',
      category: '프로젝트',
      description: '기존 프로젝트에 Redis 캐시 계층 도입 및 JMeter 부하 테스트(TPS 1500) 병목 지점 튜닝',
      is_completed: true,
      order: 2
    },
    {
      id: 'RD-03',
      month: '12월',
      title: '기술 블로그 & 노션 포트폴리오 구조화',
      category: '포트폴리오',
      description: 'AI 스펙탑 구조화 템플릿에 따라 STAR 기법(Situation, Task, Action, Result)으로 트러블슈팅 문서화',
      is_completed: false,
      order: 3
    },
    {
      id: 'RD-04',
      month: '1~2월',
      title: '네이버/카카오 채용연계형 동계 인턴 지원',
      category: '실무 지원',
      description: '인턴 실무 공백을 극복하기 위한 서류 접수 및 과제 전형/라이브 코딩테스트 응시',
      is_completed: false,
      order: 4
    },
    {
      id: 'RD-05',
      month: '3월',
      title: '모의 기술 면접 & 시스템 디자인 집중 훈련',
      category: '면접 대비',
      description: '대규모 분산 시스템 아키텍처 질문(URL 단축기, 피드 시스템) 설계 및 라이브 질의응답 연습',
      is_completed: false,
      order: 5
    },
    {
      id: 'RD-06',
      month: '상반기',
      title: '목표 기업 신입 공채 최종 지원',
      category: '공채 지원',
      description: '최종 합격자 포트폴리오 기준에 도달한 직무 적합도 88점 이상 상태에서 자신감 있게 최종 지원',
      is_completed: false,
      order: 6
    }
  ],

  analysis_version: 1,
  analysis_date: null,
  created_at: new Date().toISOString().replace('T', ' ').slice(0, 19),
  updated_at: new Date().toISOString().replace('T', ' ').slice(0, 19)
};

export { COMPANY_CATALOG };
export type { CompanyBaseline };
