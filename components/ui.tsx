import React from 'react';

// Icon set & Logo ported verbatim from the Figma reference (spectop UI design/src/App.tsx)
// so visual language (stroke weight, sizing, brand symbol) stays identical.
// "home" and "menu" were added in the same minimal line-icon style for the top nav.

export type IconName =
  | 'stack' | 'user' | 'building' | 'compare' | 'report' | 'trend' | 'bell' | 'chevron' | 'check'
  | 'plus' | 'edit' | 'x' | 'search' | 'info' | 'clock' | 'refresh' | 'trash' | 'book' | 'award'
  | 'language' | 'certificate' | 'users' | 'activity' | 'course' | 'project' | 'work' | 'link'
  | 'home' | 'menu';

const paths: Record<IconName, React.ReactNode> = {
  stack: <><path d="M5 16h7v5H5zM12 9h7v12h-7zM8 3h7v6H8z" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  building: <><path d="M4 21V5l8-3v19M12 8h8v13M8 7v1M8 12v1M8 17v1M16 12v1M16 17v1M2 21h20" /></>,
  compare: <><path d="M4 7h13M14 4l3 3-3 3M20 17H7M10 14l-3 3 3 3" /></>,
  report: <><path d="M5 3h14v18H5z" /><path d="M9 8h6M9 12h6M9 16h3" /></>,
  trend: <><path d="M4 18 10 12l4 3 6-8" /><path d="M15 7h5v5" /></>,
  bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
  chevron: <path d="m9 18 6-6-6-6" />,
  check: <path d="m5 12 4 4L19 6" />,
  plus: <><path d="M12 5v14M5 12h14" /></>,
  edit: <><path d="m14 5 5 5M4 20l4-1 11-11-4-4L4 15z" /></>,
  x: <><path d="m6 6 12 12M18 6 6 18" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7h.01" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  refresh: <><path d="M20 7v5h-5" /><path d="M19 12a8 8 0 1 0-2 5" /></>,
  trash: <><path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6" /></>,
  book: <><path d="M4 4h12a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3z" /><path d="M7 16h12" /></>,
  award: <><circle cx="12" cy="9" r="6" /><path d="m8 14-1 8 5-3 5 3-1-8" /></>,
  language: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" /></>,
  certificate: <><rect x="4" y="3" width="16" height="14" rx="2" /><path d="M8 7h8M8 11h5M10 17v5l2-2 2 2v-5" /></>,
  users: <><circle cx="9" cy="8" r="3" /><path d="M3 19a6 6 0 0 1 12 0M16 7a3 3 0 0 1 0 6M17 14a5 5 0 0 1 4 5" /></>,
  activity: <><path d="M3 12h4l2-6 4 12 2-6h6" /></>,
  course: <><path d="m3 7 9-4 9 4-9 4zM6 9v6c3 3 9 3 12 0V9" /></>,
  project: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M8 4v16M8 9h13M12 13h5M12 17h3" /></>,
  work: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V4h8v3M3 12h18" /></>,
  link: <><path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7.5l-1 1" /><path d="M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7.5l1-1" /></>,
  home: <><path d="m3 11 9-7 9 7" /><path d="M6 10v10h12V10" /><path d="M10 20v-6h4v6" /></>,
  menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
};

export function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {paths[name]}
    </svg>
  );
}

export function Logo() {
  return (
    <div className="brand">
      <span className="brand-symbol"><i /><i /><i /></span>
      <span>스펙탑</span>
    </div>
  );
}

export function Button({
  children,
  variant = 'primary',
  icon,
  onClick,
  disabled = false,
  type = 'button',
}: {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  icon?: IconName;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
}) {
  return (
    <button type={type} className={`btn btn-${variant}`} onClick={onClick} disabled={disabled}>
      {icon && <Icon name={icon} size={18} />}
      <span>{children}</span>
    </button>
  );
}

export function Tag({ children, tone = 'gray' }: { children: React.ReactNode; tone?: 'gray' | 'indigo' | 'teal' | 'amber' | 'blue' | 'red' }) {
  return <span className={`tag tag-${tone}`}>{children}</span>;
}

export function PageHeader({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="page-header">
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </div>
  );
}
