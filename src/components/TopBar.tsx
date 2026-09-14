import { format } from 'date-fns';

export function TopBar() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-bg px-6">
      <div />
      <span className="text-sm text-text-secondary">{format(new Date(), 'EEEE, MMMM d, yyyy')}</span>
    </header>
  );
}
