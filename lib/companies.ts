// 비교 기준 카탈로그.
// spectop_user_analysis.company_demo_profiles 에 저장되는 "가상 비교 기준"이며
// 기업의 공식 채용 기준이 아닙니다 (테이블 정의서 21번 컬럼 설명과 동일한 성격).

export const DOMAINS = [
  { key: 'project_depth', label: '프로젝트 경험량 & 깊이' },
  { key: 'career_density', label: '인턴 & 실무 근무 경험' },
  { key: 'tech_stack', label: '백엔드 기술 스택 심도' },
  { key: 'cs_knowledge', label: 'CS 기본기 & 코딩테스트' },
  { key: 'collaboration', label: '협업 & 팀워크 리더십' },
] as const;

export type DomainKey = (typeof DOMAINS)[number]['key'];

export interface CompanyBaseline {
  id: string;
  company: string;
  job: string;
  industry: string;
  avg_grade: number;
  avg_projects: number;
  avg_career_months: number;
  required_skills: string[];
  cs_standards: string;
  targets: Record<DomainKey, number>;
  standards: Record<DomainKey, string>;
}

export const COMPANY_CATALOG: CompanyBaseline[] = [
  {
    id: 'naver',
    company: '네이버 (NAVER)',
    job: '백엔드 개발자',
    industry: 'IT·플랫폼',
    avg_grade: 3.78,
    avg_projects: 4.2,
    avg_career_months: 4.5,
    required_skills: ['Java', 'Spring Boot', 'MySQL', 'Redis', 'Kafka', 'Docker/k8s'],
    cs_standards: '코딩테스트 백준 골드 이상 & 시스템 디자인 1차 면접 통과선',
    targets: { project_depth: 90, career_density: 85, tech_stack: 88, cs_knowledge: 86, collaboration: 87 },
    standards: {
      project_depth: '평균 4.2개 (실사용자 배포 필수)',
      career_density: '평균 4.5개월 (실무 서비스 운영)',
      tech_stack: 'Redis 캐싱, Kafka 비동기 큐, Docker',
      cs_knowledge: '백준 골드 이상 & 시스템 디자인 면접 통과선',
      collaboration: '코드 리뷰, Git 브랜치 전략, 애자일 스프린트',
    },
  },
  {
    id: 'kakao',
    company: '카카오',
    job: '백엔드 개발자',
    industry: 'IT·플랫폼',
    avg_grade: 3.72,
    avg_projects: 4.0,
    avg_career_months: 4.0,
    required_skills: ['Java', 'Spring Boot', 'Kotlin', 'MySQL', 'Kafka', 'Kubernetes'],
    cs_standards: '코딩테스트 2문제 이상 & 대규모 트래픽 설계 질문 대응',
    targets: { project_depth: 88, career_density: 82, tech_stack: 86, cs_knowledge: 88, collaboration: 85 },
    standards: {
      project_depth: '평균 4.0개 (서비스 운영 경험 우대)',
      career_density: '평균 4.0개월 (인턴 또는 현업 협업)',
      tech_stack: 'Kotlin/Java 기반 MSA, Kafka, Kubernetes',
      cs_knowledge: '코딩테스트 2문제 이상 & 대규모 트래픽 설계',
      collaboration: '다직군 협업과 코드 리뷰 경험',
    },
  },
  {
    id: 'line',
    company: '라인 (LINE)',
    job: '백엔드 개발자',
    industry: 'IT·플랫폼',
    avg_grade: 3.80,
    avg_projects: 4.1,
    avg_career_months: 5.0,
    required_skills: ['Java', 'Spring Boot', 'MySQL', 'Redis', 'Kafka', 'Armeria'],
    cs_standards: '알고리즘 심화 & 분산 시스템 설계 면접 통과선',
    targets: { project_depth: 89, career_density: 88, tech_stack: 90, cs_knowledge: 90, collaboration: 84 },
    standards: {
      project_depth: '평균 4.1개 (글로벌 트래픽 고려 설계)',
      career_density: '평균 5.0개월 (실무 인턴 비중 높음)',
      tech_stack: '분산 환경, 비동기 처리, 성능 튜닝',
      cs_knowledge: '알고리즘 심화 & 분산 시스템 설계',
      collaboration: '글로벌 협업과 문서화 중심 커뮤니케이션',
    },
  },
  {
    id: 'coupang',
    company: '쿠팡 (Coupang)',
    job: '백엔드 개발자',
    industry: '커머스',
    avg_grade: 3.65,
    avg_projects: 3.8,
    avg_career_months: 6.0,
    required_skills: ['Java', 'Spring Boot', 'AWS', 'MySQL', 'Kafka', 'Terraform'],
    cs_standards: '코딩테스트 & 대용량 커머스 트랜잭션 설계 질문',
    targets: { project_depth: 86, career_density: 90, tech_stack: 88, cs_knowledge: 85, collaboration: 82 },
    standards: {
      project_depth: '평균 3.8개 (대용량 처리 경험 우대)',
      career_density: '평균 6.0개월 (실무 경력 비중 가장 높음)',
      tech_stack: 'AWS 기반 인프라, Kafka, IaC',
      cs_knowledge: '코딩테스트 & 커머스 트랜잭션 설계',
      collaboration: '빠른 배포 주기에서의 협업 경험',
    },
  },
  {
    id: 'woowa',
    company: '우아한형제들 (배달의민족)',
    job: '백엔드 개발자',
    industry: '플랫폼',
    avg_grade: 3.70,
    avg_projects: 4.5,
    avg_career_months: 3.5,
    required_skills: ['Java', 'Spring Boot', 'JPA', 'MySQL', 'Redis', 'Docker'],
    cs_standards: '코딩테스트 & 객체지향 설계 역량 중심 면접',
    targets: { project_depth: 92, career_density: 78, tech_stack: 84, cs_knowledge: 82, collaboration: 88 },
    standards: {
      project_depth: '평균 4.5개 (프로젝트 깊이 비중 높음)',
      career_density: '평균 3.5개월 (인턴·현장실습)',
      tech_stack: 'JPA 활용 설계, Redis, Docker',
      cs_knowledge: '객체지향 설계와 테스트 코드 역량',
      collaboration: '팀 단위 코드 리뷰와 회고 문화',
    },
  },
  {
    id: 'toss',
    company: '토스 (비바리퍼블리카)',
    job: '백엔드 개발자',
    industry: '핀테크',
    avg_grade: 3.60,
    avg_projects: 4.3,
    avg_career_months: 7.0,
    required_skills: ['Kotlin', 'Spring Boot', 'MySQL', 'Kafka', 'Kubernetes', 'gRPC'],
    cs_standards: '실무형 과제 전형 & 금융 트랜잭션 정합성 질문',
    targets: { project_depth: 90, career_density: 92, tech_stack: 92, cs_knowledge: 88, collaboration: 86 },
    standards: {
      project_depth: '평균 4.3개 (직접 만든 제품 경험 중시)',
      career_density: '평균 7.0개월 (실무 경험 요구 수준 높음)',
      tech_stack: 'Kotlin/Spring, MSA, 이벤트 기반 아키텍처',
      cs_knowledge: '과제 전형 & 트랜잭션 정합성 설계',
      collaboration: '자율적 의사결정과 기록 중심 협업',
    },
  },
  {
    id: 'daangn',
    company: '당근',
    job: '백엔드 개발자',
    industry: '플랫폼',
    avg_grade: 3.55,
    avg_projects: 4.0,
    avg_career_months: 5.5,
    required_skills: ['Go', 'Kotlin', 'Spring Boot', 'PostgreSQL', 'Kafka', 'Kubernetes'],
    cs_standards: '실전형 코딩테스트 & 서비스 설계 토론 면접',
    targets: { project_depth: 87, career_density: 86, tech_stack: 87, cs_knowledge: 84, collaboration: 89 },
    standards: {
      project_depth: '평균 4.0개 (사용자 문제 정의 중시)',
      career_density: '평균 5.5개월 (실무 협업 경험)',
      tech_stack: 'Go/Kotlin, 이벤트 기반 설계, Kubernetes',
      cs_knowledge: '서비스 설계 토론과 실전형 코딩테스트',
      collaboration: '지역 커뮤니티 특성을 고려한 협업 설계',
    },
  },
  {
    id: 'samsung',
    company: '삼성전자',
    job: '백엔드 개발자',
    industry: '전자·제조',
    avg_grade: 3.85,
    avg_projects: 3.2,
    avg_career_months: 2.5,
    required_skills: ['Java', 'Spring', 'Oracle', 'Linux', 'C++', 'Git'],
    cs_standards: 'GSAT & 전공 심화 면접 (자료구조·운영체제·DB)',
    targets: { project_depth: 80, career_density: 70, tech_stack: 78, cs_knowledge: 90, collaboration: 80 },
    standards: {
      project_depth: '평균 3.2개 (전공 기반 프로젝트)',
      career_density: '평균 2.5개월 (학부 연구·현장실습)',
      tech_stack: 'Java/Spring, Linux, 전공 기반 기술',
      cs_knowledge: 'GSAT & 전공 심화 면접 통과선',
      collaboration: '체계적 문서화와 팀 단위 과제 수행',
    },
  },
  {
    id: 'skt',
    company: 'SK텔레콤',
    job: '백엔드 개발자',
    industry: '통신',
    avg_grade: 3.75,
    avg_projects: 3.5,
    avg_career_months: 3.0,
    required_skills: ['Java', 'Spring Boot', 'Oracle', 'Kubernetes', 'Python', 'Kafka'],
    cs_standards: '코딩테스트 & 직무 역량 기반 구조화 면접',
    targets: { project_depth: 82, career_density: 76, tech_stack: 82, cs_knowledge: 84, collaboration: 84 },
    standards: {
      project_depth: '평균 3.5개 (데이터·플랫폼 연계 경험)',
      career_density: '평균 3.0개월 (인턴 또는 산학 과제)',
      tech_stack: 'Spring Boot, Kubernetes, 데이터 파이프라인',
      cs_knowledge: '코딩테스트 & 직무 역량 구조화 면접',
      collaboration: '대규모 조직에서의 협업과 보고 체계',
    },
  },
  {
    id: 'lgcns',
    company: 'LG CNS',
    job: '백엔드 개발자',
    industry: 'SI·IT서비스',
    avg_grade: 3.68,
    avg_projects: 3.0,
    avg_career_months: 2.0,
    required_skills: ['Java', 'Spring', 'Oracle', 'JSP', 'AWS', 'Git'],
    cs_standards: '코딩테스트 & 전공 기반 기술 면접',
    targets: { project_depth: 78, career_density: 68, tech_stack: 76, cs_knowledge: 80, collaboration: 82 },
    standards: {
      project_depth: '평균 3.0개 (업무 시스템 구현 경험)',
      career_density: '평균 2.0개월 (현장실습 수준)',
      tech_stack: 'Java/Spring, RDBMS, 클라우드 전환 경험',
      cs_knowledge: '코딩테스트 & 전공 기반 기술 면접',
      collaboration: '고객사 요구사항 정리와 협업 문서화',
    },
  },
];
