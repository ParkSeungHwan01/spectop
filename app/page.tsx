import Link from 'next/link';
import { ArrowRight, Sparkles, TrendingUp, Calendar } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="space-y-8">
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          <Sparkles className="w-3.5 h-3.5" />
          데모용 가상 합격자 데이터 · AI 생성 · 실제 채용 통계 아님
        </span>

        <h1 className="mt-4 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          경험을 입력하면, 가상 합격자 기준으로 역량 GAP과 다음 행동을 알려드립니다
        </h1>
        <p className="mt-3 text-sm text-slate-600 leading-relaxed">
          전공·경험을 등록하고 목표 기업·직무를 선택하면, 가상 합격자 비교 데이터를 기준으로 역량을 숫자(0~100)와
          단계로 분석하고, 보완 활동과 기업별 커리어 로드맵을 제시합니다. 이번 데모는 로그인 없이 브라우저에만
          저장됩니다.
        </p>

        <Link
          href="/profile"
          className="mt-6 inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-5 py-3 rounded-lg transition-colors shadow-sm"
        >
          <span>커리어 분석 시작하기</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="p-2 bg-emerald-50 rounded-lg text-emerald-700 w-fit">
            <TrendingUp className="w-4 h-4" />
          </div>
          <h3 className="mt-3 text-sm font-bold text-slate-900">숫자 + 단계 분석</h3>
          <p className="mt-1 text-xs text-slate-500 leading-relaxed">
            역량별 0~100 참고 점수와 강점/보완 필요/미확인 단계를 근거와 함께 보여줍니다.
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="p-2 bg-emerald-50 rounded-lg text-emerald-700 w-fit">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="mt-3 text-sm font-bold text-slate-900">가상 합격자 비교</h3>
          <p className="mt-1 text-xs text-slate-500 leading-relaxed">
            시연용 가상 기업 A·B의 역량 기준과 가상 합격자 프로필에 비추어 비교합니다.
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="p-2 bg-emerald-50 rounded-lg text-emerald-700 w-fit">
            <Calendar className="w-4 h-4" />
          </div>
          <h3 className="mt-3 text-sm font-bold text-slate-900">기업별 로드맵</h3>
          <p className="mt-1 text-xs text-slate-500 leading-relaxed">
            목표 기업을 바꾸면 중점 역량에 맞춰 단계별 준비 계획의 우선순위가 달라집니다.
          </p>
        </div>
      </div>
    </div>
  );
}
