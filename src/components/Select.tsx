import { forwardRef, useId } from 'react';
import type { SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, children, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id ?? generatedId;
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-text-secondary">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={clsx(
              'h-10 w-full appearance-none rounded-md border border-border bg-bg px-3 pr-9 text-sm text-text-primary',
              'focus:outline-none focus:ring-2 focus:ring-accent',
              error && 'border-muted-danger focus:ring-muted-danger',
              className,
            )}
            {...props}
          >
            {children}
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary"
          />
        </div>
        {error && <span className="text-xs text-muted-danger">{error}</span>}
      </div>
    );
  },
);
Select.displayName = 'Select';
