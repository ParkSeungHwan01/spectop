'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/', label: '홈' },
  { href: '/profile', label: '프로필' },
  { href: '/goal', label: '목표 설정' },
  { href: '/experiences', label: '경험 기록' },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-emerald-950 text-white border-b border-emerald-900 sticky top-0 z-40 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-extrabold text-white text-base shadow-inner">
              S
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-white">스펙탑 (SpecTop)</span>
              </div>
              <p className="text-[11px] text-emerald-300/90 hidden sm:block">
                가상 비교 데이터 기반 역량 GAP 분석 · 커리어 로드맵 데모
              </p>
            </div>
          </Link>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-200/80">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>규칙 기반 데모</span>
          </div>
        </div>

        <nav className="flex items-center gap-1 mt-3 pt-2 border-t border-emerald-900/80 overflow-x-auto text-xs font-medium">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                  active
                    ? 'bg-emerald-700 text-white font-semibold'
                    : 'text-emerald-200/80 hover:bg-emerald-900 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
