import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export function Input({ 
  label, 
  error, 
  fullWidth = false, 
  style = {},
  className = '',
  ...props 
}: InputProps) {
  const baseStyle = fullWidth ? { width: '100%', ...style } : style;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: fullWidth ? '100%' : 'auto' }}>
      {label && (
        <label style={{ fontWeight: 500, color: 'var(--text-main)', fontSize: '0.875rem' }}>
          {label}
        </label>
      )}
      <input 
        className={`input-field ${className}`}
        style={{
          ...baseStyle,
          borderColor: error ? 'var(--error-color, #ef4444)' : 'var(--border-color)',
        }}
        {...props}
      />
      {error && (
        <span style={{ color: 'var(--error-color, #ef4444)', fontSize: '0.75rem' }}>
          {error}
        </span>
      )}
    </div>
  );
}
