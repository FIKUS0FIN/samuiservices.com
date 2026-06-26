import { ReactNode, HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ children, className = '', style = {}, ...props }: CardProps) {
  return (
    <div 
      className={`card ${className}`} 
      style={style}
      {...props}
    >
      {children}
    </div>
  );
}
