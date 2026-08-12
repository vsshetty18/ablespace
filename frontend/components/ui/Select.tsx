import { SelectHTMLAttributes, forwardRef } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
}

// Plain native <select>, not a custom-styled dropdown — deliberate choice:
// a native select gets keyboard nav, mobile-native picker UI, and
// accessibility for free. If the Figma shows a custom-styled dropdown
// (not the OS-native one), I'll revisit this with a proper listbox
// pattern once I see it — that's a real UI difference worth getting right,
// not something to guess at now.
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, id, className = '', ...props }, ref) => {
    const selectId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-foreground">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={`
            h-10 rounded-md border bg-surface px-3 text-sm text-foreground
            focus:outline-none focus:ring-2 focus:ring-primary
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-danger' : 'border-border'}
            ${className}
          `.trim().replace(/\s+/g, ' ')}
          aria-invalid={!!error}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="text-sm text-danger">{error}</p>}
      </div>
    );
  },
);

Select.displayName = 'Select';
