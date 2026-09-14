import { NavLink } from 'react-router-dom';
import { Dumbbell } from 'lucide-react';
import clsx from 'clsx';
import { navItems } from '../routes';

export function Sidebar() {
  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-border bg-surface">
      <div className="flex h-14 items-center gap-2 px-5">
        <Dumbbell size={20} className="text-accent" />
        <span className="text-sm font-semibold text-text-primary">Training Tracker</span>
      </div>
      <nav className="flex flex-col gap-1 px-3 py-2">
        {navItems.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 rounded-md border-l-2 px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'border-accent bg-surface-hover text-accent-light'
                  : 'border-transparent text-text-secondary hover:bg-surface-hover hover:text-text-primary',
              )
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
