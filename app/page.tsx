import Link from 'next/link';
import { Icon } from '@/components/ui';

export default function LandingPage() {
  return (
    <>
      <section className="home-hero">
        <div className="home-copy">
          <p className="home-kicker">데모용 가상 합격자 데이터 · AI 생성 · 실제 채용 통계 아님</p>
          <h1>
            경험을 입력하면, 가상 합격자 기준으로
            <br />
            역량 GAP과 다음 행동을 알려드립니다
          </h1>
          <p className="home-lead">
            전공·경험을 등록하고 목표 기업·직무를 선택하면, 가상 합격자 비교 데이터를 기준으로 역량을 숫자(0~100)와
            단계로 분석하고, 보완 활동과 기업별 커리어 로드맵을 제시합니다. 로그인 없이 브라우저에만 저장됩니다.
          </p>
          <Link href="/profile" className="btn btn-primary">
            <span>커리어 분석 시작하기</span>
            <Icon name="chevron" size={18} />
          </Link>
        </div>

        <div className="home-preview">
          <div className="home-preview-head">
            <span>역량 GAP 분석 미리보기</span>
          </div>
          <div className="preview-block">
            <span className="preview-label">예시 비교 결과</span>
            <div className="preview-rows">
              <div>
                <b>CS·문제 해결</b>
                <span>미확인</span>
              </div>
              <div>
                <b>협업</b>
                <span>72점 · 양호</span>
              </div>
            </div>
            <div className="preview-arrow">
              <Icon name="chevron" size={18} />
            </div>
            <div className="preview-priority">
              <Icon name="trend" size={18} />
              <span>보완 1순위: CS·문제 해결 — 관련 경험 미확인</span>
            </div>
            <div className="preview-direction">
              DB 설계 경험을 추가하면 재분석 시 CS·문제 해결 점수가 갱신됩니다.
            </div>
          </div>
        </div>
      </section>

      <section className="home-steps">
        <div className="step-grid">
          <div className="step-card">
            <span className="step-no">01</span>
            <h3>숫자 + 단계 분석</h3>
            <p>역량별 0~100 참고 점수와 강점/보완 필요/미확인 단계를 근거와 함께 보여줍니다.</p>
          </div>
          <div className="step-card">
            <span className="step-no">02</span>
            <h3>가상 합격자 비교</h3>
            <p>시연용 가상 기업 A·B의 역량 기준과 가상 합격자 프로필에 비추어 비교합니다.</p>
          </div>
          <div className="step-card">
            <span className="step-no">03</span>
            <h3>기업별 로드맵</h3>
            <p>목표 기업을 바꾸면 중점 역량에 맞춰 단계별 준비 계획의 우선순위가 달라집니다.</p>
          </div>
        </div>
      </section>
    </>
  );
}
