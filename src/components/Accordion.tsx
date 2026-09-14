import { useState } from 'react';
import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';

export interface AccordionItemData {
  id: string;
  title: ReactNode;
  content: ReactNode;
}

export interface AccordionProps {
  items: AccordionItemData[];
  allowMultiple?: boolean;
  defaultOpenIds?: string[];
  className?: string;
}

export function Accordion({ items, allowMultiple = false, defaultOpenIds = [], className }: AccordionProps) {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set(defaultOpenIds));

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(allowMultiple ? prev : []);
      if (prev.has(id)) {
        if (allowMultiple) next.delete(id);
        // single-open mode: clicking the open item closes it (next stays empty)
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className={clsx('divide-y divide-border rounded-card border border-border', className)}>
      {items.map((item) => {
        const isOpen = openIds.has(item.id);
        return (
          <div key={item.id} className="bg-surface first:rounded-t-card last:rounded-b-card">
            <button
              type="button"
              onClick={() => toggle(item.id)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-text-primary hover:bg-surface-hover"
            >
              {item.title}
              <ChevronDown
                size={16}
                className={clsx('shrink-0 text-text-secondary transition-transform', isOpen && 'rotate-180')}
              />
            </button>
            {isOpen && <div className="px-4 pb-4 text-sm text-text-secondary">{item.content}</div>}
          </div>
        );
      })}
    </div>
  );
}
