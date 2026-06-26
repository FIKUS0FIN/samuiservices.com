import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
}

export function Button({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  style = {},
  className = '',
  ...props 
}: ButtonProps) {
  const baseStyle = fullWidth ? { width: '100%', ...style } : style;
  
  return (
    <button 
      className={`btn btn-${variant} ${className}`}
      style={baseStyle}
      {...props}
    >
      {children}
    </button>
  );
}
