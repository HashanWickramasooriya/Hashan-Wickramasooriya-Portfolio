'use client';

import { useId, useState } from 'react';
import { cn } from '@/lib/utils';

interface FloatingInputProps {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  multiline?: boolean;
  value: string;
  onChange: (value: string) => void;
}

export function FloatingInput({
  label,
  name,
  type = 'text',
  required,
  multiline,
  value,
  onChange,
}: FloatingInputProps) {
  const id = useId();
  const [focused, setFocused] = useState(false);
  const floated = focused || value.length > 0;

  const fieldClasses =
    'peer border-border-strong bg-surface text-foreground ease-swift w-full rounded-xl border px-4 pt-6 pb-2.5 text-sm transition-colors duration-200 focus:border-accent focus:outline-none';

  const labelClasses = cn(
    'text-muted ease-swift pointer-events-none absolute left-4 transition-all duration-200',
    floated ? 'top-2 text-xs' : multiline ? 'top-4 text-sm' : 'top-1/2 -translate-y-1/2 text-sm',
  );

  return (
    <div className="relative">
      {multiline ? (
        <textarea
          id={id}
          name={name}
          required={required}
          rows={5}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={fieldClasses}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={fieldClasses}
        />
      )}
      <label htmlFor={id} className={labelClasses}>
        {label}
      </label>
    </div>
  );
}
