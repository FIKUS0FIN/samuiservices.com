import { InputHTMLAttributes, useId } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export function Input({ 
  label, 
  error, 
  fullWidth = false, 
  className = '',
  id,
  'aria-describedby': ariaDescribedBy,
  ...props 
}: InputProps) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;

  return (
    <div className={`flex flex-col gap-2 ${fullWidth ? 'w-full' : 'w-full md:w-auto'}`}>
      {label && (
        <label htmlFor={inputId} className="font-label-md text-sm text-on-surface-variant ml-1">
          {label}
          {props.required && (
            <span className="text-error ml-1" aria-hidden="true" title="Required">*</span>
          )}
        </label>
      )}
      <input 
        id={inputId}
        className={`bg-surface-container-low border rounded-lg p-3 font-body-md text-on-surface placeholder:opacity-50 transition-all focus:border-primary focus:ring-1 focus:ring-primary ${error ? 'border-error' : 'border-outline-variant'} ${className}`}
        aria-invalid={!!error}
        aria-describedby={[ariaDescribedBy, error ? errorId : undefined].filter(Boolean).join(' ') || undefined}
        {...props}
      />
      {error && (
        <span id={errorId} className="text-error text-xs ml-1">
          {error}
        </span>
      )}
    </div>
  );
}
