import type { Metadata } from 'next';
import Header from '@/components/Header';
import './globals.css';

export const metadata: Metadata = {
  title: '스펙탑 (SpecTop) - AI 맞춤형 취업 준비 서비스',
  description:
    '대학생의 경험을 가상 합격자 비교 데이터와 목표 기업·직무 기준에 비추어 역량을 숫자+단계로 분석하고, 보완 활동과 기업별 커리어 로드맵을 제시하는 데모 서비스',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="app">
        <Header />
        <main className="page">{children}</main>
      </body>
    </html>
  );
}
