# spectop_user_analysis 테이블 정의서

> 스펙탑(SpecTop) 사용자 1명의 프로필·경험·목표·분석 결과를 담는 테이블.
> 대회 MVP에서는 실제 DB 대신 이 구조를 그대로 TypeScript 타입으로 만들어 브라우저 localStorage(`spectop_mvp_v1_2`)에 저장한다.
> 실서비스에서는 PostgreSQL(JSONB)에 저장하는 것을 전제로 한다.

## 1. 컬럼 정의

| No | 컬럼명 | 데이터 타입 | 길이 | PK | NN | Default | 설명 |
|---|---|---|---|---|---|---|---|
| 1 | `user_id` | VARCHAR | 50 | Y | Y | - | 사용자 고유 식별자 |
| 2 | `major` | VARCHAR | 100 |  | Y | - | 전공명 |
| 3 | `school_year` | VARCHAR | 20 |  | Y | - | 학년 또는 재학·졸업·취준 상태 |
| 4 | `grade` | DECIMAL | 3,2 |  | N | NULL | 전체 학점 |
| 5 | `grade_scale` | DECIMAL | 2,1 |  | N | NULL | 학점 만점 기준 |
| 6 | `language_tests` | JSONB | - |  | N | `[]` | 어학시험 및 성적 정보 |
| 7 | `certificates` | JSONB | - |  | N | `[]` | 자격증 및 취득일 정보 |
| 8 | `awards` | JSONB | - |  | N | `[]` | 수상경력 및 수상일 정보 |
| 9 | `clubs` | JSONB | - |  | N | `[]` | 동아리 활동 이력 |
| 10 | `external_activities` | JSONB | - |  | N | `[]` | 대외활동 이력 |
| 11 | `course_history` | JSONB | - |  | N | `[]` | 수강과목 및 수강시점 |
| 12 | `projects` | JSONB | - |  | N | `[]` | 프로젝트 수행 이력 |
| 13 | `careers` | JSONB | - |  | N | `[]` | 인턴·근무·현장실습 등의 경력 |
| 14 | `experiences` | JSONB | - |  | N | `[]` | 기타 경험 정보 |
| 15 | `target_company` | VARCHAR | 100 |  | Y | - | 희망 기업 |
| 16 | `target_job` | VARCHAR | 100 |  | Y | - | 희망 직무 |
| 17 | `career_goal_date` | DATE | - |  | Y | - | 목표 지원 시점 |
| 18 | `skill_tags` | JSONB | - |  | N | `[]` | 사용자 보유 기술 태그 |
| 19 | `experience_tags` | JSONB | - |  | N | `[]` | 경험 기반 역량 태그 |
| 20 | `virtual_candidate_profiles` | JSONB | - |  | N | `[]` | 비교 대상 가상 합격자 프로필 |
| 21 | `company_demo_profiles` | JSONB | - |  | N | `{}` | 목표 기업·직무의 가상 비교 기준 |
| 22 | `competency_scores` | JSONB | - |  | N | `{}` | 역량별 0~100 평가 점수 |
| 23 | `competency_levels` | JSONB | - |  | N | `{}` | 역량별 수준 및 판단 근거 |
| 24 | `gap_results` | JSONB | - |  | N | `[]` | 합격자 대비 역량 GAP 분석 결과 |
| 25 | `recommendations` | JSONB | - |  | N | `[]` | GAP 기반 추천 활동 |
| 26 | `roadmap` | JSONB | - |  | N | `[]` | 개인별 단계별 커리어 로드맵 |
| 27 | `analysis_version` | INTEGER | - |  | Y | `1` | 분석 버전 |
| 28 | `analysis_date` | TIMESTAMP | - |  | N | NULL | 최근 분석 수행 일시 |
| 29 | `created_at` | TIMESTAMP | - |  | Y | `CURRENT_TIMESTAMP` | 최초 생성 일시 |
| 30 | `updated_at` | TIMESTAMP | - |  | Y | `CURRENT_TIMESTAMP` | 최종 수정 일시 |

## 2. JSONB 컬럼 상세 정의

| 컬럼 | Key | Type | 필수 | 설명 |
|---|---|---|---|---|
| `language_tests` | `test_name` | String | Y | 시험명 |
|  | `score` | Number/String | Y | 점수 또는 등급 |
|  | `acquired_date` | YYYY-MM | Y | 성적 취득일 |
| `certificates` | `name` | String | Y | 자격증명 |
|  | `issuer` | String | N | 발급기관 |
|  | `acquired_date` | YYYY-MM | Y | 취득일 |
| `awards` | `name` | String | Y | 수상명 |
|  | `competition_name` | String | N | 대회명 |
|  | `competition_scale` | String | N | 교내·지역·전국·국제 등 |
|  | `award_date` | YYYY-MM | Y | 수상일 |
| `clubs` | `name` | String | Y | 동아리명 |
|  | `role` | String | N | 역할 |
|  | `description` | String | N | 주요 활동 |
|  | `start_date` | YYYY-MM | Y | 시작일 |
|  | `end_date` | YYYY-MM | N | 종료일 |
| `external_activities` | `name` | String | Y | 대외활동명 |
|  | `organization` | String | N | 주관기관 |
|  | `role` | String | N | 역할 |
|  | `description` | String | N | 주요 활동 |
|  | `start_date` | YYYY-MM | Y | 시작일 |
|  | `end_date` | YYYY-MM | N | 종료일 |
| `course_history` | `course_name` | String | Y | 과목명 |
|  | `year` | Integer | Y | 수강연도 |
|  | `semester` | String | Y | 수강학기 |
|  | `grade` | String | N | 과목 성적 |
| `projects` | `name` | String | Y | 프로젝트명 |
|  | `role` | String | N | 담당 역할 |
|  | `description` | String | N | 프로젝트 내용 |
|  | `skills` | Array[String] | N | 사용 기술 |
|  | `outcome` | String | N | 성과 |
|  | `start_date` | YYYY-MM | Y | 시작일 |
|  | `end_date` | YYYY-MM | N | 종료일 |
| `careers` | `organization` | String | Y | 기업·기관명 |
|  | `career_type` | String | Y | 인턴·근무·현장실습 등 |
|  | `job` | String | N | 직무 |
|  | `role` | String | N | 담당 역할 |
|  | `description` | String | N | 수행 업무 |
|  | `skills` | Array[String] | N | 활용 기술 |
|  | `outcome` | String | N | 주요 성과 |
|  | `start_date` | YYYY-MM | Y | 시작일 |
|  | `end_date` | YYYY-MM | N | 종료일 |

## 3. 예시 (`careers`)

```json
[
  {
    "organization": "ABC Tech",
    "career_type": "intern",
    "job": "Backend Developer",
    "role": "백엔드 API 개발",
    "description": "서비스 API 개발 및 유지보수",
    "skills": ["Java", "Spring", "MySQL"],
    "outcome": "API 응답속도 20% 개선",
    "start_date": "2025-01",
    "end_date": "2025-03"
  },
  {
    "organization": "XYZ Lab",
    "career_type": "intern",
    "job": "Backend Developer",
    "role": "서버 개발",
    "description": "사내 서비스 서버 개발",
    "skills": ["Spring", "AWS"],
    "outcome": "배포 자동화 구축 참여",
    "start_date": "2025-07",
    "end_date": "2025-08"
  }
]
```
