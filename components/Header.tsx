'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon, Logo, type IconName } from './ui';

const NAV: { href: string; label: string; icon: IconName }[] = [
  { href: '/', label: '홈', icon: 'home' },
  { href: '/profile', label: '프로필', icon: 'user' },
  { href: '/goal', label: '목표 설정', icon: 'building' },
  { href: '/experiences', label: '경험 기록', icon: 'stack' },
  { href: '/analysis', label: '역량 분석', icon: 'compare' },
  { href: '/recommendations', label: '추천 활동', icon: 'trend' },
  { href: '/roadmap', label: '로드맵', icon: 'clock' },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <header className="topnav">
      <div className="topnav-inner">
        <Link href="/" className="logo-button">
          <Logo />
        </Link>

        <nav className="topnav-menu">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`topnav-item ${isActive(item.href) ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button className="menu-toggle" onClick={() => setMobileOpen((v) => !v)} aria-label="메뉴 열기">
          <Icon name={mobileOpen ? 'x' : 'menu'} size={20} />
        </button>
      </div>

      {mobileOpen && (
        <div className="mobile-menu">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={isActive(item.href) ? 'active' : ''}
              onClick={() => setMobileOpen(false)}
            >
              <Icon name={item.icon} size={18} />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
