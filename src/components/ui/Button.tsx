import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
}

export function Button({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '',
  ...props 
}: ButtonProps) {

  const baseClasses = "inline-flex items-center justify-center px-6 py-3 rounded-global font-heading font-bold text-base cursor-pointer transition-all duration-200 border-none outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 active:scale-95";
  const widthClass = fullWidth ? 'w-full' : '';

  const variantClasses = {
    primary: "bg-primary text-white shadow-md hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-lg",
    secondary: "bg-transparent text-text-main border-2 border-primary hover:bg-surface-card hover:text-primary-hover hover:-translate-y-0.5"
  };
  
  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
