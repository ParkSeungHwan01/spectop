import React, { useState } from 'react';
import {
  Sparkles,
  TrendingUp,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Database,
  BarChart3,
  RefreshCw,
  Plus,
  ChevronRight,
  User,
  Briefcase,
  Layers,
  GraduationCap,
  FileCode2,
  ExternalLink,
  Code2,
  X,
  Copy,
  Check,
  Languages,
  BadgeCheck,
  Users,
  Building2,
  Clock,
  History,
  Tag,
  SlidersHorizontal,
  Table as TableIcon
} from 'lucide-react';

// =========================================================================
// TYPES: spectop_user_analysis 테이블 정의서 기반 TypeScript 인터페이스
// =========================================================================

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
  target_gap: string;
  reason: string;
  expected_outcome: string;
  difficulty: '중급' | '고급' | '실전';
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
  company_demo_profiles: {
    company: string;
    job: string;
    avg_grade: number;
    avg_projects: number;
    avg_career_months: number;
    required_skills: string[];
    cs_standards: string;
  };

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
const INITIAL_SPECTOP_RECORD: SpectopUserAnalysisRecord = {
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

  target_company: '네이버 (NAVER)',
  target_job: '백엔드 개발자 (Backend Engineer)',
  career_goal_date: '2025-06-30',

  skill_tags: ['Java', 'Spring Boot', 'MySQL', 'JPA', 'Python', 'FastAPI', 'Docker', 'Git'],
  experience_tags: ['협업 리더십', 'API 설계', '데이터베이스 튜닝', '해커톤 수상'],

  virtual_candidate_profiles: [
    { profile_id: 'CAND_01', school: '상위권 공대', gpa: 3.85, projects: 4, intern_months: 6, tech: ['Spring', 'Redis', 'Kafka', 'Docker'], status: '최종 합격' },
    { profile_id: 'CAND_02', school: '지방 거점 국립대', gpa: 3.72, projects: 5, intern_months: 4, tech: ['Spring Boot', 'MySQL', 'AWS', 'JPA'], status: '최종 합격' }
  ],

  company_demo_profiles: {
    company: '네이버 (NAVER)',
    job: '백엔드 개발자',
    avg_grade: 3.78,
    avg_projects: 4.2,
    avg_career_months: 4.5,
    required_skills: ['Java', 'Spring Boot', 'MySQL', 'Redis', 'Kafka', 'Docker/k8s'],
    cs_standards: '코딩테스트 백준 골드 이상 & 시스템 디자인 1차 면접 통과선'
  },

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

  gap_results: [
    {
      domain: '프로젝트 경험량 & 깊이',
      user_status: '2개 팀 프로젝트 (누적 4개)',
      target_standard: '네이버 합격자 평균 4.2개 (실사용자 배포 필수)',
      status: '충분',
      user_score: 88,
      target_score: 90,
      gap: -2,
      priority: '유지 (3순위)',
      description: '기본적인 프로젝트 수량과 협업 경험은 합격자 기준에 매우 근접해 강점으로 유지됩니다.'
    },
    {
      domain: '인턴 & 실무 근무 경험',
      user_status: '1개월 단기 실습 (정규 인턴 0개월)',
      target_standard: '네이버 합격자 평균 4.5개월 (실무 서비스 운영)',
      status: '부족',
      user_score: 32,
      target_score: 85,
      gap: -53,
      priority: '최우선 보완 (1순위)',
      description: '실제 상용 트래픽 처리 및 배포 파이프라인(CI/CD) 운영 경험이 합격자 대비 가장 취약합니다.'
    },
    {
      domain: '백엔드 기술 스택 심도',
      user_status: 'Spring Boot, MySQL, JPA 기본',
      target_standard: 'Redis 캐싱, Kafka 비동기 큐, Docker',
      status: '보완',
      user_score: 68,
      target_score: 88,
      gap: -20,
      priority: '보완 권장 (2순위)',
      description: '단순 CRUD를 넘어 분산 환경, 캐시 전략, 대용량 트래픽 동시성 제어 기술 검증이 필요합니다.'
    },
    {
      domain: 'CS 기본기 & 코딩테스트',
      user_status: '학부 과목 이수 (운영체제, 자료구조)',
      target_standard: '백준 골드 이상 & 시스템 디자인 면접 통과선',
      status: '부족',
      user_score: 54,
      target_score: 86,
      gap: -32,
      priority: '최우선 보완 (1순위)',
      description: '기술 면접 및 라이브 코딩 테스트 대비 깊이 있는 CS 질문 대응 스터디가 필요합니다.'
    },
    {
      domain: '협업 & 팀워크 리더십',
      user_status: '동아리 스터디 리드, 해커톤 팀장',
      target_standard: '코드 리뷰, Git 브랜치 전략, 애자일 스프린트',
      status: '충분',
      user_score: 89,
      target_score: 87,
      gap: +2,
      priority: '충분 (4순위)',
      description: '동아리 리드 및 다수 팀 프로젝트 진행 경험으로 협업 역량은 합격자 기준을 상회합니다.'
    }
  ],

  recommendations: [
    {
      id: 'REC-01',
      title: '네이버 클라우드 / IT 빅테크 동계 채용연계형 인턴십 지원',
      category: '인턴십/실무',
      target_gap: '인턴 & 실무 근무 경험 (부족 해소)',
      reason: '합격자 평균 4.5개월 실무 경험 대비 부족한 인턴 공백을 가장 직접적으로 해소합니다.',
      expected_outcome: '직무 적합도 +9.5점 상승 예상 (76.5점 → 86.0점)',
      difficulty: '실전',
      added_to_roadmap: true
    },
    {
      id: 'REC-02',
      title: '대용량 트래픽 대비 분산 캐시(Redis) & 비동기 큐(Kafka) 서버 프로젝트',
      category: '프로젝트 심화',
      target_gap: '백엔드 기술 스택 심도 (보완 → 충분)',
      reason: 'Redis 캐시 전략 및 Kafka를 활용한 주문/결제 동시성 제어를 구현하여 기술 깊이를 증명합니다.',
      expected_outcome: '기술 심도 점수 +20점 상승, 직무 적합도 +6.2점 상승 예상',
      difficulty: '고급',
      added_to_roadmap: true
    },
    {
      id: 'REC-03',
      title: '코딩테스트 골드 달성 & CS 시스템 디자인 스터디',
      category: 'CS 스터디',
      target_gap: 'CS 기본기 & 코딩테스트 (부족 해소)',
      reason: '서류 통과 후 즉시 마주치는 코딩테스트 및 1차 기술 면접 통과율을 3배 이상 향상시킵니다.',
      expected_outcome: 'CS 시험 통과율 88% 확보, 기술 면접 대비 완료',
      difficulty: '중급',
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
      title: '목표 기업(네이버/LINE) 신입 공채 최종 지원',
      category: '공채 지원',
      description: '최종 합격자 포트폴리오 기준에 도달한 직무 적합도 88점 이상 상태에서 자신감 있게 최종 지원',
      is_completed: false,
      order: 6
    }
  ],

  analysis_version: 1,
  analysis_date: '2025-03-15 14:30:00',
  created_at: '2025-03-10 11:00:00',
  updated_at: '2025-03-15 14:30:00'
};

export default function App() {
  // Navigation Tabs: dashboard | collections | gap | recommendations | roadmap | ddl_spec | json_viewer
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'collections' | 'gap' | 'recommendations' | 'roadmap' | 'ddl_spec' | 'json_viewer'
  >('dashboard');

  // Active Sub-Tab for JSONB Collections
  const [collectionTab, setCollectionTab] = useState<
    'projects' | 'careers' | 'course_history' | 'clubs' | 'external_activities' | 'awards' | 'certificates' | 'language_tests'
  >('projects');

  // Single Source of Truth: spectop_user_analysis Record State
  const [record, setRecord] = useState<SpectopUserAnalysisRecord>(INITIAL_SPECTOP_RECORD);

  // UI States
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectItem>(record.projects[0]);

  // Modal State for Adding New Item
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProjectForm, setNewProjectForm] = useState({
    name: '',
    role: '',
    description: '',
    skills: '',
    outcome: '',
    start_date: '2025-01',
    end_date: '2025-03'
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Re-run AI Analysis Simulation (Updates spectop_user_analysis columns 22~28)
  const handleRunAiAnalysis = () => {
    setIsAnalyzing(true);
    showToast(`v${record.analysis_version} 기반 ML 추론 실행 중: 전처리 및 Feature Vector 산출...`);

    setTimeout(() => {
      const newVersion = record.analysis_version + 1;
      const now = new Date().toISOString().replace('T', ' ').slice(0, 19);

      setRecord((prev) => {
        const nextScore = Math.min(prev.competency_scores.overall_fit + 1.8, 92.5);
        return {
          ...prev,
          competency_scores: {
            ...prev.competency_scores,
            overall_fit: parseFloat(nextScore.toFixed(1)),
            career_density: prev.careers.length > 0 ? 45 : 32
          },
          analysis_version: newVersion,
          analysis_date: now,
          updated_at: now
        };
      });

      setIsAnalyzing(false);
      showToast(`분석 완료! spectop_user_analysis 레코드 v${newVersion}로 갱신되었습니다.`);
    }, 1200);
  };

  // Toggle Roadmap Checklist
  const handleToggleRoadmap = (id: string) => {
    setRecord((prev) => {
      const nextRoadmap = prev.roadmap.map((item) =>
        item.id === id ? { ...item, is_completed: !item.is_completed } : item
      );
      const target = prev.roadmap.find((r) => r.id === id);
      showToast(target?.is_completed ? `'${target.title}' 미완료로 변경` : `'${target?.title}' 완료 처리되었습니다!`);
      return {
        ...prev,
        roadmap: nextRoadmap,
        updated_at: new Date().toISOString().replace('T', ' ').slice(0, 19)
      };
    });
  };

  // Add Recommendation to Roadmap
  const handleAddRecToRoadmap = (rec: RecommendationItem) => {
    if (rec.added_to_roadmap) {
      showToast(`'${rec.title}'은(는) 이미 로드맵에 반영되어 있습니다.`);
      return;
    }

    const newRoadmapItem: RoadmapItem = {
      id: `RD-${Date.now()}`,
      month: '차기 마일스톤',
      title: rec.title,
      category: rec.category,
      description: `${rec.reason} (${rec.expected_outcome})`,
      is_completed: false,
      order: record.roadmap.length + 1
    };

    setRecord((prev) => ({
      ...prev,
      roadmap: [...prev.roadmap, newRoadmapItem],
      recommendations: prev.recommendations.map((r) =>
        r.id === rec.id ? { ...r, added_to_roadmap: true } : r
      ),
      updated_at: new Date().toISOString().replace('T', ' ').slice(0, 19)
    }));

    showToast(`'${rec.title}'이(가) spectop_user_analysis.roadmap에 추가되었습니다!`);
  };

  // Submit New Project to projects JSONB
  const handleAddProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectForm.name) {
      showToast('프로젝트명을 입력해주세요.');
      return;
    }

    const skillsArray = newProjectForm.skills
      ? newProjectForm.skills.split(',').map((s) => s.trim()).filter(Boolean)
      : ['Java', 'Spring Boot'];

    const newProj: ProjectItem = {
      name: newProjectForm.name,
      role: newProjectForm.role || '백엔드 엔지니어',
      description: newProjectForm.description || '신규 수행 프로젝트',
      skills: skillsArray,
      outcome: newProjectForm.outcome || '성공적 배포 및 테스트 진행',
      start_date: newProjectForm.start_date,
      end_date: newProjectForm.end_date
    };

    setRecord((prev) => ({
      ...prev,
      projects: [newProj, ...prev.projects],
      updated_at: new Date().toISOString().replace('T', ' ').slice(0, 19)
    }));

    setSelectedProject(newProj);
    setShowAddModal(false);
    setNewProjectForm({
      name: '',
      role: '',
      description: '',
      skills: '',
      outcome: '',
      start_date: '2025-01',
      end_date: '2025-03'
    });

    showToast('새 프로젝트가 projects JSONB 컬럼에 추가되었습니다. AI 재분석을 실행해주세요!');
  };

  // Roadmap metrics
  const completedRoadmaps = record.roadmap.filter((r) => r.is_completed).length;
  const roadmapProgress = Math.round((completedRoadmaps / record.roadmap.length) * 100);

  // Copy raw JSON or DDL
  const handleCopy = (content: string, type: string) => {
    navigator.clipboard.writeText(content);
    setCopiedText(true);
    showToast(`${type}이(가) 클립보드에 복사되었습니다.`);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-lg shadow-2xl border border-slate-700 flex items-center gap-3 text-xs sm:text-sm animate-fade-in">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1. Header (Emerald / Slate Styling with Table Schema Indicator) */}
      <header className="bg-emerald-950 text-white border-b border-emerald-900 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Logo & Service Definition */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center font-extrabold text-white text-lg shadow-inner">
                S
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold tracking-tight text-white">스펙탑 (SpecTop)</span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-900 text-emerald-300 border border-emerald-700">
                    table: spectop_user_analysis
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-700/60 text-emerald-100 font-mono">
                    v{record.analysis_version}
                  </span>
                </div>
                <p className="text-[11px] text-emerald-300/90 hidden sm:block">
                  단일 사용자 분석 레코드 기반 AI 취업 준비 & 역량 GAP 분석 엔진
                </p>
              </div>
            </div>

            {/* Profile Quick Spec & AI Run Action */}
            <div className="flex items-center gap-2">
              <div className="bg-emerald-900/80 border border-emerald-700/80 rounded-lg px-3 py-1.5 flex items-center gap-2 text-xs">
                <User className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <div className="font-semibold text-emerald-100 flex items-center gap-1.5">
                    <span>{record.user_id}</span>
                    <span className="text-emerald-400 text-[11px]">({record.major} {record.school_year})</span>
                  </div>
                  <div className="text-[10px] text-emerald-300">
                    목표: {record.target_company} · {record.target_job} (~{record.career_goal_date})
                  </div>
                </div>
              </div>

              <button
                onClick={handleRunAiAnalysis}
                disabled={isAnalyzing}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3 py-2 rounded-lg text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50 shadow-sm"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
                <span>{isAnalyzing ? '추론 중...' : 'AI 재분석'}</span>
              </button>
            </div>
          </div>

          {/* Navigation Bar (Tabs) */}
          <nav className="flex items-center gap-1 mt-3 pt-2 border-t border-emerald-900/80 overflow-x-auto text-xs font-medium">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'dashboard' ? 'bg-emerald-700 text-white font-semibold' : 'text-emerald-200/80 hover:bg-emerald-900 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>종합 대시보드</span>
            </button>

            <button
              onClick={() => setActiveTab('collections')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'collections' ? 'bg-emerald-700 text-white font-semibold' : 'text-emerald-200/80 hover:bg-emerald-900 hover:text-white'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>데이터 컬렉션 (8개 JSONB)</span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-900 text-[10px] text-emerald-200 font-mono">
                {record.projects.length + record.careers.length + record.course_history.length + record.clubs.length + record.external_activities.length + record.awards.length + record.certificates.length + record.language_tests.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('gap')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'gap' ? 'bg-emerald-700 text-white font-semibold' : 'text-emerald-200/80 hover:bg-emerald-900 hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>GAP 분석 결과 ({record.gap_results.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('recommendations')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'recommendations' ? 'bg-emerald-700 text-white font-semibold' : 'text-emerald-200/80 hover:bg-emerald-900 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>추천 활동 ({record.recommendations.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('roadmap')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'roadmap' ? 'bg-emerald-700 text-white font-semibold' : 'text-emerald-200/80 hover:bg-emerald-900 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>취업 로드맵</span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-900 text-[10px] text-emerald-200 font-mono">
                {roadmapProgress}%
              </span>
            </button>

            <div className="ml-auto flex items-center gap-1">
              <button
                onClick={() => setActiveTab('ddl_spec')}
                className={`px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap flex items-center gap-1 text-[11px] ${
                  activeTab === 'ddl_spec' ? 'bg-emerald-700 text-white font-semibold' : 'text-emerald-300/80 hover:bg-emerald-900 hover:text-white'
                }`}
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>테이블 정의서 (30컬럼)</span>
              </button>

              <button
                onClick={() => setActiveTab('json_viewer')}
                className={`px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap flex items-center gap-1 text-[11px] ${
                  activeTab === 'json_viewer' ? 'bg-emerald-700 text-white font-semibold' : 'text-emerald-300/80 hover:bg-emerald-900 hover:text-white'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Raw JSONB 레코드</span>
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* =========================================================================
            TAB 1: 종합 대시보드 (Dashboard)
           ========================================================================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Top Analysis Header Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 bg-emerald-50 rounded-lg text-emerald-700 shrink-0 mt-0.5">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-slate-900">
                      {record.user_id} 취업 준비 종합 진단
                    </h2>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                      준비수준: 보완 (Intermediate)
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    목표: <strong>{record.target_company} {record.target_job}</strong> (목표 지원일: {record.career_goal_date}) | 프로젝트 깊이(88점)와 협업(89점)은 우수하나, <strong>인턴 실무 밀도(32점)</strong>와 <strong>CS 기본기(54점)</strong>가 주요 결손으로 도출되었습니다.
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2 font-mono">
                    <span>분석 버전: v{record.analysis_version}</span>
                    <span>·</span>
                    <span>최근 분석일시: {record.analysis_date}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setActiveTab('gap')}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <span>GAP 분석 보기</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setActiveTab('recommendations')}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                >
                  추천 활동 ({record.recommendations.length})
                </button>
              </div>
            </div>

            {/* 4 KPI Metrics Grid (Mapped to Database Columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Metric 1: overall_fit (competency_scores.overall_fit) */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span>직무 적합도 점수</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 font-mono">
                    competency_scores
                  </span>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
                    {record.competency_scores.overall_fit}
                  </span>
                  <span className="text-xs text-slate-500">/ 100점</span>
                </div>
                <div className="mt-2.5">
                  <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                    <span>합격 안정권 (85점)</span>
                    <span className="text-emerald-700 font-semibold font-mono">
                      {(85 - record.competency_scores.overall_fit).toFixed(1)}점 차이
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                      style={{ width: `${record.competency_scores.overall_fit}%` }}
                    ></div>
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
                  <span>알고리즘: RF Regressor</span>
                  <span className="text-emerald-700 font-medium">R² 0.84</span>
                </div>
              </div>

              {/* Metric 2: Academic & Basic Spec (major, grade, grade_scale, language_tests) */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span>학점 & 어학 현황</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-800 font-mono">
                    grade / lang
                  </span>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-blue-900 font-mono tracking-tight">
                    {record.grade}
                  </span>
                  <span className="text-xs text-slate-500">/ {record.grade_scale} 만점</span>
                </div>
                <div className="mt-2 text-xs text-slate-700 space-y-0.5">
                  <div>전공: <strong>{record.major}</strong></div>
                  <div>어학: {record.language_tests.map((t) => `${t.test_name} ${t.score}`).join(', ')}</div>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
                  <span>전공 일치도: 최상</span>
                  <span className="text-blue-700 font-medium">정규화 완료</span>
                </div>
              </div>

              {/* Metric 3: Critical Deficiency Count (gap_results) */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span>우선 결손 역량 (부족)</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-50 text-rose-800 font-mono">
                    gap_results
                  </span>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-rose-600 font-mono tracking-tight">
                    {record.gap_results.filter((g) => g.status === '부족').length}
                    <span className="text-xl text-slate-600 font-sans ml-1">개 영역</span>
                  </span>
                  <span className="text-xs text-slate-500">인턴 실무 · CS 코딩테스트</span>
                </div>
                <div className="mt-2 text-xs text-slate-600 line-clamp-2">
                  합격자 기준선 대비 최대 -53점 격차 발생 (우선 추천 활동 생성됨)
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
                  <span>보완 시 예상 상승</span>
                  <span className="text-emerald-700 font-semibold font-mono">+12.5점</span>
                </div>
              </div>

              {/* Metric 4: Roadmap Execution (roadmap) */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span>로드맵 실행률</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 font-mono">
                    roadmap JSONB
                  </span>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-emerald-700 font-mono tracking-tight">
                    {roadmapProgress}%
                  </span>
                  <span className="text-xs text-slate-500 font-mono">({completedRoadmaps} / {record.roadmap.length} 완료)</span>
                </div>
                <div className="mt-2.5">
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                      style={{ width: `${roadmapProgress}%` }}
                    ></div>
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
                  <span>목표 지원: {record.career_goal_date}</span>
                  <button onClick={() => setActiveTab('roadmap')} className="text-emerald-700 font-semibold hover:underline">
                    체크하기
                  </button>
                </div>
              </div>
            </div>

            {/* Radar / Score Comparison vs Target Standards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Column 1: competency_scores Detailed Breakdown */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm lg:col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-emerald-700" />
                    <span>역량별 평가 점수 상세 (competency_scores vs company_demo_profiles)</span>
                  </h3>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1.5 text-emerald-800 font-medium">
                      <span className="w-2.5 h-2.5 rounded-sm bg-emerald-600 inline-block"></span> 김스펙
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <span className="w-2.5 h-2.5 rounded-sm bg-slate-400 inline-block"></span> 합격자 평균
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  <code>spectop_user_analysis.competency_scores</code>에 저장된 0~100 정규화 지표입니다.
                </p>

                <div className="space-y-4">
                  {record.gap_results.map((g, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-slate-800">{g.domain}</span>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            g.status === '충분' ? 'bg-emerald-100 text-emerald-800' : g.status === '보완' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {g.status}
                          </span>
                          <span className="font-mono text-slate-700">
                            <strong>{g.user_score}점</strong> / {g.target_score}점
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              g.status === '충분' ? 'bg-emerald-600' : g.status === '보완' ? 'bg-amber-500' : 'bg-rose-500'
                            }`}
                            style={{ width: `${g.user_score}%` }}
                          ></div>
                        </div>
                        <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden flex opacity-60">
                          <div className="h-full bg-slate-400 rounded-full" style={{ width: `${g.target_score}%` }}></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs flex justify-between items-center text-slate-600">
                  <span>💡 <strong>진단 요약:</strong> 인턴 실무 경력(+53점 필요)과 CS 코딩테스트(+32점 필요) 집중 시 합격 안정권(85점 이상) 진입 가능</span>
                  <button onClick={() => setActiveTab('gap')} className="text-emerald-700 font-semibold hover:underline shrink-0 ml-3">
                    GAP 상세표 →
                  </button>
                </div>
              </div>

              {/* Column 2: company_demo_profiles Card */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
                <div className="border-b border-slate-100 pb-2">
                  <div className="text-[10px] font-mono text-slate-400">company_demo_profiles 기준치</div>
                  <h3 className="text-sm font-bold text-slate-900 mt-0.5">{record.company_demo_profiles.company} {record.company_demo_profiles.job}</h3>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 bg-slate-50 rounded-lg flex justify-between items-center">
                    <span className="text-slate-500">평균 학점 (avg_grade)</span>
                    <span className="font-mono font-bold text-slate-800">{record.company_demo_profiles.avg_grade} / 4.5</span>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-lg flex justify-between items-center">
                    <span className="text-slate-500">평균 프로젝트 (avg_projects)</span>
                    <span className="font-mono font-bold text-slate-800">{record.company_demo_profiles.avg_projects} 개</span>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-lg flex justify-between items-center">
                    <span className="text-slate-500">평균 실무 인턴 (avg_career_months)</span>
                    <span className="font-mono font-bold text-slate-800">{record.company_demo_profiles.avg_career_months} 개월</span>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-lg space-y-1">
                    <span className="text-slate-500 block">필수 기술 스택 (required_skills)</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {record.company_demo_profiles.required_skills.map((s, i) => (
                        <span key={i} className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono text-slate-700">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-lg space-y-1">
                    <span className="text-slate-500 block">CS 기준선 (cs_standards)</span>
                    <span className="text-slate-700 text-[11px] leading-tight block">
                      {record.company_demo_profiles.cs_standards}
                    </span>
                  </div>
                </div>

                <div className="pt-2 text-center">
                  <button
                    onClick={() => setActiveTab('collections')}
                    className="text-xs text-emerald-700 font-semibold hover:underline"
                  >
                    내 컬렉션 데이터 관리하기 →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: 데이터 컬렉션 (8개 JSONB Collections Explorer & Editor)
           ========================================================================= */}
        {activeTab === 'collections' && (
          <div className="space-y-6">
            {/* Header info */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-900">
                    JSONB 데이터 컬렉션 관리 (8개 배열 필드)
                  </h2>
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono">
                    spectop_user_analysis
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  테이블 정의서에 명시된 8개 JSONB 컬렉션(projects, careers, course_history, clubs, external_activities, awards, certificates, language_tests)을 직관적으로 탐색하고 수정합니다.
                </p>
              </div>

              <button
                onClick={() => setShowAddModal(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>+ 새 프로젝트 추가</span>
              </button>
            </div>

            {/* Sub-Tabs for the 8 JSONB Collections */}
            <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 pb-2">
              <button
                onClick={() => setCollectionTab('projects')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  collectionTab === 'projects' ? 'bg-emerald-800 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>프로젝트 (projects)</span>
                <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-white font-mono text-[10px]">
                  {record.projects.length}
                </span>
              </button>

              <button
                onClick={() => setCollectionTab('careers')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  collectionTab === 'careers' ? 'bg-emerald-800 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>경력/인턴 (careers)</span>
                <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-white font-mono text-[10px]">
                  {record.careers.length}
                </span>
              </button>

              <button
                onClick={() => setCollectionTab('course_history')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  collectionTab === 'course_history' ? 'bg-emerald-800 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>수강내역 (course_history)</span>
                <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-white font-mono text-[10px]">
                  {record.course_history.length}
                </span>
              </button>

              <button
                onClick={() => setCollectionTab('clubs')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  collectionTab === 'clubs' ? 'bg-emerald-800 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>동아리 (clubs)</span>
                <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-white font-mono text-[10px]">
                  {record.clubs.length}
                </span>
              </button>

              <button
                onClick={() => setCollectionTab('external_activities')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  collectionTab === 'external_activities' ? 'bg-emerald-800 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>대외활동 (external_activities)</span>
                <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-white font-mono text-[10px]">
                  {record.external_activities.length}
                </span>
              </button>

              <button
                onClick={() => setCollectionTab('awards')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  collectionTab === 'awards' ? 'bg-emerald-800 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>수상경력 (awards)</span>
                <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-white font-mono text-[10px]">
                  {record.awards.length}
                </span>
              </button>

              <button
                onClick={() => setCollectionTab('certificates')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  collectionTab === 'certificates' ? 'bg-emerald-800 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>자격증 (certificates)</span>
                <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-white font-mono text-[10px]">
                  {record.certificates.length}
                </span>
              </button>

              <button
                onClick={() => setCollectionTab('language_tests')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  collectionTab === 'language_tests' ? 'bg-emerald-800 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>어학성적 (language_tests)</span>
                <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-white font-mono text-[10px]">
                  {record.language_tests.length}
                </span>
              </button>
            </div>

            {/* Collection View Content */}
            {collectionTab === 'projects' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm lg:col-span-2">
                  <h3 className="text-sm font-bold text-slate-900 mb-3">
                    projects 컬렉션 (Array of Project Objects)
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                        <tr>
                          <th className="py-2.5 px-3">프로젝트명</th>
                          <th className="py-2.5 px-3">역할 / 기간</th>
                          <th className="py-2.5 px-3">사용 기술 (skills)</th>
                          <th className="py-2.5 px-3">선택</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {record.projects.map((p, idx) => {
                          const isSelected = selectedProject.name === p.name;
                          return (
                            <tr
                              key={idx}
                              onClick={() => setSelectedProject(p)}
                              className={`cursor-pointer transition-colors ${
                                isSelected ? 'bg-emerald-50/80 font-medium' : 'hover:bg-slate-50'
                              }`}
                            >
                              <td className="py-3 px-3 font-bold text-slate-900">{p.name}</td>
                              <td className="py-3 px-3 text-slate-600">
                                <div>{p.role}</div>
                                <div className="text-[11px] text-slate-400 font-mono">{p.start_date} ~ {p.end_date || '진행중'}</div>
                              </td>
                              <td className="py-3 px-3">
                                <div className="flex flex-wrap gap-1">
                                  {p.skills.map((s, i) => (
                                    <span key={i} className="px-1.5 py-0.2 bg-slate-100 rounded text-[10px] font-mono">
                                      {s}
                                    </span>
                                  ))}
                                </div>
                              </td>
                              <td className="py-3 px-3">
                                <span className="text-emerald-700 text-xs font-semibold hover:underline">
                                  {isSelected ? '선택됨' : '상세보기'}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Selected Project Card */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
                  <div className="border-b border-slate-100 pb-2">
                    <span className="text-[10px] text-slate-400 font-mono">선택된 프로젝트 상세 (JSONB 파싱)</span>
                    <h4 className="text-sm font-bold text-slate-900 mt-0.5">{selectedProject.name}</h4>
                    <div className="text-xs text-slate-500">{selectedProject.role} · {selectedProject.start_date} ~ {selectedProject.end_date}</div>
                  </div>

                  <div>
                    <span className="text-xs text-slate-400 font-semibold">프로젝트 내용 (description)</span>
                    <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100 mt-1 leading-relaxed">
                      {selectedProject.description}
                    </p>
                  </div>

                  <div>
                    <span className="text-xs text-slate-400 font-semibold">핵심 성과 (outcome)</span>
                    <div className="text-xs text-emerald-800 bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-100 mt-1 flex items-start gap-1.5 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{selectedProject.outcome}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs text-slate-400 font-semibold">사용 기술 배열 (skills[])</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedProject.skills.map((s, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-slate-100 rounded text-xs font-mono text-slate-800">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {collectionTab === 'careers' && (
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">careers 컬렉션 (인턴·실무·현장실습 경력)</h3>
                    <p className="text-xs text-slate-500">합격자 평균 4.5개월 대비 현재 보유한 실무 경력입니다.</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 font-medium">
                    인턴 공백 보완 필요
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">기관명 (organization)</th>
                        <th className="py-2.5 px-3">구분 (career_type)</th>
                        <th className="py-2.5 px-3">직무 / 역할</th>
                        <th className="py-2.5 px-3">수행 업무 (description)</th>
                        <th className="py-2.5 px-3">기간</th>
                        <th className="py-2.5 px-3">성과 (outcome)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {record.careers.map((c, i) => (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="py-3 px-3 font-bold text-slate-900">{c.organization}</td>
                          <td className="py-3 px-3"><span className="px-2 py-0.5 bg-slate-100 rounded text-[10px]">{c.career_type}</span></td>
                          <td className="py-3 px-3">{c.job} · {c.role}</td>
                          <td className="py-3 px-3 text-slate-600 max-w-xs">{c.description}</td>
                          <td className="py-3 px-3 font-mono">{c.start_date} ~ {c.end_date}</td>
                          <td className="py-3 px-3 text-emerald-700 font-medium">{c.outcome}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {collectionTab === 'course_history' && (
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
                <h3 className="text-sm font-bold text-slate-900">course_history 컬렉션 (수강 과목 및 성적)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  {record.course_history.map((c, i) => (
                    <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="flex justify-between items-center text-[11px] text-slate-400 font-mono">
                        <span>{c.year}년 {c.semester}</span>
                        <span className="font-bold text-emerald-700">{c.grade}</span>
                      </div>
                      <div className="font-bold text-slate-900 text-sm mt-1">{c.course_name}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {collectionTab === 'clubs' && (
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
                <h3 className="text-sm font-bold text-slate-900">clubs 컬렉션 (동아리 및 소모임)</h3>
                <div className="divide-y divide-slate-100 text-xs">
                  {record.clubs.map((c, i) => (
                    <div key={i} className="py-3">
                      <div className="flex justify-between items-center">
                        <strong className="text-slate-900 text-sm">{c.name}</strong>
                        <span className="text-slate-400 font-mono">{c.start_date} ~ {c.end_date}</span>
                      </div>
                      <div className="text-emerald-700 font-semibold mt-0.5">역할: {c.role}</div>
                      <p className="text-slate-600 mt-1 leading-relaxed">{c.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {collectionTab === 'external_activities' && (
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
                <h3 className="text-sm font-bold text-slate-900">external_activities 컬렉션 (대외활동)</h3>
                <div className="divide-y divide-slate-100 text-xs">
                  {record.external_activities.map((a, i) => (
                    <div key={i} className="py-3">
                      <div className="flex justify-between items-center">
                        <strong className="text-slate-900 text-sm">{a.name}</strong>
                        <span className="text-slate-400 font-mono">{a.start_date} ~ {a.end_date}</span>
                      </div>
                      <div className="text-slate-500 mt-0.5">기관: {a.organization} | 역할: {a.role}</div>
                      <p className="text-slate-600 mt-1">{a.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {collectionTab === 'awards' && (
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
                <h3 className="text-sm font-bold text-slate-900">awards 컬렉션 (수상경력)</h3>
                <div className="divide-y divide-slate-100 text-xs">
                  {record.awards.map((a, i) => (
                    <div key={i} className="py-3 flex justify-between items-center">
                      <div>
                        <span className="text-amber-800 font-bold text-sm">{a.name}</span>
                        <div className="text-slate-500 mt-0.5">{a.competition_name} · 규모: {a.competition_scale}</div>
                      </div>
                      <span className="font-mono text-slate-400">{a.award_date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {collectionTab === 'certificates' && (
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
                <h3 className="text-sm font-bold text-slate-900">certificates 컬렉션 (자격증)</h3>
                <div className="divide-y divide-slate-100 text-xs">
                  {record.certificates.map((c, i) => (
                    <div key={i} className="py-3 flex justify-between items-center">
                      <div>
                        <strong className="text-slate-900 text-sm">{c.name}</strong>
                        <div className="text-slate-500 mt-0.5">발급처: {c.issuer}</div>
                      </div>
                      <span className="font-mono text-slate-400">{c.acquired_date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {collectionTab === 'language_tests' && (
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
                <h3 className="text-sm font-bold text-slate-900">language_tests 컬렉션 (어학시험 및 점수)</h3>
                <div className="divide-y divide-slate-100 text-xs">
                  {record.language_tests.map((l, i) => (
                    <div key={i} className="py-3 flex justify-between items-center">
                      <div>
                        <strong className="text-slate-900 text-sm">{l.test_name}</strong>
                        <div className="text-emerald-700 font-bold mt-0.5">취득 점수/등급: {l.score}</div>
                      </div>
                      <span className="font-mono text-slate-400">{l.acquired_date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal: Add Project */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 border border-slate-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">projects 컬렉션에 새 프로젝트 등록</h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddProjectSubmit} className="space-y-3.5 mt-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">프로젝트명 (name) *</label>
                  <input
                    type="text"
                    required
                    placeholder="예: 분산 캐시 기반 대규모 좌석 예매 시스템"
                    value={newProjectForm.name}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, name: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">담당 역할 (role)</label>
                    <input
                      type="text"
                      placeholder="예: 백엔드 팀장"
                      value={newProjectForm.role}
                      onChange={(e) => setNewProjectForm({ ...newProjectForm, role: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">사용 기술 (skills[], 쉼표 구분)</label>
                    <input
                      type="text"
                      placeholder="예: Spring Boot, Redis, Kafka"
                      value={newProjectForm.skills}
                      onChange={(e) => setNewProjectForm({ ...newProjectForm, skills: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">프로젝트 내용 (description)</label>
                  <textarea
                    rows={2}
                    placeholder="프로젝트 목표 및 구조"
                    value={newProjectForm.description}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, description: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">수치 성과 (outcome)</label>
                  <input
                    type="text"
                    placeholder="예: 초당 트랜잭션 1,200 TPS 달성 및 지연 30% 감축"
                    value={newProjectForm.outcome}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, outcome: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">시작일 (start_date)</label>
                    <input
                      type="month"
                      value={newProjectForm.start_date}
                      onChange={(e) => setNewProjectForm({ ...newProjectForm, start_date: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">종료일 (end_date)</label>
                    <input
                      type="month"
                      value={newProjectForm.end_date}
                      onChange={(e) => setNewProjectForm({ ...newProjectForm, end_date: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-2"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-100"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-sm"
                  >
                    프로젝트 JSONB에 추가
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: GAP 분석 결과 (gap_results)
           ========================================================================= */}
        {activeTab === 'gap' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  합격자 대비 역량 GAP 정밀 분석 (gap_results 컬럼)
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  테이블의 <code>gap_results</code> JSONB 배열에 저장된 항목별 격차 수치 및 보완 우선순위입니다.
                </p>
              </div>

              <button
                onClick={handleRunAiAnalysis}
                disabled={isAnalyzing}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-lg text-xs flex items-center gap-2 transition-colors shrink-0 shadow-sm disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
                <span>{isAnalyzing ? '재분석 중...' : 'GAP 재계산'}</span>
              </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-3">평가 영역 (domain)</th>
                      <th className="py-3 px-3">내 상태 (user_status)</th>
                      <th className="py-3 px-3">합격자 기준 (target_standard)</th>
                      <th className="py-3 px-3">진단 수준 (status)</th>
                      <th className="py-3 px-3">점수 격차 (gap)</th>
                      <th className="py-3 px-3">우선순위 (priority)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {record.gap_results.map((g, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-3">
                          <div className="font-bold text-slate-900">{g.domain}</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">{g.description}</div>
                        </td>
                        <td className="py-3.5 px-3 text-slate-700">{g.user_status}</td>
                        <td className="py-3.5 px-3 text-slate-600">{g.target_standard}</td>
                        <td className="py-3.5 px-3">
                          <span className={`px-2.5 py-1 rounded text-xs font-bold inline-block ${
                            g.status === '충분' ? 'bg-emerald-100 text-emerald-800' : g.status === '보완' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {g.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 font-mono">
                          <div className="font-bold text-slate-900">{g.user_score}점 / {g.target_score}점</div>
                          <div className={`text-[11px] font-semibold ${g.gap >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                            ({g.gap >= 0 ? `+${g.gap}` : g.gap}점)
                          </div>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="text-xs font-semibold text-slate-700">{g.priority}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: 추천 활동 (recommendations)
           ========================================================================= */}
        {activeTab === 'recommendations' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  GAP 기반 추천 활동 (recommendations 컬럼)
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  결손 역량(인턴 실무 경험 0개월, CS 기본기)을 직접 채워주는 맞춤 활동입니다.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('roadmap')}
                className="px-3.5 py-2 bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shrink-0"
              >
                <span>현재 로드맵 보기</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {record.recommendations.map((rec) => (
                <div key={rec.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {rec.category}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">난이도: {rec.difficulty}</span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 leading-snug">{rec.title}</h3>

                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs space-y-2">
                      <div>
                        <strong className="text-slate-800">해소 대상:</strong>{' '}
                        <span className="text-rose-700 font-medium">{rec.target_gap}</span>
                      </div>
                      <div>
                        <strong className="text-slate-800">추천 이유:</strong>{' '}
                        <span className="text-slate-600">{rec.reason}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-emerald-700 font-mono">
                      {rec.expected_outcome}
                    </span>
                    <button
                      onClick={() => handleAddRecToRoadmap(rec)}
                      disabled={rec.added_to_roadmap}
                      className={`text-xs px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1 transition-colors ${
                        rec.added_to_roadmap
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{rec.added_to_roadmap ? '로드맵 포함됨' : '로드맵에 추가'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 5: 커리어 로드맵 (roadmap)
           ========================================================================= */}
        {activeTab === 'roadmap' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  개인별 단계별 커리어 로드맵 (roadmap 컬럼)
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  목표 지원일({record.career_goal_date})까지 월별로 우선순위화된 마일스톤 배열입니다.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <div className="text-xs text-slate-400">로드맵 달성률</div>
                  <div className="text-lg font-extrabold text-emerald-700 font-mono">{roadmapProgress}%</div>
                </div>
                <div className="w-24 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full transition-all duration-300" style={{ width: `${roadmapProgress}%` }}></div>
                </div>
              </div>
            </div>

            <div className="relative border-l-2 border-emerald-600/30 ml-4 pl-6 space-y-5">
              {record.roadmap.map((item) => (
                <div key={item.id} className="relative group">
                  <div
                    onClick={() => handleToggleRoadmap(item.id)}
                    className={`absolute -left-[35px] top-1.5 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                      item.is_completed
                        ? 'bg-emerald-600 text-white shadow-sm ring-4 ring-emerald-100'
                        : 'bg-white border-2 border-slate-300 text-transparent hover:border-emerald-500'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>

                  <div className={`p-4 rounded-xl border transition-all ${
                    item.is_completed ? 'bg-slate-50 border-slate-200 opacity-80' : 'bg-white border-slate-200 shadow-sm'
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-200">
                          {item.month}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                          {item.category}
                        </span>
                        <h3 className={`text-sm font-bold ${item.is_completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                          {item.title}
                        </h3>
                      </div>
                      <button
                        onClick={() => handleToggleRoadmap(item.id)}
                        className={`text-xs px-2.5 py-1 rounded font-medium transition-colors ${
                          item.is_completed
                            ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700'
                        }`}
                      >
                        {item.is_completed ? '완료 취소' : '완료 체크'}
                      </button>
                    </div>

                    <p className={`text-xs mt-2 leading-relaxed ${item.is_completed ? 'text-slate-400' : 'text-slate-600'}`}>
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 6: 테이블 정의서 (30개 컬럼 전체 명세 & PostgreSQL DDL)
           ========================================================================= */}
        {activeTab === 'ddl_spec' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <TableIcon className="w-5 h-5 text-emerald-700" />
                  <span>spectop_user_analysis 테이블 정의서 (전체 30 컬럼)</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  제공해주신 데이터 설계 기준 30개 컬럼 및 JSONB 상세 구조가 100% 매핑된 데이터베이스 명세입니다.
                </p>
              </div>

              <button
                onClick={() => handleCopy(POSTGRESQL_DDL_NEW, 'PostgreSQL DDL')}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3.5 py-2 rounded-lg flex items-center gap-2 transition-colors shrink-0 shadow-sm"
              >
                {copiedText ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedText ? '복사 완료!' : 'PostgreSQL DDL 복사'}</span>
              </button>
            </div>

            {/* Table Spec Interactive List */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-2 font-semibold">No</th>
                      <th className="py-2.5 px-3 font-semibold">컬럼명</th>
                      <th className="py-2.5 px-3 font-semibold">데이터 타입</th>
                      <th className="py-2.5 px-2 font-semibold">길이</th>
                      <th className="py-2.5 px-2 font-semibold">PK</th>
                      <th className="py-2.5 px-2 font-semibold">NN</th>
                      <th className="py-2.5 px-3 font-semibold">Default</th>
                      <th className="py-2.5 px-4 font-semibold">설명</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {TABLE_SPEC_COLUMNS.map((col) => (
                      <tr key={col.no} className="hover:bg-slate-50 font-mono">
                        <td className="py-2.5 px-2 text-slate-400">{col.no}</td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">{col.name}</td>
                        <td className="py-2.5 px-3 text-emerald-700 font-semibold">{col.type}</td>
                        <td className="py-2.5 px-2 text-slate-500">{col.length || '-'}</td>
                        <td className="py-2.5 px-2 text-center">{col.pk ? 'Y' : ''}</td>
                        <td className="py-2.5 px-2 text-center">{col.nn ? 'Y' : ''}</td>
                        <td className="py-2.5 px-3 text-slate-500">{col.defaultVal || '-'}</td>
                        <td className="py-2.5 px-4 font-sans text-slate-700">{col.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* DDL Preview Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-2">
              <h3 className="text-sm font-bold text-slate-900">PostgreSQL DDL 스키마 (GIN 인덱스 포함)</h3>
              <pre className="p-4 bg-slate-950 text-slate-200 rounded-lg text-[11px] font-mono overflow-x-auto leading-relaxed max-h-96">
                {POSTGRESQL_DDL_NEW}
              </pre>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 7: Raw JSONB 레코드 뷰어 (Full Database Row)
           ========================================================================= */}
        {activeTab === 'json_viewer' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-emerald-700" />
                  <span>실시간 DB Row JSON 데이터 (spectop_user_analysis 인스턴스)</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  현재 앱 화면에서 변경된 모든 데이터가 30개 컬럼 형식의 단일 레코드 객체로 실시간 반영됩니다.
                </p>
              </div>

              <button
                onClick={() => handleCopy(JSON.stringify(record, null, 2), 'JSONB 데이터')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg flex items-center gap-2 transition-colors shrink-0 shadow-sm"
              >
                {copiedText ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                <span>{copiedText ? '복사 완료!' : 'JSON 복사'}</span>
              </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <pre className="p-4 bg-slate-950 text-emerald-300 rounded-lg text-[11px] font-mono overflow-x-auto leading-relaxed max-h-[600px]">
                {JSON.stringify(record, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong>스펙탑 (SpecTop)</strong> · <code>spectop_user_analysis</code> 30개 컬럼 데이터 모델 완결 구현
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            User ID: {record.user_id} | Version: v{record.analysis_version} | Status: OK
          </div>
        </div>
      </footer>
    </div>
  );
}

// 30 Column Definitions for the Table Spec
const TABLE_SPEC_COLUMNS = [
  { no: 1, name: 'user_id', type: 'VARCHAR', length: '50', pk: true, nn: true, defaultVal: '-', desc: '사용자 고유 식별자' },
  { no: 2, name: 'major', type: 'VARCHAR', length: '100', pk: false, nn: true, defaultVal: '-', desc: '전공명' },
  { no: 3, name: 'school_year', type: 'VARCHAR', length: '20', pk: false, nn: true, defaultVal: '-', desc: '학년 또는 재학·졸업·취준 상태' },
  { no: 4, name: 'grade', type: 'DECIMAL', length: '3,2', pk: false, nn: false, defaultVal: 'NULL', desc: '전체 학점' },
  { no: 5, name: 'grade_scale', type: 'DECIMAL', length: '2,1', pk: false, nn: false, defaultVal: 'NULL', desc: '학점 만점 기준 (e.g. 4.5)' },
  { no: 6, name: 'language_tests', type: 'JSONB', length: '-', pk: false, nn: false, defaultVal: '[]', desc: '어학시험 및 성적 정보 (test_name, score, acquired_date)' },
  { no: 7, name: 'certificates', type: 'JSONB', length: '-', pk: false, nn: false, defaultVal: '[]', desc: '자격증 및 취득일 정보 (name, issuer, acquired_date)' },
  { no: 8, name: 'awards', type: 'JSONB', length: '-', pk: false, nn: false, defaultVal: '[]', desc: '수상경력 및 수상일 정보 (name, competition_name, scale, date)' },
  { no: 9, name: 'clubs', type: 'JSONB', length: '-', pk: false, nn: false, defaultVal: '[]', desc: '동아리 활동 이력 (name, role, description, start, end)' },
  { no: 10, name: 'external_activities', type: 'JSONB', length: '-', pk: false, nn: false, defaultVal: '[]', desc: '대외활동 이력 (name, organization, role, start, end)' },
  { no: 11, name: 'course_history', type: 'JSONB', length: '-', pk: false, nn: false, defaultVal: '[]', desc: '수강과목 및 수강시점 (course_name, year, semester, grade)' },
  { no: 12, name: 'projects', type: 'JSONB', length: '-', pk: false, nn: false, defaultVal: '[]', desc: '프로젝트 수행 이력 (name, role, description, skills, outcome)' },
  { no: 13, name: 'careers', type: 'JSONB', length: '-', pk: false, nn: false, defaultVal: '[]', desc: '인턴·근무·현장실습 등의 경력 (organization, type, job, role)' },
  { no: 14, name: 'experiences', type: 'JSONB', length: '-', pk: false, nn: false, defaultVal: '[]', desc: '기타 경험 정보' },
  { no: 15, name: 'target_company', type: 'VARCHAR', length: '100', pk: false, nn: true, defaultVal: '-', desc: '희망 기업' },
  { no: 16, name: 'target_job', type: 'VARCHAR', length: '100', pk: false, nn: true, defaultVal: '-', desc: '희망 직무' },
  { no: 17, name: 'career_goal_date', type: 'DATE', length: '-', pk: false, nn: true, defaultVal: '-', desc: '목표 지원 시점' },
  { no: 18, name: 'skill_tags', type: 'JSONB', length: '-', pk: false, nn: false, defaultVal: '[]', desc: '사용자 보유 기술 태그' },
  { no: 19, name: 'experience_tags', type: 'JSONB', length: '-', pk: false, nn: false, defaultVal: '[]', desc: '경험 기반 역량 태그' },
  { no: 20, name: 'virtual_candidate_profiles', type: 'JSONB', length: '-', pk: false, nn: false, defaultVal: '[]', desc: '비교 대상 가상 합격자 프로필' },
  { no: 21, name: 'company_demo_profiles', type: 'JSONB', length: '-', pk: false, nn: false, defaultVal: '{}', desc: '목표 기업·직무의 가상 비교 기준' },
  { no: 22, name: 'competency_scores', type: 'JSONB', length: '-', pk: false, nn: false, defaultVal: '{}', desc: '역량별 0~100 평가 점수' },
  { no: 23, name: 'competency_levels', type: 'JSONB', length: '-', pk: false, nn: false, defaultVal: '{}', desc: '역량별 수준 및 판단 근거' },
  { no: 24, name: 'gap_results', type: 'JSONB', length: '-', pk: false, nn: false, defaultVal: '[]', desc: '합격자 대비 역량 GAP 분석 결과' },
  { no: 25, name: 'recommendations', type: 'JSONB', length: '-', pk: false, nn: false, defaultVal: '[]', desc: 'GAP 기반 추천 활동' },
  { no: 26, name: 'roadmap', type: 'JSONB', length: '-', pk: false, nn: false, defaultVal: '[]', desc: '개인별 단계별 커리어 로드맵' },
  { no: 27, name: 'analysis_version', type: 'INTEGER', length: '-', pk: false, nn: true, defaultVal: '1', desc: '분석 버전' },
  { no: 28, name: 'analysis_date', type: 'TIMESTAMP', length: '-', pk: false, nn: false, defaultVal: 'NULL', desc: '최근 분석 수행 일시' },
  { no: 29, name: 'created_at', type: 'TIMESTAMP', length: '-', pk: false, nn: true, defaultVal: 'CURRENT_TIMESTAMP', desc: '최초 생성 일시' },
  { no: 30, name: 'updated_at', type: 'TIMESTAMP', length: '-', pk: false, nn: true, defaultVal: 'CURRENT_TIMESTAMP', desc: '최종 수정 일시' }
];

// Complete PostgreSQL DDL Script matching the 30 columns table specification
const POSTGRESQL_DDL_NEW = `-- ============================================================
-- spectop_user_analysis 테이블 DDL (PostgreSQL 14+ / Cloud SQL)
-- 30개 컬럼 & JSONB GIN 인덱스 완결 설계
-- ============================================================

CREATE TABLE IF NOT EXISTS spectop_user_analysis (
    -- 1. 식별자 & 기본 학적
    user_id                     VARCHAR(50) PRIMARY KEY,
    major                       VARCHAR(100) NOT NULL,
    school_year                 VARCHAR(20) NOT NULL,
    grade                       DECIMAL(3, 2) DEFAULT NULL,
    grade_scale                 DECIMAL(2, 1) DEFAULT NULL,

    -- 6~14. 사용자 활동 & 이력 JSONB 컬렉션
    language_tests              JSONB DEFAULT '[]'::jsonb,
    certificates                JSONB DEFAULT '[]'::jsonb,
    awards                      JSONB DEFAULT '[]'::jsonb,
    clubs                       JSONB DEFAULT '[]'::jsonb,
    external_activities         JSONB DEFAULT '[]'::jsonb,
    course_history              JSONB DEFAULT '[]'::jsonb,
    projects                    JSONB DEFAULT '[]'::jsonb,
    careers                     JSONB DEFAULT '[]'::jsonb,
    experiences                 JSONB DEFAULT '[]'::jsonb,

    -- 15~17. 목표 설정
    target_company              VARCHAR(100) NOT NULL,
    target_job                  VARCHAR(100) NOT NULL,
    career_goal_date            DATE NOT NULL,

    -- 18~19. 태그 정보
    skill_tags                  JSONB DEFAULT '[]'::jsonb,
    experience_tags             JSONB DEFAULT '[]'::jsonb,

    -- 20~21. 가상 비교 기준
    virtual_candidate_profiles  JSONB DEFAULT '[]'::jsonb,
    company_demo_profiles       JSONB DEFAULT '{}'::jsonb,

    -- 22~26. AI 분석 결과 & 추천 로드맵
    competency_scores           JSONB DEFAULT '{}'::jsonb,
    competency_levels           JSONB DEFAULT '{}'::jsonb,
    gap_results                 JSONB DEFAULT '[]'::jsonb,
    recommendations             JSONB DEFAULT '[]'::jsonb,
    roadmap                     JSONB DEFAULT '[]'::jsonb,

    -- 27~30. 메타데이터 & 버전 관리
    analysis_version            INTEGER NOT NULL DEFAULT 1,
    analysis_date               TIMESTAMP DEFAULT NULL,
    created_at                  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at                  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 검색 성능 최적화를 위한 B-Tree 및 JSONB GIN 인덱스
CREATE INDEX IF NOT EXISTS idx_spectop_target ON spectop_user_analysis (target_company, target_job);
CREATE INDEX IF NOT EXISTS idx_spectop_major ON spectop_user_analysis (major);

-- JSONB 빠른 조회를 위한 GIN 인덱스
CREATE INDEX IF NOT EXISTS idx_spectop_projects_gin ON spectop_user_analysis USING GIN (projects);
CREATE INDEX IF NOT EXISTS idx_spectop_careers_gin ON spectop_user_analysis USING GIN (careers);
CREATE INDEX IF NOT EXISTS idx_spectop_skill_tags_gin ON spectop_user_analysis USING GIN (skill_tags);
CREATE INDEX IF NOT EXISTS idx_spectop_competency_scores_gin ON spectop_user_analysis USING GIN (competency_scores);
`;
